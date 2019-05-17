using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TeamTravelBackend.Models
{
    public class FEPassenger
    {
        public int TripId { get; set; }
        public int UserId { get; set; }
        public string FullName { get; set; }
    }
}
