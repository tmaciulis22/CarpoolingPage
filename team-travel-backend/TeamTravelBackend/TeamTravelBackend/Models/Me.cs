using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TeamTravelBackend.Models
{
    public class Me
    {
        public int Id    { get; set; }
        public string FullName    { get; set; }
        public string PhoneNumber { get; set; }
        public string SlackId     { get; set; }
        public string MainOffice  { get; set; }
        public bool   IsDriver    { get; set; }
        public string[]   CarPlates    { get; set; }
        public int RoleId { get; set; }
    }
}
