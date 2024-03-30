using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Clinic.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace Clinic.Controllers{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;

        private readonly IPasswordHasher<User> _passwordHasher;
        private readonly DataContext _context;

        public AuthController(UserManager<User> userManager, SignInManager<User> signInManager, IPasswordHasher<User> passwordHasher, DataContext context)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _passwordHasher = passwordHasher;
            _context = context;
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(Login model)
        {
            var key = JwtAuthenticationExtension.GetJwtSecretKey();

            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == model.Username);

            if (user != null)
            {
                var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, lockoutOnFailure: false);

                if (result.Succeeded)
                {
                    var roles = await _userManager.GetRolesAsync(user); // Pobranie ról z bazy danych dla użytkownika

                    var tokenHandler = new JwtSecurityTokenHandler();
                    var tokenDescriptor = new SecurityTokenDescriptor
                    {
                        Subject = new ClaimsIdentity(), // Pusta ClaimsIdentity
                        Expires = DateTime.UtcNow.AddHours(1),
                        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)), SecurityAlgorithms.HmacSha256Signature)
                    };

                    // Dodanie claimów do istniejącej ClaimsIdentity
                    foreach (var role in roles)
                    {
                        tokenDescriptor.Subject.AddClaim(new Claim(ClaimTypes.Role, role));
                    }

                    // Dodanie pozostałych claimów
                    tokenDescriptor.Subject.AddClaims(new[]
                    {
                        new Claim(ClaimTypes.Name, user.UserName),
                        new Claim("id", user.Id),
                        new Claim("aud", "JA"),
                        new Claim("iss", "Clinic.com")
                    });

                    var token = tokenHandler.CreateToken(tokenDescriptor);
                    var tokenString = tokenHandler.WriteToken(token);

                    return Ok(new { Token = tokenString });
                }
            }
            // Obsługa nieprawidłowych danych logowania
            return BadRequest("Wrong username or password");
        }

    }
}