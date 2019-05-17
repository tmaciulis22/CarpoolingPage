using System.ComponentModel.DataAnnotations;

namespace TeamTravelBackend.Data.Entities
{
    public class Passenger
    {
        [Key]
        public int TripId { get; set; }
        public Trip Trip { get; set; }
        [Key]
        public int UserId { get; set; }
        public User User { get; set; }
    }
}
