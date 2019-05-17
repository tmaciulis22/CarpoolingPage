using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TeamTravelBackend.Models;

namespace TeamTravelBackend.DataContracts.Requests
{
    public class UpdateTripRequest
    {
        public int? PassengerId { get; set; }
        public bool? IsLeaving { get; set; }
    }
}
