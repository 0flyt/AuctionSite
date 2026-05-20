using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AuctionSite.Api.Migrations
{
    /// <inheritdoc />
    public partial class SeedAdmin : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Admins",
                columns: new[] { "Id", "Email", "Password" },
                values: new object[] { 1, "admin@admin.com", "$2a$11$GB122J205i0VVKNnI9g9COBwTu6XHaEZkEdcqwyeus8X0DKhS6EK2" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Admins",
                keyColumn: "Id",
                keyValue: 1);
        }
    }
}
