using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TeamTravelBackend.Data.Entities;
using TeamTravelBackend.DataContracts;
using TeamTravelBackend.DataContracts.Requests;
using TeamTravelBackend.Models;
using Microsoft.EntityFrameworkCore;
using TeamTravelBackend.Constants;

namespace TeamTravelBackend.Data
{
    public class TripsRepository : ITripsRepository
    {
        private readonly AppDbContext appDbContext;

        public TripsRepository(AppDbContext appDbContext)
        {
            this.appDbContext = appDbContext;

        }

        List<FEPassenger> preparePassengers(List<Passenger> passengers, List<User> users)
        {
            List<FEPassenger> passengersFE = new List<FEPassenger>();

            foreach (Passenger pass in passengers)
            {
                FEPassenger passToAdd = new FEPassenger
                {
                    UserId = pass.UserId,
                    TripId = pass.TripId,
                    FullName = users.SingleOrDefault(user => user.UserId == pass.UserId).FullName
                };
                passengersFE.Add(passToAdd);
            }
            return passengersFE;
        }

        public async Task<List<FETrip>> GetAll(GetAllTripsRequest request)
        {

            var allTrips = appDbContext.Trips.Include(x => x.Passengers).Include(u => u.User);
            var allUsers = await appDbContext.Users.ToListAsync();
            var allPassengers = await appDbContext.Passengers.ToListAsync();

            var tripsListQuery = allTrips.Select(item => new FETrip
            {
                ID = item.TripId,
                DriverID = item.DriverId,
                Driver = item.User.FullName,
                Origin = item.Origin,
                Destination = item.Destination,
                LeavingDate = item.LeavingDate,
                ReturnDate = item.ReturnDate,
                MaxSeats = item.MaxSeats,
                CarPlate = item.CarPlate,
                CarType = item.CarType,
                Status = item.Status,
                Comments = item.Comments,
                PhoneNumber = item.User.PhoneNumber,
                SlackId = item.User.SlackId,
                Passengers = preparePassengers(allPassengers.Where(passenger => passenger.TripId == item.TripId).ToList(), allUsers)
            });

            if (!string.IsNullOrEmpty(request.Origin))
            {
                tripsListQuery = tripsListQuery.Where(trip => trip.Origin == request.Origin);
            }
            if (!string.IsNullOrEmpty(request.Destination))
            {
                tripsListQuery = tripsListQuery.Where(trip => trip.Destination == request.Destination);
            }
            if (request.Date.HasValue)
            {
                tripsListQuery = tripsListQuery.Where(trip => trip.LeavingDate.Equals(request.Date));
            }
            if (request.DriverID.HasValue)
            {
                tripsListQuery = tripsListQuery.Where(trip => trip.DriverID == request.DriverID);
            }
            if (!string.IsNullOrEmpty(request.Status))
            {
                tripsListQuery = tripsListQuery.Where(trip => trip.Status == request.Status);
            }
            if (!string.IsNullOrEmpty(request.CarType))
            {
                tripsListQuery = tripsListQuery.Where(trip => trip.CarType == request.CarType);
            }
            return await tripsListQuery.ToListAsync();

        }

        List<Passenger> GetListOfPassengers(int id)
        {
            return (from p in appDbContext.Passengers
                    where p.TripId == id
                    select p).ToList();
        }

        public async Task<FETrip> Create(FETrip newTrip)
        {
            Trip tripToAdd = new Trip();
            UpdateTrip(ref tripToAdd, newTrip);
            appDbContext.Trips.Add(tripToAdd);
            await appDbContext.SaveChangesAsync();
            newTrip.ID = tripToAdd.TripId;

            return newTrip;
        }

        void AddPassenger(FEPassenger passengerToAdd, int tripId) {
            var passenger = new Passenger()
            {
                TripId = tripId,
                UserId = passengerToAdd.UserId
            };
            appDbContext.Passengers.Add(passenger);
        }

        void RemovePassenger(FEPassenger passengerToRemove) {
            var passenger = appDbContext.Passengers.FirstOrDefault(pass => pass.UserId == passengerToRemove.UserId);
            appDbContext.Passengers.Remove(passenger);
        }

