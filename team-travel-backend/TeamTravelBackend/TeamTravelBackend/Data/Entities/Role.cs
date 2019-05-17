using System.Collections.Generic;

namespace TeamTravelBackend.Data.Entities
{
    public class Role
    {
        public int RoleId { get; set; }
        public string RoleName { get; set; }
        public ICollection <User> Users { get; set; }
    }
}
