using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using TeamTravelBackend.DataContracts;
using TeamTravelBackend.DataContracts.Requests;

namespace TeamTravelBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserAuthController : ControllerBase
    {
        private readonly IAuthRepository authRepository;

        public UserAuthController(IAuthRepository authRepository)
        {
            this.authRepository = authRepository;
        }

        // api/userAuth/login
        [HttpPost("login")]
        [AllowAnonymous]
        public IActionResult Login([FromBody]UserLogin login)
        {
            try
            {
                return authRepository.LoginUser(login);
            }
            catch (Exception e)
            {
                return StatusCode(500, e);
            }
        }

        // api/authentication/register
        [HttpPost("register")]
        [AllowAnonymous]
        public IActionResult Register([FromBody]UserRegisterRequest userRegisterRequest)
        {
            try
            {
                return authRepository.RegisterUser(userRegisterRequest);
            }
            catch (Exception e)
            {
                return StatusCode(500, e);
            }
        }

        // api/authentication/logout
        [HttpPost("logout")]
        [AllowAnonymous]
        public void LogOut()
        {
            throw new NotImplementedException();
        }

    }
}