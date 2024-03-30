using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Clinic.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;

namespace Clinic.Controllers{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly DataContext _context;

        public UserController(UserManager<User> userManager,DataContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        // GET: api/User
        [Authorize(Roles = "Manager")]
        [HttpGet("GetPatients")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return Ok(await _userManager.GetUsersInRoleAsync("Patient"));
        }

        // PUT: api/User/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [Authorize(Roles = "Manager")]
        [HttpGet("GetPatient{UserName}")]
        public async Task<ActionResult<User>> GetPatient(string UserName)
        {
            var user = await _userManager.FindByNameAsync(UserName);

            if (user == null)
            {
                return NotFound(); // Jeśli użytkownik o podanej nazwie nie istnieje, zwróć 404
            }

            var isInRole = await _userManager.IsInRoleAsync(user, "Patient"); // Sprawdzenie, czy użytkownik należy do roli "Patient"

            if (!isInRole)
            {
                return Forbid(); // Jeśli użytkownik nie jest pacjentem, zwróć 403 (Forbidden)
            }

            return user; // Zwróć znalezionego użytkownika (jeśli jest pacientem)
        }

        // POST: api/User
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("RegisterPatient")]
        public async Task<ActionResult<User>> CreateUser(RegisterPatient model)
        {
            
            var newUser = new User
            {
                Name = model.Name,
                Surname = model.Surname,
                Specjalization = "none",
                UserName = model.Username,
                Password = model.Password,
                Activated = false,
                Email = model.Email,
                PhoneNumber = model.phoneNumber,
                LockoutEnd = DateTime.Now
            };


            var result = await _userManager.CreateAsync(newUser, model.Password);

            if (result.Succeeded)
            {
                var roleResult = new IdentityResult();
                roleResult = await _userManager.AddToRoleAsync(newUser, "Patient");
                if (roleResult.Succeeded)
                {
                    // await _signInManager.SignInAsync(newUser, isPersistent: false);
                    return Ok("Successfully created patient");
                }
                else
                {
                    return StatusCode(500, new { Error = "Failed to assign role to the user " });
                }
            }
            else
            {
                // var errorMessages = result.Errors.Select(e => e.Description).ToList();   //wyświetlanie błędów
                // foreach (var errorMessage in errorMessages)
                // {
                //     Console.WriteLine(errorMessage); // Możesz wyświetlić błąd w konsoli
                //     // Tutaj możesz zrobić coś z pojedynczym błędem, np. zalogować go
                // }
                return StatusCode(500, new { Error = "Failed to create user"});
            }
        }

        [Authorize(Roles = "Patient")]
        [HttpPut("ScheduleVisit/{Time}/{DoctorId}")]
        public async Task<IActionResult> ScheduleVisit(DateTime Time, string DoctorId)
        {
            if (Time == null || DoctorId == null)
            {
                return BadRequest();
            }

            if(Time < DateTime.Now)
            {
                return BadRequest("You cannot schedule visit in the past");
            }

            var user = await _userManager.FindByIdAsync(DoctorId);

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

            if (existingVisit == null)
            {
                return BadRequest("There is no visit in this time");
            }
            string userId = User.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
            var patient = await _userManager.FindByIdAsync(userId);

            existingVisit.PatientId = userId;
            existingVisit.PatientName = patient.Name + " " + patient.Surname;

            _context.Visits.Update(existingVisit);
            await _context.SaveChangesAsync();

            return Ok("Successfully scheduled visit");
        }

        [Authorize(Roles = "Patient")]
        [HttpPut("CancelVisit/{Time}/{DoctorId}")]
        public async Task<IActionResult> CancelVisit(DateTime Time, string DoctorId)
        {
            if (Time == null || DoctorId == null)
            {
                return BadRequest();
            }

            if(Time < DateTime.Now)
            {
                return BadRequest("You cannot cancel visit in the past");
            }

            var user = await _userManager.FindByIdAsync(DoctorId);

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

            if(existingVisit.Description != null)
            {
                return BadRequest("You cannot cancel visit that already took place");
            }

            if (existingVisit == null || existingVisit.PatientId != User.Claims.FirstOrDefault(c => c.Type == "id")?.Value)
            {
                return BadRequest("There is no visit in this time for you");
            }

            existingVisit.PatientId = null;
            existingVisit.PatientName = null;

            _context.Visits.Update(existingVisit);
            await _context.SaveChangesAsync();

            return Ok("Successfully canceled visit");
        }

        [Authorize(Roles = "Patient")]
        [HttpGet("MyVisits")]
        public async Task<IActionResult> GetVisits()
        {
            string userId = User.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
            var visits = await _context.Visits.Where(v => v.PatientId == userId && v.VisitDateTime > DateTime.Now && v.Description == null).OrderBy(v => v.VisitDateTime).ToListAsync();

            return Ok(visits);
        }

        [Authorize(Roles = "Patient")]
        [HttpGet("HistoryVisits")]
        public async Task<IActionResult> GetVisitsHistory()        //do sprawdzenia
        {
            string userId = User.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
            var visits = await _context.Visits.Where(v => v.PatientId == userId && v.VisitDateTime < DateTime.Now).ToListAsync();

            return Ok(visits);
        }

        [Authorize(Roles = "Patient")]
        [HttpGet("IsActivated/{userName}")]
        public async Task<IActionResult> IsActivated(string userName)
        {
            var user = await _userManager.FindByNameAsync(userName);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user.Activated);
        }


        private bool UserExists(string UserName)  //to  be checked
        {
            return _context.Users.Any(e => e.UserName == UserName);
        }
    }
}