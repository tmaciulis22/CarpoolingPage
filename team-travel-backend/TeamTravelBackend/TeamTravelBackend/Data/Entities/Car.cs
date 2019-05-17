using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TeamTravelBackend.Data.Entities
{
    public class Car
    {
        [Key]
        public string CarPlate { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public ICollection<Trip> Trips { get; set; }
    }
}
