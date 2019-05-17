using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TeamTravelBackend.Data.Entities;

namespace TeamTravelBackend.Hubs
{
    public class NotificationDataModel
    {
        public User      CurrentUser   { get; set; }
        public Trip      Trip          { get; set; }
        public List<int> PassengersIds { get; set; }
    }
}
