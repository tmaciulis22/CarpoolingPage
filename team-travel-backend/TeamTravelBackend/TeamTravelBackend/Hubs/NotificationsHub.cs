using Microsoft.AspNetCore.Http;
using System.Web;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TeamTravelBackend.Data;
using TeamTravelBackend.Data.Entities;
using TeamTravelBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace TeamTravelBackend.Hubs
{
    public class NotificationsHub : Hub, INotificationsHub
    {
        private readonly int currentUserId;
        private readonly AppDbContext appDbContext;
        public static ConcurrentDictionary<string, int> ConnectedUsers = new ConcurrentDictionary<string, int>();
        public static int FakeID = -1;
        public readonly IHttpContextAccessor httpContextAccessor;

        public NotificationsHub(AppDbContext appDbContext, IHttpContextAccessor httpContextAccessor, IConfiguration _config)
        {
            this.appDbContext = appDbContext;
            currentUserId = httpContextAccessor.CurrentUserFromQuery();
            this.httpContextAccessor = httpContextAccessor;
        }

        public override Task OnConnectedAsync()
        {
            ConnectedUsers.TryAdd(Context.ConnectionId, currentUserId);
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            int userToRemove = currentUserId;

            ConnectedUsers.TryRemove(Context.ConnectionId, out userToRemove);

            return base.OnDisconnectedAsync(exception);
        }

        private async Task<User> GetCurrentUser()
        {
            return await appDbContext.Users.Include(user => user.Trips).FirstOrDefaultAsync(x => x.UserId == currentUserId);
        }

        private async Task<Trip> GetTripById(int tripId)
        {
            return await appDbContext.Trips.Include(x => x.User).FirstOrDefaultAsync(x => x.TripId == tripId);
        }

        private async Task<List<int>> GetTripsPassengersIds(int tripId)
        {
            return await appDbContext.Passengers.Where(passenger => passenger.TripId == tripId).Select(person => person.UserId).ToListAsync();
        }

        private async Task<NotificationDataModel> GetNotificationDataModel(int tripId)
        {
            return new NotificationDataModel
            {
                CurrentUser = await GetCurrentUser(),
                Trip = await GetTripById(tripId),
                PassengersIds = await GetTripsPassengersIds(tripId)
        };
        }

        private IEnumerable<string> GetRecipients(NotificationDataModel notificationDataModel)
        {
            return ConnectedUsers.Where(
                user => user.Value != currentUserId // not the person who is notifying right now
                && (notificationDataModel.PassengersIds.Exists(passenger => passenger == user.Value) // passengers
                || user.Value == notificationDataModel.Trip.DriverId)// driver
                ).Select(user => user.Key.ToString());
        }

        public async Task JoinTripNotif(int tripId)
        {
            NotificationDataModel notificationDataModel = await GetNotificationDataModel(tripId);

            var Recipients = GetRecipients(notificationDataModel).ToList().AsReadOnly();

            await Clients.Clients(Recipients).SendAsync("joinTrip", new NotificationPayloadModel
            {
                Id = ++FakeID,
                FullName = notificationDataModel.CurrentUser.FullName,
                Destination = notificationDataModel.Trip.Destination
            });
        }

        public async Task DeclineTripNotif(int tripId)
        {
            NotificationDataModel notificationDataModel = await GetNotificationDataModel(tripId);

            var Recipients = GetRecipients(notificationDataModel).ToList().AsReadOnly();

            await Clients.Clients(Recipients).SendAsync("declineTrip", new NotificationPayloadModel
            {
                Id = ++FakeID,
                FullName = notificationDataModel.CurrentUser.FullName,
                Destination = notificationDataModel.Trip.Destination
            });
        }

        public async Task CancelTripNotif(int tripId)
        {
            NotificationDataModel notificationDataModel = await GetNotificationDataModel(tripId);

            var Recipients = GetRecipients(notificationDataModel).ToList().AsReadOnly();

            await Clients.Clients(Recipients).SendAsync("cancelTrip", new NotificationPayloadModel
            {
                Id = ++FakeID,
                FullName = notificationDataModel.CurrentUser.FullName,
                Destination = notificationDataModel.Trip.Destination
            });
        }

        public async Task UpdateTripNotif(int tripId)
        {
            NotificationDataModel notificationDataModel = await GetNotificationDataModel(tripId);

            var Recipients = GetRecipients(notificationDataModel).ToList().AsReadOnly();

            await Clients.Clients(Recipients).SendAsync("updateTrip", new NotificationPayloadModel
            {
                Id = FakeID++,
                FullName = notificationDataModel.CurrentUser.FullName,
                Destination = notificationDataModel.Trip.Destination
            });
        }

        public async Task CompleteTripNotif()
        {

            User currentUser = await GetCurrentUser();

            var referenceTime = DateTime.UtcNow;
            List<Trip> trips = currentUser.Trips.Where(
                trip => trip.LeavingDate.ToUniversalTime() < referenceTime
                        && trip.Status == "Active"
                ).ToList();

            foreach (Trip trip in trips)
            {
                // build url
                string url = httpContextAccessor.GetAbsoluteUri() + "api/trips/confirm?id=" + trip.TripId + "&response=";

                // send notification
                await Clients.Caller.SendAsync("completeTrip", new NotificationPayloadModel
                {
                    Id = FakeID++,
                    Destination = trip.Destination,
                    URL = url
                });
            }
        }

    }
}
