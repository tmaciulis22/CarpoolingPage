using Microsoft.EntityFrameworkCore.Migrations;

namespace TeamTravelBackend.Migrations
{
    public partial class TripToCarFK : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "CarPlate",
                table: "Trips",
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Trips_CarPlate",
                table: "Trips",
                column: "CarPlate");

            migrationBuilder.AddForeignKey(
                name: "FK_Trips_Cars_CarPlate",
                table: "Trips",
                column: "CarPlate",
                principalTable: "Cars",
                principalColumn: "CarPlate",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Trips_Cars_CarPlate",
                table: "Trips");

            migrationBuilder.DropIndex(
                name: "IX_Trips_CarPlate",
                table: "Trips");

            migrationBuilder.AlterColumn<string>(
                name: "CarPlate",
                table: "Trips",
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);
        }
    }
}
