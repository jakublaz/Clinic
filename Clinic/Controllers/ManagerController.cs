using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Clinic.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Data.Sqlite;

namespace Clinic.Controllers{
    [Route("api/[controller]")]
    [ApiController]
    public class ManagerController : ControllerBase
    {
        public readonly UserManager<User> _userManager;
        public readonly DataContext _context;

        public ManagerController(UserManager<User> userManager, DataContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        [Authorize(Roles = "Manager")]
        [HttpPost("RegisterDoctor")]
        public async Task<IActionResult> CreateDoctor(RegisterDoctor model)
        {
            var user = new User
            {
                Name = model.Name,
                Surname = model.Surname,
                Specjalization = model.Specjalization,
                UserName = model.Username,
                Password = model.Password,
                Activated = true,
                Email = model.Email,
                PhoneNumber = model.phoneNumber,
                LockoutEnd = DateTime.Now

            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "Doctor");
                return Ok("Successfully created doctor");
            }

            return StatusCode(500, new { Error = "Failed to create doctor"});
        }

        // Put: api/Manager/5
        [Authorize(Roles = "Manager")]
        [HttpPut("Activate{userId}")]
        public async Task<ActionResult<IEnumerable<User>>> ActivateAccounts(string userId)
        {
            if(userId == null)
            {
                return BadRequest(new{error = "Id is null"});
            }

            var user = await _userManager.FindByIdAsync(userId);

            if(user == null)
            {
                return NotFound(new{error = "User not found"});
            }

            if(user.Activated){
                return BadRequest("Patient's account already activated");
            }

            user.Activated = true;
            await _userManager.UpdateAsync(user);

            return Ok("Successfully activated account");
        }

        [Authorize(Roles = "Manager")]
        [HttpPost("CreateVisit/{Time}/{DoctorUserName}")]
        public async Task<ActionResult<IEnumerable<User>>> CreateVisit(DateTime Time, string DoctorUserName)
        {
            if(Time < DateTime.Now)
            {
                return BadRequest(new{error = "You cannot schedule visit in the past"});
            }

            if(Time.TimeOfDay < TimeSpan.FromHours(8) || Time.TimeOfDay > TimeSpan.FromHours(20))
            {
                return BadRequest(new{error = "Time is out of bounds"});
            }

            if (Time == null || DoctorUserName == null)
            {
                return BadRequest(new{error = "Something is null"});
            }

            var user = await _userManager.FindByNameAsync(DoctorUserName);

            if (user == null)
            {
                return NotFound();
            }

            var isInRole = await _userManager.IsInRoleAsync(user, "Doctor");

            if (!isInRole)
            {
                return Forbid();
            }

            // Sprawdzenie, czy istnieje wizyta dla danego lekarza w podanym czasie
            var existingVisit = await _context.Visits
                .FirstOrDefaultAsync(v => v.DoctorId == user.Id && v.VisitDateTime == Time);

            if (existingVisit != null)
            {
                return Conflict(new{error ="Visit already exists for this doctor at this time"});
            }

            var visit = new Visit
            {
                PatientId = null,
                PatientName = null,
                DoctorId = user.Id,
                DoctorName = user.Name + " " + user.Surname,
                VisitDateTime = Time,
                Description = null,
                Specjalization = user.Specjalization
            };

            _context.Visits.Add(visit);
            await _context.SaveChangesAsync();

            return Ok("Successfully created visit");
        }

