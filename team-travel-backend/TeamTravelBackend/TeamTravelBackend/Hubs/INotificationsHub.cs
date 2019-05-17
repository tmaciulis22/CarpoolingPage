using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TeamTravelBackend.Hubs
{
    interface INotificationsHub
    {
        Task JoinTripNotif(int tripId);
        Task DeclineTripNotif(int tripId);
        Task CancelTripNotif(int tripId);
        Task UpdateTripNotif(int tripId);
        Task CompleteTripNotif();
    }
}
