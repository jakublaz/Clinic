using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Clinic.Models;

public class User : IdentityUser
{
    // Additional properties
    [Required]
    public string Name { get; set; }

    [Required]
    public string Surname { get; set; }

    [Required]
    public string Password { get; set; }
    [Required]
    public bool Activated { get; set; }

    [Required]
    public string Specjalization{get;set;}
}