        [Authorize(Roles = "Manager")]
        [HttpPost("CreateSchedule/{TimeStart}/{TimeEnd}/{DoctorUserName}")]
        public async Task<ActionResult<IEnumerable<User>>> CreateSchedule(DateTime TimeStart, DateTime TimeEnd, string DoctorUserName)
        {
            if (TimeStart == null || TimeEnd == null || DoctorUserName == null)
            {
                return BadRequest(new { error = "Something is null" });
            }

            if (TimeStart.Date != TimeEnd.Date || // Check if dates are equal
                TimeStart.TimeOfDay < TimeSpan.FromHours(8) || // Check if start time is after or equal to 8 AM
                TimeEnd.TimeOfDay > TimeSpan.FromHours(20)) // Check if end time is before or equal to 8 PM
            {   
                return BadRequest("Time is out of bounds");
            }

            if(TimeStart < DateTime.Now)
            {
                return BadRequest("You cannot schedule visit in the past");
            }

            if(TimeEnd < DateTime.Now)
            {
                return BadRequest("You cannot schedule visit in the past");
            }

            var user = await _userManager.FindByNameAsync(DoctorUserName);

            if (user == null)
            {
                return NotFound();
            }

            var isInRole = await _userManager.IsInRoleAsync(user, "Doctor");

            if (!isInRole)
            {
                return Forbid();
            }
            
            TimeSpan interval = new TimeSpan(0, 15, 0); // Represents 0 hours, 15 minutes, and 0 seconds

            List<DateTime> timeslots = new List<DateTime>();
            DateTime currentTime = TimeStart;

            while(currentTime < TimeEnd)
            {
                timeslots.Add(currentTime);
                currentTime = currentTime.Add(interval);
            }

            foreach(var slots in timeslots){
                var existingVisit = await _context.Visits
                .FirstOrDefaultAsync(v => v.DoctorId == user.Id && v.VisitDateTime == slots);

                if (existingVisit != null)
                {
                    return Conflict("Visit already exists for this doctor at this time");
                }

                var visit = new Visit
                {
                    PatientId = null,
                    PatientName = null,
                    DoctorId = user.Id,
                    DoctorName = user.Name + " " + user.Surname,
                    VisitDateTime = slots,
                    Description = null,
                    Specjalization = user.Specjalization
                };

                _context.Visits.Add(visit);
                await _context.SaveChangesAsync();
            }
                

            return Ok("Successfully created schedule");
        }

        [HttpPost("Copyvisits")]
        public IActionResult CopyVisits()//do sprawdzenia
        {

            DateTime today = DateTime.Today;
            DayOfWeek currentDayOfWeek = today.DayOfWeek;

            int daysToMonday = ((int)DayOfWeek.Monday - (int)currentDayOfWeek + 7) % 7;
            DateTime monday = today.AddDays(daysToMonday).AddDays(-7);
            DateTime friday = monday.AddDays(4);

            List<Visit> visitData = _context.Visits
                .Where(v => v.VisitDateTime >= monday && v.VisitDateTime <= friday)
                .ToList();

            foreach (var visit in visitData)
            {
                DateTime adjustedDate = visit.VisitDateTime.AddDays(7);

                var existingVisit = _context.Visits.FirstOrDefault(v => v.VisitDateTime == adjustedDate);

                if (existingVisit == null)
                {
                    visit.VisitDateTime = adjustedDate;
                    _context.Visits.Add(visit);
                }
            }

            try
            {
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }

            return Ok("Visits for the next week have been copied successfully.");
        }

        [Authorize(Roles = "Manager")]
        [HttpDelete("DeleteVisit/{Time}/{DoctorFullName}")]
        public async Task<ActionResult<IEnumerable<User>>> DeleteVisit(DateTime Time, string DoctorFullName)
        {
            if (Time == null || DoctorFullName == null || Time < DateTime.Now)
            {
                return BadRequest();
            }
            
            //cutting the name into first and last name
            string[] separatedName = DoctorFullName.Split(' ');
            string firstName = separatedName[0];
            string lastName = separatedName[1];

            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Name == firstName && u.Surname == lastName);

            if (user == null)
            {
                return NotFound("Doctor not found");
            }

            var isInRole = await _userManager.IsInRoleAsync(user, "Doctor");

            if (!isInRole)
            {
                return Forbid();
            }

            var visit = await _context.Visits
                .FirstOrDefaultAsync(v => v.DoctorId == user.Id && v.VisitDateTime == Time);

            if (visit == null)
            {
                return NotFound("Visit not found");
            }

            if(visit.PatientId != null)
            {
                return Conflict("Visit cannot be deleted because it has a patient assigned");
            }

            _context.Visits.Remove(visit);
            await _context.SaveChangesAsync();

            return Ok("Successfully deleted visit");
        }

        [Authorize(Roles = "Manager")]
        [HttpGet("SeeSchedule")]
        public async Task<IActionResult> SeeScheduleWeekly(){   // do sprawdzenia
        
            DateTime today = DateTime.Today;
            DayOfWeek currentDayOfWeek = today.DayOfWeek;

            int daysToMonday = ((int)DayOfWeek.Monday - (int)currentDayOfWeek + 7) % 7;
            DateTime monday = today.AddDays(daysToMonday).AddDays(-7);
            DateTime friday = monday.AddDays(5);

            var visits = await _context.Visits
                .Where(v => v.VisitDateTime >= monday && v.VisitDateTime <= friday)
                .ToListAsync();
            
            return Ok(visits);
        }

