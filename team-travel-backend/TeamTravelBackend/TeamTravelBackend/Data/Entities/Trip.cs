using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TeamTravelBackend.Data.Entities
{
    public class Trip
    {
        public int TripId { get; set; }
        public int DriverId { get; set; }
        public User User { get; set; }
        [Required]
        public string Origin { get; set; }
        [Required]
        public string Destination { get; set; }
        public DateTime LeavingDate { get; set; }
        public DateTime? ReturnDate { get; set; }
        public int MaxSeats { get; set; }
        public string CarPlate { get; set; }
        public Car Car { get; set; }
        [Required]
        public string CarType { get; set; }
        [Required]
        public string Status { get; set; }
        public string Comments { get; set; }
        public List<Passenger> Passengers { get; set; }
    }
}
