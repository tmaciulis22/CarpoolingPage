using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TeamTravelBackend.Data.Entities
{
    public class User
    {
        public int UserId { get; set; }
        [Required]
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
        public string SlackId { get; set; }
        public string MainOffice { get; set; }
        public bool IsDriver { get; set; }
        public int RoleId { get; set; }
        public Role Role { get; set; }
        public ICollection<Passenger> Passengers { get; set; }
        public ICollection<Trip> Trips { get; set; }
        public ICollection<Car> Cars { get; set; }

    }
}
