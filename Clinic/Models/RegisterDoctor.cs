using System.ComponentModel.DataAnnotations;

namespace Clinic.Models;

public class RegisterDoctor
{

    [Required]
    [Display(Name = "Name")]
    public string Name { get; set; }

    [Required]
    [Display(Name = "Surname")]
    public string Surname { get; set; }

    [Required]
    [Display(Name = "Username")]
    public string Username { get; set; }

    [Required]
    [DataType(DataType.Password)]
    [Display(Name = "Password")]
    public string Password { get; set; }

    [DataType(DataType.Password)]
    [Display(Name = "Confirm Password")]
    [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
    public string ConfirmPassword { get; set; }

    [Required]
    public string Email { get; set; }

    [Required]
    public string phoneNumber { get; set; }

    [Required]
    public string Specjalization { get; set; }

}

