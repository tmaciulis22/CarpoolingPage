using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using TeamTravelBackend.Constants;
using TeamTravelBackend.Data.Entities;
using TeamTravelBackend.DataContracts;
using TeamTravelBackend.DataContracts.Requests;
using TeamTravelBackend.Models;

namespace TeamTravelBackend.Data
{
    public class CustomersRepository : Controller, ICustomersRepository
    {
        private readonly AppDbContext appDbContext;
        private readonly int currentUserId;

        public CustomersRepository(AppDbContext appDbContext, IHttpContextAccessor httpContextAccessor)
        {
            this.appDbContext = appDbContext;
            currentUserId = httpContextAccessor.CurrentUser();
        }

        public async Task<Me> Me()
        {
            var user = await appDbContext.Users.Include(x=>x.Cars).FirstOrDefaultAsync(x => x.UserId == currentUserId);
          
           return new Me
            {
                Id= user.UserId,
                FullName = user.FullName,
                PhoneNumber = user.PhoneNumber,
                SlackId = user.SlackId,
                MainOffice = user.MainOffice,
                IsDriver = user.IsDriver,
                CarPlates = user.Cars.Select(x => x.CarPlate).ToArray(),
                RoleId = user.RoleId
           };
            
        }

        public async Task<IActionResult> Update(UserUpdateRequest userUpdateRequest)
        {
            User user = appDbContext.Users.Include(x => x.Cars).FirstOrDefault(x => x.UserId == currentUserId);

            if (userUpdateRequest.OldPassword != null && userUpdateRequest.NewPassword != null) {
                try
                {
                    checkOldPassword(user, userUpdateRequest.OldPassword);
                    user.Password = PasswordCrypt.EncryptPassword(userUpdateRequest.NewPassword);
                }
                catch (ArgumentException exception)
                {
                    return BadRequest(new Dictionary<string, string[]>
                    {
                        { exception.ParamName, new [] { exception.Message.Split(Environment.NewLine)[0] } }
                    });
                }
            }

            user.FullName = userUpdateRequest.FullName;
            user.PhoneNumber = userUpdateRequest.PhoneNumber;
            user.SlackId = userUpdateRequest.SlackId;
            user.MainOffice = userUpdateRequest.MainOffice;
            user.IsDriver = userUpdateRequest.IsDriver;

            foreach (Car car in user.Cars.ToList()) {
                if (userUpdateRequest.CarPlates.FirstOrDefault(plate => plate == car.CarPlate) == null) {
                    if (appDbContext.Trips.FirstOrDefault(trip => trip.CarPlate == car.CarPlate) != null)
                        throw new ArgumentException(ErrorMessages.CarPlateHasTrips + car.CarPlate + "!", "carPlates");
                    user.Cars.Remove(car);
                    appDbContext.Entry(car).State = EntityState.Deleted;
                    appDbContext.Cars.Remove(car);
                }
            }

            foreach (string carPlate in userUpdateRequest.CarPlates)
            {
                Car existingCar = appDbContext.Cars.FirstOrDefault(car => car.CarPlate == carPlate);
                if (existingCar == null)
                {
                    Car carToAdd = new Car() { CarPlate = carPlate, UserId = user.UserId };
                    appDbContext.Cars.Add(carToAdd);
                    user.Cars.Add(carToAdd);
                }
                else if (existingCar.UserId != currentUserId)
                    throw new ArgumentException(ErrorMessages.CarPlateExists + carPlate + "!", "carPlates");
            }

            appDbContext.Entry(user).State = EntityState.Modified;
            appDbContext.Update(user);
            await appDbContext.SaveChangesAsync();
            return Ok();
        }

        public void checkOldPassword(User user, string oldPassword) {
            if (!PasswordCrypt.ComparePasswords(user.Password, oldPassword))
                throw new ArgumentException(ErrorMessages.BadOldPassword, "OldPassword");
        }
    }
}