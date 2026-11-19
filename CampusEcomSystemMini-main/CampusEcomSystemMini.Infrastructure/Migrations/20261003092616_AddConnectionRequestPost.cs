using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CampusEcomSystemMini.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddConnectionRequestPost : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "PostId",
                table: "ConnectionRequests",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ConnectionRequests_PostId",
                table: "ConnectionRequests",
                column: "PostId");

            migrationBuilder.AddForeignKey(
                name: "FK_ConnectionRequests_Posts_PostId",
                table: "ConnectionRequests",
                column: "PostId",
                principalTable: "Posts",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ConnectionRequests_Posts_PostId",
                table: "ConnectionRequests");

            migrationBuilder.DropIndex(
                name: "IX_ConnectionRequests_PostId",
                table: "ConnectionRequests");

            migrationBuilder.DropColumn(
                name: "PostId",
                table: "ConnectionRequests");
        }
    }
}
