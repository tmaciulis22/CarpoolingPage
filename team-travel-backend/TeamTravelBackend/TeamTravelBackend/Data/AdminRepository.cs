using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TeamTravelBackend.Constants;
using TeamTravelBackend.Data.Entities;
using TeamTravelBackend.DataContracts;
using TeamTravelBackend.DataContracts.Requests;
using TeamTravelBackend.Models;

namespace TeamTravelBackend.Data
{
    public class AdminRepository : Controller, IAdminRepository
    {
        private readonly AppDbContext appDbContext;

        public AdminRepository(AppDbContext appDbContext)
        {
            this.appDbContext = appDbContext;

        }

        public async Task<FEUser> Create(FEUser newUser)
        {
            if (appDbContext.Users.FirstOrDefault(user => user.Email.ToLowerInvariant() == newUser.Email.ToLowerInvariant()) != null)
            {
                throw new InvalidOperationException(ErrorMessages.EmailTaken);
            }

            User userToAdd = new User {
                FullName = newUser.FullName,
                PhoneNumber = newUser.PhoneNumber,
                Email = newUser.Email,
                Password = newUser.Password != null ? PasswordCrypt.EncryptPassword(newUser.Password) : throw new InvalidOperationException(ErrorMessages.PasswordMissing),
                SlackId = newUser.SlackId,
                MainOffice = newUser.MainOffice,
                IsDriver = false,
                RoleId = newUser.RoleId,
                Cars = new List<Car>()
            };

            if (newUser.CarPlates != null && newUser.CarPlates.Length != 0) {
                UpdateCarPlates(ref userToAdd, newUser.CarPlates);
            }

            appDbContext.Users.Add(userToAdd);
            await appDbContext.SaveChangesAsync();

            newUser.Id = userToAdd.UserId;

            return newUser;
        }

        public async Task<List<FEUser>> GetAll(SearchUsersRequest request)
        {
            var allUsers = appDbContext.Users.Include(user => user.Cars);
            var usersToReturn = allUsers.Select(user => new FEUser
            {
                Id = user.UserId,
                FullName = user.FullName,
                PhoneNumber = user.PhoneNumber,
                Email = user.Email,
                SlackId = user.SlackId,
                MainOffice = user.MainOffice,
                RoleId = user.RoleId,
               CarPlates = user.Cars.Select(car => car.CarPlate).ToArray()
            });

            if (!string.IsNullOrEmpty(request.FullName))
            {
                usersToReturn = usersToReturn.Where(user => user.FullName == request.FullName);
            }
            if (!string.IsNullOrEmpty(request.PhoneNumber))
            {
                usersToReturn = usersToReturn.Where(user => user.PhoneNumber == request.PhoneNumber);
            }
            if (request.CarPlates != null && request.CarPlates.Length != 0)
            {
                foreach (string plate in request.CarPlates)
                {
                    usersToReturn = usersToReturn.Where(user => user.CarPlates.Contains(plate));
                }
            }

            return await usersToReturn.ToListAsync();
        }

        public async Task<FEUser> Get(int userId)
        {
            var user = await appDbContext.Users.Include(u => u.Cars).FirstOrDefaultAsync(u => u.UserId == userId);
            if (user != null)
            {
                var userToReturn = new FEUser
                {
                    Id = user.UserId,
                    FullName = user.FullName,
                    PhoneNumber = user.PhoneNumber,
                    Email = user.Email,
                    SlackId = user.SlackId,
                    MainOffice = user.MainOffice,
                    RoleId = user.RoleId,
                    CarPlates = user.Cars.Select(car => car.CarPlate).ToArray()
                };

                return userToReturn;
            }else
            {
                throw new InvalidOperationException(ErrorMessages.UserDoesNotExist);
            }
            
        }

