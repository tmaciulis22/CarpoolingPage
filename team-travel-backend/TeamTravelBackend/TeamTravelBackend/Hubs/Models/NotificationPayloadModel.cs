using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TeamTravelBackend.Hubs
{
    public class NotificationPayloadModel
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Destination { get; set; }
        public string URL { get; set; }
    }
}
