using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using TeamTravelBackend.Constants;
using TeamTravelBackend.Data.Entities;
using TeamTravelBackend.DataContracts;
using TeamTravelBackend.DataContracts.Requests;
using TeamTravelBackend.Models;

namespace TeamTravelBackend.Data
{
    public class AuthRepository : Controller, IAuthRepository
    {
        private readonly AppDbContext appDbContext;
        private readonly IOptions<JwtAuthentication> _jwtAuthentication;

        public AuthRepository(AppDbContext appDbContext, IOptions<JwtAuthentication> jwtAuthentication)
        {
            this.appDbContext = appDbContext;
            _jwtAuthentication = jwtAuthentication ?? throw new ArgumentNullException(nameof(jwtAuthentication));
        }

        public IActionResult LoginUser(UserLogin login)
        {
            IActionResult response = Unauthorized();
            var user = AuthenticateUser(login);

            if (user != null)
            {
                var tokenString = GenerateJSONWebToken(user);
                response = Ok(new { token = tokenString });
            }

            return response;
        }

        public IActionResult RegisterUser(UserRegisterRequest userRegisterRequest)
        {
            try
            {
                ThrowIfEmailExists(userRegisterRequest.Email);
                ThrowIfPhoneNumberExists(userRegisterRequest.Phone);
                ThrowIfCarPlatesExists(userRegisterRequest.CarPlate);
            }
            catch (ArgumentException exception)
            {
                return BadRequest(new Dictionary<string, string[]>
                {
                    { exception.ParamName, new [] { exception.Message.Split(Environment.NewLine)[0] } }
                });
            }
            User createdUser = CreateUser(userRegisterRequest);
            SaveUser(createdUser, userRegisterRequest.CarPlate);
            return Ok();
        }

        public void LogOutUser()
        {
            // Log out
        }

        private User GetUserByEmail(string email)
        {
            return appDbContext.Users.FirstOrDefault(x => x.Email.ToLowerInvariant() == email.ToLowerInvariant());
        }

        private void ThrowIfEmailExists(string email)
        {
            if (GetUserByEmail(email) != null)
                throw new ArgumentException(ErrorMessages.EmailTaken, "Email");
        }

        private void ThrowIfPhoneNumberExists(string phone)
        {
            if (!String.IsNullOrEmpty(phone))
            {
                if (appDbContext.Users.FirstOrDefault(x => x.PhoneNumber == phone) != null)
                    throw new ArgumentException(ErrorMessages.PhoneNumberExists, "Phone");
            }
        }

        private void ThrowIfCarPlatesExists(string carPlate)
        {
            if (!String.IsNullOrEmpty(carPlate))
            {
                if (appDbContext.Cars.FirstOrDefault(car => car.CarPlate == carPlate) != null)
                    throw new ArgumentException(ErrorMessages.CarPlateExists + carPlate + "!", "carPlates");
            }
        }

        private User CreateUser(UserRegisterRequest userRegisterRequest)
        {
            return new User
            {
                Email = userRegisterRequest.Email,
                Password = PasswordCrypt.EncryptPassword(userRegisterRequest.Password),
                FullName = userRegisterRequest.FullName,
                SlackId = userRegisterRequest.SlackId,
                MainOffice = userRegisterRequest.MainOffice,
                IsDriver = true,
                RoleId = 1,
                PhoneNumber = userRegisterRequest.Phone,
                Cars = new List<Car>()
            };
        }

        private void SaveUser(User createdUser, string carPlate)
        {
            if (!String.IsNullOrWhiteSpace(carPlate))
            {
                Car carToAdd = new Car { CarPlate = carPlate, UserId = createdUser.UserId };
                appDbContext.Cars.Add(carToAdd);
                createdUser.Cars.Add(carToAdd);
            }
            appDbContext.Users.Add(createdUser);
            appDbContext.SaveChanges();
        }

        private void GenerateRolesClaims(List<Claim> claims, int roleId) {

            switch (roleId)
            {
                case 2:
                    claims.Add(new Claim("roles", "Manager"));
                    break;
                case 3:
                    claims.Add(new Claim("roles", "Manager"));
                    claims.Add(new Claim("roles", "Admin"));
                    break;
            }
        }

        private string GenerateJSONWebToken(User userInfo)
        {
            List<Claim> claims = new List<Claim> {
                new Claim(JwtRegisteredClaimNames.Email, userInfo.Email),
                new Claim(JwtRegisteredClaimNames.Jti, userInfo.UserId.ToString()),
                new Claim("roles", "User")
            };

            GenerateRolesClaims(claims, userInfo.RoleId);

            var token = new JwtSecurityToken(
              _jwtAuthentication.Value.Issuer,
              _jwtAuthentication.Value.Audience,
              claims,
              expires: DateTime.Now.AddMinutes(120),
              signingCredentials: _jwtAuthentication.Value.SigningCredentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private User AuthenticateUser(UserLogin login)
        {
            var query = appDbContext.Users.AsQueryable();

            User DBUser = query.Where(x => x.Email == login.Email).SingleOrDefault();

            // Validate user credentials
            if (DBUser != null && PasswordCrypt.ComparePasswords(DBUser.Password, login.Password))
            {
                return DBUser;
            }
            return null;
        }
    }
}
