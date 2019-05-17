using Microsoft.EntityFrameworkCore.Migrations;

namespace TeamTravelBackend.Migrations
{
    public partial class CarPlatesNullable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "CarPlate",
                table: "Trips",
                nullable: true,
                oldClrType: typeof(string));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "CarPlate",
                table: "Trips",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);
        }
    }
}
