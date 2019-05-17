using Microsoft.EntityFrameworkCore;
using TeamTravelBackend.Data.Entities;

namespace TeamTravelBackend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Passenger>().HasKey(table => new
            {
                table.TripId,
                table.UserId
            });
            modelBuilder.Entity<Passenger>()
                .HasOne(bc => bc.Trip)
                .WithMany(b => b.Passengers)
                .HasForeignKey(bc => bc.TripId);
            modelBuilder.Entity<Passenger>()
                .HasOne(bc => bc.User)
                .WithMany(c => c.Passengers)
                .HasForeignKey(bc => bc.UserId);

            modelBuilder.Entity<Trip>()
                .HasOne(a => a.User)
                .WithOne().OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Trip>()
                .HasOne(a => a.User)
                .WithMany(g => g.Trips)
                .HasForeignKey(s => s.DriverId);

            modelBuilder.Entity<Trip>()
                .HasOne(a => a.Car)
                .WithOne().OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Trip>()
                .HasOne(a => a.Car)
                .WithMany(g => g.Trips)
                .HasForeignKey(s => s.CarPlate);


            modelBuilder.Entity<User>()
                .HasIndex(a => a.Email)
                .IsUnique();
        }

        public DbSet<Car> Cars { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Trip> Trips { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Passenger> Passengers { get; set; }
    }
}
