using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CampusEcomSystemMini.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddMatchingPreferenceColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RoomAmenitiesJson",
                table: "Preferences",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RoomArea",
                table: "Preferences",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "RoomBudgetMax",
                table: "Preferences",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "RoomBudgetMin",
                table: "Preferences",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RoomCleanliness",
                table: "Preferences",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RoomCookingHabits",
                table: "Preferences",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RoomNoisePreference",
                table: "Preferences",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RoomOriginalInputJson",
                table: "Preferences",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RoomSleepSchedule",
                table: "Preferences",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RoomType",
                table: "Preferences",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StudyFormat",
                table: "Preferences",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StudyFrequency",
                table: "Preferences",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StudyGoal",
                table: "Preferences",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StudyLanguagesJson",
                table: "Preferences",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StudyMethod",
                table: "Preferences",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StudyOriginalInputJson",
                table: "Preferences",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StudyProficiency",
                table: "Preferences",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StudySubjectsJson",
                table: "Preferences",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StudyTime",
                table: "Preferences",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RoomAmenitiesJson",
                table: "Preferences");

            migrationBuilder.DropColumn(
                name: "RoomArea",
                table: "Preferences");

            migrationBuilder.DropColumn(
                name: "RoomBudgetMax",
                table: "Preferences");

            migrationBuilder.DropColumn(
                name: "RoomBudgetMin",
                table: "Preferences");

            migrationBuilder.DropColumn(
                name: "RoomCleanliness",
                table: "Preferences");

            migrationBuilder.DropColumn(
                name: "RoomCookingHabits",
                table: "Preferences");

            migrationBuilder.DropColumn(
                name: "RoomNoisePreference",
                table: "Preferences");

            migrationBuilder.DropColumn(
                name: "RoomOriginalInputJson",
                table: "Preferences");

            migrationBuilder.DropColumn(
                name: "RoomSleepSchedule",
                table: "Preferences");

            migrationBuilder.DropColumn(
                name: "RoomType",
                table: "Preferences");

            migrationBuilder.DropColumn(
                name: "StudyFormat",
                table: "Preferences");

            migrationBuilder.DropColumn(
                name: "StudyFrequency",
                table: "Preferences");

            migrationBuilder.DropColumn(
                name: "StudyGoal",
                table: "Preferences");

            migrationBuilder.DropColumn(
                name: "StudyLanguagesJson",
                table: "Preferences");

            migrationBuilder.DropColumn(
                name: "StudyMethod",
                table: "Preferences");

            migrationBuilder.DropColumn(
                name: "StudyOriginalInputJson",
                table: "Preferences");

            migrationBuilder.DropColumn(
                name: "StudyProficiency",
                table: "Preferences");

            migrationBuilder.DropColumn(
                name: "StudySubjectsJson",
                table: "Preferences");

            migrationBuilder.DropColumn(
                name: "StudyTime",
                table: "Preferences");
        }
    }
}
