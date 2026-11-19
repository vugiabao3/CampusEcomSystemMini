using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CampusEcomSystemMini.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AdddbEcom : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GamificationPointTransactions_Users_UserId",
                table: "GamificationPointTransactions");

            migrationBuilder.DropIndex(
                name: "IX_GamificationPointTransactions_UserId",
                table: "GamificationPointTransactions");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_GamificationPointTransactions_UserId",
                table: "GamificationPointTransactions",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_GamificationPointTransactions_Users_UserId",
                table: "GamificationPointTransactions",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
