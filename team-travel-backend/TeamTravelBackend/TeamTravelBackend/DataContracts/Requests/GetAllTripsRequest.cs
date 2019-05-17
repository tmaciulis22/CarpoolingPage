using System;

namespace TeamTravelBackend.DataContracts.Requests
{
    public class GetAllTripsRequest
    {
        public string    Origin      { get; set; }
        public string    Destination { get; set; }
        public DateTime? Date        { get; set; }
        public int?      DriverID    { get; set; }
        public int?      MaxSeats    { get; set; }
        public string    Status      { get; set; }
        public string    CarType     { get; set; }
    }
}