        public async Task<FETrip> Update(FETrip newTrip, UpdateTripRequest updateTripRequest)
        {
            var passengers = GetListOfPassengers(newTrip.ID.Value);
            if (updateTripRequest != null)
            {
                if (updateTripRequest.PassengerId != null)
                {
                    if (updateTripRequest.IsLeaving.Value)
                    {
                        var passengerToRemove = newTrip.Passengers.FirstOrDefault(passenger => passenger.UserId == updateTripRequest.PassengerId);
                        newTrip.Passengers.Remove(passengerToRemove);
                        RemovePassenger(passengerToRemove);
                    }
                    else {
                        if (!passengers.Exists(p => p.UserId == updateTripRequest.PassengerId))
                        {
                            if (newTrip.DriverID == updateTripRequest.PassengerId.Value)
                                throw new InvalidOperationException(ErrorMessages.JoinOwnTrip);
                            if (newTrip.LeavingDate < DateTime.Now)
                                throw new InvalidOperationException(ErrorMessages.JoinPastTrip);
                            if (newTrip.MaxSeats <= passengers.Count)
                                throw new InvalidOperationException(ErrorMessages.NoAvailableSeatsLeft);
                            FEPassenger passengerToAdd = new FEPassenger
                            {
                                TripId = (int)newTrip.ID,
                                UserId = (int)updateTripRequest.PassengerId,
                                FullName = appDbContext.Users.FirstOrDefault(user => user.UserId == updateTripRequest.PassengerId).FullName
                            };
                            newTrip.Passengers.Add(passengerToAdd);
                            AddPassenger(passengerToAdd, newTrip.ID.Value);
                        }
                    }
                }
            }

            if (newTrip.ID != null)
            {
                int index = (int)newTrip.ID;

                Trip oldTrip = (from t in appDbContext.Trips
                                where t.TripId == index
                                select t).SingleOrDefault();
                Trip updatedTrip = new Trip();
                updatedTrip = oldTrip;
                if (oldTrip != null)
                {
                    UpdateTrip(ref updatedTrip, newTrip);
                    appDbContext.Entry(oldTrip).State = EntityState.Detached;
                    appDbContext.Entry(updatedTrip).State = EntityState.Modified;
                    await appDbContext.SaveChangesAsync();
                }
                else
                    newTrip = await Create(newTrip);
            }
            else
                newTrip = await Create(newTrip);

            return newTrip;
        }

        void UpdateTrip(ref Trip tripToUpdate, FETrip newTrip)
        {
            tripToUpdate.DriverId = newTrip.DriverID;
            tripToUpdate.Origin = newTrip.Destination == "Vilnius" ? "Kaunas" : "Vilnius";
            tripToUpdate.Destination = newTrip.Destination;
            tripToUpdate.LeavingDate = newTrip.LeavingDate;
            tripToUpdate.ReturnDate = newTrip.ReturnDate;
            tripToUpdate.MaxSeats = newTrip.MaxSeats;
            tripToUpdate.CarPlate = newTrip.CarType != "Rental" ? newTrip.CarPlate : null;
            tripToUpdate.CarType = newTrip.CarType;
            tripToUpdate.Status = newTrip.Status;
            tripToUpdate.Comments = newTrip.Comments;
        }

        public async Task<bool> Delete(int id)
        {
            Trip trip =  appDbContext.Trips.SingleOrDefault(t => t.TripId == id);
            if (trip == null)
                return false;

            List<Passenger> passengers = GetListOfPassengers(id);

            for (int i = 0; i < passengers.Count; i++)
            {
                appDbContext.Passengers.Remove(passengers[i]);

            }

            appDbContext.Trips.Remove(trip);
            await appDbContext.SaveChangesAsync();
            return true;

        }

        public async Task ConfirmTrip(int id, string response)
        {
            var oldTrip = await appDbContext.Trips.FirstOrDefaultAsync(t => t.TripId == id);

            var updatedTrip = oldTrip;

            switch (response)
            {
                case "yes":
                    updatedTrip.Status = "Completed";
                    break;
                case "no":
                    updatedTrip.Status = "Canceled";
                    break;
                default:
                    break;
            }

            appDbContext.Entry(oldTrip).State = EntityState.Detached;
            appDbContext.Entry(updatedTrip).State = EntityState.Modified;

            await appDbContext.SaveChangesAsync();
        }
    }
}
