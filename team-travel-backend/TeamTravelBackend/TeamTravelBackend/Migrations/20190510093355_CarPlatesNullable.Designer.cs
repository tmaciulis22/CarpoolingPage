﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using TeamTravelBackend.Data;

namespace TeamTravelBackend.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20190510093355_CarPlatesNullable")]
    partial class CarPlatesNullable
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.1.8-servicing-32085")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("TeamTravelBackend.Data.Entities.Car", b =>
                {
                    b.Property<string>("CarPlate")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("UserId");

                    b.HasKey("CarPlate");

                    b.HasIndex("UserId");

                    b.ToTable("Cars");
                });

            modelBuilder.Entity("TeamTravelBackend.Data.Entities.Passenger", b =>
                {
                    b.Property<int>("TripId");

                    b.Property<int>("UserId");

                    b.HasKey("TripId", "UserId");

                    b.HasIndex("UserId");

                    b.ToTable("Passengers");
                });

            modelBuilder.Entity("TeamTravelBackend.Data.Entities.Role", b =>
                {
                    b.Property<int>("RoleId")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("RoleName");

                    b.HasKey("RoleId");

                    b.ToTable("Roles");
                });

            modelBuilder.Entity("TeamTravelBackend.Data.Entities.Trip", b =>
                {
                    b.Property<int>("TripId")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("CarPlate");

                    b.Property<string>("CarType")
                        .IsRequired();

                    b.Property<string>("Comments");

                    b.Property<string>("Destination")
                        .IsRequired();

                    b.Property<int>("DriverId");

                    b.Property<DateTime>("LeavingDate");

                    b.Property<int>("MaxSeats");

                    b.Property<string>("Origin")
                        .IsRequired();

                    b.Property<DateTime?>("ReturnDate");

                    b.Property<string>("Status")
                        .IsRequired();

                    b.HasKey("TripId");

                    b.HasIndex("DriverId");

                    b.ToTable("Trips");
                });

            modelBuilder.Entity("TeamTravelBackend.Data.Entities.User", b =>
                {
                    b.Property<int>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Email")
                        .IsRequired();

                    b.Property<string>("FullName")
                        .IsRequired();

                    b.Property<bool>("IsDriver");

                    b.Property<string>("MainOffice");

                    b.Property<string>("Password")
                        .IsRequired();

                    b.Property<string>("PhoneNumber");

                    b.Property<int>("RoleId");

                    b.Property<string>("SlackId");

                    b.HasKey("UserId");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.HasIndex("RoleId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("TeamTravelBackend.Data.Entities.Car", b =>
                {
                    b.HasOne("TeamTravelBackend.Data.Entities.User", "User")
                        .WithMany("Cars")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("TeamTravelBackend.Data.Entities.Passenger", b =>
                {
                    b.HasOne("TeamTravelBackend.Data.Entities.Trip", "Trip")
                        .WithMany("Passengers")
                        .HasForeignKey("TripId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("TeamTravelBackend.Data.Entities.User", "User")
                        .WithMany("Passengers")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("TeamTravelBackend.Data.Entities.Trip", b =>
                {
                    b.HasOne("TeamTravelBackend.Data.Entities.User", "User")
                        .WithMany("Trips")
                        .HasForeignKey("DriverId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("TeamTravelBackend.Data.Entities.User", b =>
                {
                    b.HasOne("TeamTravelBackend.Data.Entities.Role", "Role")
                        .WithMany("Users")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}