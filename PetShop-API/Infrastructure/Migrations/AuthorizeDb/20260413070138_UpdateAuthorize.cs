using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations.AuthorizeDb
{
    /// <inheritdoc />
    public partial class UpdateAuthorize : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CurrentOTP",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastOTPSentAt",
                table: "AspNetUsers",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "OTPExpiresAt",
                table: "AspNetUsers",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CurrentOTP",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "LastOTPSentAt",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "OTPExpiresAt",
                table: "AspNetUsers");
        }
    }
}
