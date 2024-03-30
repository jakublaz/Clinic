using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Clinic.Migrations
{
    /// <inheritdoc />
    public partial class AddVisitCLass : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Visits",
                columns: table => new
                {
                    DoctorId = table.Column<string>(type: "TEXT", nullable: false),
                    VisitDateTime = table.Column<DateTime>(type: "TEXT", nullable: false),
                    PatientId = table.Column<string>(type: "TEXT", nullable: true),
                    PatientName = table.Column<string>(type: "TEXT", nullable: true),
                    DoctorName = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    Specjalization = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Visits", x => new { x.DoctorId, x.VisitDateTime });
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Visits");
        }
    }
}