        public async Task<FEUser> Update(FEUser modifiedUser)
        {
            if (appDbContext.Users.FirstOrDefault(user => user.Email.ToLowerInvariant() == modifiedUser.Email.ToLowerInvariant() && user.UserId != modifiedUser.Id) != null)
            {
                throw new InvalidOperationException(ErrorMessages.EmailTaken);
            }

            var userToUpdate = appDbContext.Users.Include(user => user.Cars).FirstOrDefault(user => user.UserId == modifiedUser.Id);

            if (userToUpdate != null)
            {
                userToUpdate.FullName = modifiedUser.FullName;
                userToUpdate.PhoneNumber = modifiedUser.PhoneNumber;
                userToUpdate.Email = modifiedUser.Email;
                userToUpdate.SlackId = modifiedUser.SlackId;
                userToUpdate.MainOffice = modifiedUser.MainOffice;
                userToUpdate.RoleId = modifiedUser.RoleId;
                UpdateCarPlates(ref userToUpdate, modifiedUser.CarPlates);

                appDbContext.Entry(userToUpdate).State = EntityState.Modified;
                appDbContext.Update(userToUpdate);

                await appDbContext.SaveChangesAsync();
                return modifiedUser;
            }
            else {
                throw new InvalidOperationException(ErrorMessages.UserDoesNotExist);
            }
        }
        void UpdateCarPlates(ref User userToUpdate, string[] carPlates)
        {
            foreach (Car car in userToUpdate.Cars.ToList())
            {
                if (carPlates.FirstOrDefault(plate => plate == car.CarPlate) == null)
                {
                    if (appDbContext.Trips.FirstOrDefault(trip => trip.CarPlate == car.CarPlate) != null)
                        throw new ArgumentException(ErrorMessages.CarPlateHasTrips + car.CarPlate + "!", "carPlates");
                    userToUpdate.Cars.Remove(car);
                    appDbContext.Entry(car).State = EntityState.Deleted;
                    appDbContext.Cars.Remove(car);
                }
            }

            foreach (string carPlate in carPlates)
            {
                Car existingCar = appDbContext.Cars.FirstOrDefault(car => car.CarPlate == carPlate);
                if (existingCar == null)
                {
                    Car carToAdd = new Car() { CarPlate = carPlate, UserId = userToUpdate.UserId };
                    appDbContext.Cars.Add(carToAdd);
                    userToUpdate.Cars.Add(carToAdd);
                }
                else if (existingCar.UserId != userToUpdate.UserId)
                    throw new ArgumentException(ErrorMessages.CarPlateExists + carPlate + "!", "carPlates");
            }
        }

        public async Task<IActionResult> Delete(int userId)
        {
            var userToDelete = appDbContext.Users.Include(user => user.Cars).Include(user => user.Trips).FirstOrDefault(user => user.UserId == userId);

            if (userToDelete != null)
            {
                DeletePassengers(userId);
                DeleteTrips(userId);
                DeleteCars(userId);
                appDbContext.Users.Remove(userToDelete);
                await appDbContext.SaveChangesAsync();
            }
            else
            {
                throw new InvalidOperationException(ErrorMessages.UserDoesNotExist);
            }

            return Ok();
        }

        void DeletePassengers(int userId)
        {
            var allUserPassengers = appDbContext.Passengers.Where(passenger => passenger.UserId == userId);

            appDbContext.Passengers.RemoveRange(allUserPassengers);
        }

        void DeleteTrips(int userId)
        {
            var allUserTrips = appDbContext.Trips.Where(trip => trip.DriverId == userId);

            foreach (Trip trip in allUserTrips) {
                var tripPassengers = appDbContext.Passengers.Where(passenger => passenger.TripId == trip.TripId);
                appDbContext.Passengers.RemoveRange(tripPassengers);
                appDbContext.Trips.Remove(trip);
            }
        }

        void DeleteCars(int userId) {
            var allUserCars = appDbContext.Cars.Where(car => car.UserId == userId);

            appDbContext.Cars.RemoveRange(allUserCars);
        }
    }
}