        [Authorize(Roles = "Patient")]
        [HttpGet("SeeAllVisitsDoctorSpeciality/{Specjalization}")]
        public async Task<IActionResult> SeeAllVisitsDoctorSpeciality(string Specjalization)
        {
            if(Specjalization == null)
            {
                return BadRequest();
            }

            var visits = await _context.Visits
                .Where(v => v.Specjalization == Specjalization && v.Description == null && v.PatientId == null && v.VisitDateTime > DateTime.Now).OrderBy(v => v.VisitDateTime)
                .ToListAsync();

            return Ok(visits);
        }

        [Authorize(Roles = "Manager")]
        [HttpGet("GetAllUsers")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users.Join(_context.UserRoles, u => u.Id, ur => ur.UserId, (u, ur) => new { u, ur })
                .Join(_context.Roles, u_ur => u_ur.ur.RoleId, r => r.Id, (u_ur, r) => new { u_ur, r })
                .Where(u_ur_r => u_ur_r.r.Name != "Manager")
                .Select(u_ur_r => new
                {
                    u_ur_r.u_ur.u.Id,
                    u_ur_r.u_ur.u.Name,
                    u_ur_r.u_ur.u.Surname,
                    u_ur_r.u_ur.u.Email,
                    u_ur_r.u_ur.u.PhoneNumber,
                    u_ur_r.u_ur.u.UserName,
                    u_ur_r.u_ur.u.Specjalization,
                    u_ur_r.u_ur.u.Activated
                })
                .ToListAsync();

            return Ok(users);
        }

        [Authorize(Roles = "Manager")]
        [HttpDelete("Delete/{userId}")]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            if(userId == null)
            {
                return BadRequest(new {error = "Id is null"});
            }

            var user = await _userManager.FindByIdAsync(userId);

            if(user == null)
            {
                return NotFound(new {error = "User not found"});
            }

            //check if there are any visits with this user
            var visits = await _context.Visits.Where(v => (v.DoctorId == userId || v.PatientId == userId) && v.VisitDateTime > DateTime.Now).ToListAsync();

            foreach(var visit in visits)
            {
                if(visit.PatientId == userId)
                {
                    visit.PatientId = null;
                    visit.PatientName = null;
                }
                else
                {
                    _context.Visits.Remove(visit);
                }
            }
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok("Successfully deleted user");
        }

        [Authorize(Roles = "Manager")]
        [HttpGet("GetUserById/{userId}")]
        public async Task<IActionResult> GetUserById(string userId)
        {
            if(userId == null)
            {
                return BadRequest(new {error = "Id is null"});
            }

            var user = await _userManager.FindByIdAsync(userId);

            if(user == null)
            {
                return NotFound(new {error = "User not found"});
            }

            return Ok(user);
        }

        [Authorize(Roles = "Manager")]
        [HttpPut("UpdateUser/{userId}")]
        public async Task<IActionResult> UpdateUser(string userId, User user)
        {
            if(userId == null)
            {
                return BadRequest(new {error = "Id is null"});
            }

            if(user == null)
            {
                return BadRequest(new {error = "User is null"});
            }

            var userToUpdate = await _userManager.FindByIdAsync(userId);

            if(userToUpdate == null)
            {
                return NotFound(new {error = "User not found"});
            }

            userToUpdate.Name = user.Name;
            userToUpdate.Surname = user.Surname;
            userToUpdate.Email = user.Email;
            userToUpdate.PhoneNumber = user.PhoneNumber;
            userToUpdate.Specjalization = user.Specjalization;
            userToUpdate.UserName = user.UserName;

            if(userToUpdate.Specjalization == "none")
            {
                var visits = _context.Visits.Where(v => v.PatientId == userId);
                foreach(var visit in visits){
                    visit.PatientName = user.Name + " " + user.Surname;
                }
            } else{
                var visits = _context.Visits.Where(v => v.DoctorId == userId);
                foreach(var visit in visits){
                    visit.DoctorName = user.Name + " " + user.Surname;
                }
            }

            await _userManager.UpdateAsync(userToUpdate);

            return Ok("Successfully updated user");
        }
    }
}