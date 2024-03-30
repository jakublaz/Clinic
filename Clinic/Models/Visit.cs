using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Clinic.Models;

public class Visit{
    public string? PatientId { get; set; }
    public string? PatientName { get; set; }

    [Required]
    [Key]
    public string DoctorId { get; set; }

    [Required]
    public string DoctorName { get; set; }

    [Required]
    [Key]
    public DateTime VisitDateTime { get; set; }

    public string? Description { get; set; }

    [Required]
    public string Specjalization { get; set; }

}