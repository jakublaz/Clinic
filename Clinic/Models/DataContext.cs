using Clinic.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Clinic.Models
{
    public class DataContext : IdentityDbContext<User>
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {

        }

        public DbSet<Visit> Visits { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Konfiguracja klucza złożonego dla modelu Visit, jeśli jest taka potrzeba
            modelBuilder.Entity<Visit>()
                .HasKey(v => new { v.DoctorId, v.VisitDateTime });

            // Inne konfiguracje...

            base.OnModelCreating(modelBuilder);
        }
    }
}
