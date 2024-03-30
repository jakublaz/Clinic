using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Clinic.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Clinic.Controllers;

namespace Clinic.Controllers{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly DataContext _context;

        public DoctorController(UserManager<User> userManager,DataContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        // GET: api/Doctor
        [Authorize(Roles = "Manager")]
        [HttpGet("GetDoctors")]
        public async Task<ActionResult<IEnumerable<User>>> GetDoctors()
        {
            return Ok(await _userManager.GetUsersInRoleAsync("Doctor"));
        }

        // PUT: api/Doctor/5
        [Authorize(Roles = "Manager")]
        [HttpGet("GetDoctor{UserName}")]
        public async Task<ActionResult<User>> GetDoctor(string UserName)
        {
            var user = await _userManager.FindByNameAsync(UserName);

            if (user == null)
            {
                return NotFound(); // Jeśli użytkownik o podanej nazwie nie istnieje, zwróć 404
            }

            var isInRole = await _userManager.IsInRoleAsync(user, "Doctor"); // Sprawdzenie, czy użytkownik należy do roli "Doctor"

            if (!isInRole)
            {
                return NotFound(); // Jeśli użytkownik nie jest lekarzem, zwróć 404 (NotFound)
            }

            return user; // Zwróć znalezionego użytkownika (jeśli jest lekarzem)
        }

        [Authorize(Roles = "Manager")]
        [HttpDelete("DeleteDoctor{username}")]
        public async Task<IActionResult> DeleteDoctor(string username)        //do sprawdzenia
        {
            // Pobranie użytkownika na podstawie nazwy użytkownika (username)
            var userToDelete = await _context.Users.FirstOrDefaultAsync(u => u.UserName == username);

            if (userToDelete == null)
            {
                // Jeśli użytkownik nie istnieje, zwróć odpowiedź, że użytkownik nie został znaleziony
                return NotFound();
            }

            // Sprawdzenie czy użytkownik jest pacjentem
            var isDoctor = await _userManager.IsInRoleAsync(userToDelete, "Doctor");

            try
            {
                if (!isDoctor)
                {
                    return BadRequest("Cannot delete someone other than a patient.");
                }

                // Usunięcie użytkownika z bazy danych
                _context.Users.Remove(userToDelete);
                await _context.SaveChangesAsync();
                return Ok("User Deleted");
            }
            catch (Exception ex)
            {
                // Obsługa błędów, można logować błędy lub zwrócić widok błędu
                return StatusCode(500, $"Wystąpił błąd podczas usuwania użytkownika: {ex.Message}");
            }
        }

        [Authorize(Roles = "Doctor")]
        [HttpPut("StartVisit/{Date}/{Description}")]
        public async Task<IActionResult> StartVisit(DateTime Date, string Description)
        {
            string userId = User.Claims.FirstOrDefault(c => c.Type == "id")?.Value;

            if (userId == null)
            {
                return NotFound("User"); // Jeśli użytkownik o podanej nazwie nie istnieje, zwróć 404
            }

            if(Date < DateTime.Now)
            {
                return BadRequest("Date cannot be in the past");
            }

            if(Date.Date != DateTime.Today)
            {
                return BadRequest("You can only start visits for today");
            }

            var isInRole = await _userManager.IsInRoleAsync(await _userManager.FindByIdAsync(userId), "Doctor"); // Sprawdzenie, czy użytkownik należy do roli "Doctor"

            if (!isInRole)
            {
                return Forbid("Role"); // Jeśli użytkownik nie jest lekarzem, zwróć 403 (Forbidden)
            }

            var visit = await _context.Visits.FirstOrDefaultAsync(v => v.DoctorId == userId && v.VisitDateTime == Date);

            if (visit == null)
            {
                return NotFound("Visit");
            }

            if(visit.PatientId == null)
            {
                return BadRequest("There is no patient for this visit");
            }

            visit.Description = Description;
            _context.Entry(visit).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return Ok("Visit started");
        }


        [Authorize(Roles = "Doctor")]
        [HttpGet("MyVisits")]
        public async Task<ActionResult<IEnumerable<Visit>>> GetMyVisits()
        {
            string userId = User.Claims.FirstOrDefault(c => c.Type == "id")?.Value;

            
            if (userId == null)
            {
                return NotFound("User"); // Jeśli użytkownik o podanej nazwie nie istnieje, zwróć 404
            }

            var isInRole = await _userManager.IsInRoleAsync(await _userManager.FindByIdAsync(userId), "Doctor"); // Sprawdzenie, czy użytkownik należy do roli "Doctor"

            if (!isInRole)
            {
                return Forbid("Role"); // Jeśli użytkownik nie jest lekarzem, zwróć 403 (Forbidden)
            }

            Console.WriteLine(DateTime.Now);

            var visits = await _context.Visits.Where(v => v.DoctorId == userId && v.VisitDateTime >= DateTime.Now && v.VisitDateTime.Date == DateTime.Today && v.PatientId != null).ToListAsync();

            if (visits == null || visits.Count == 0)
            {
                return NotFound("No visits today");
            }

            return Ok(visits);
        }
        
        private bool UserExists(string UserName)  //to  be checked
        {
            return _context.Users.Any(e => e.UserName == UserName);
        }
    }
}