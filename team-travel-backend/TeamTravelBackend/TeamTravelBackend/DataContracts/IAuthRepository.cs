using Microsoft.AspNetCore.Mvc;
using TeamTravelBackend.DataContracts.Requests;

namespace TeamTravelBackend.DataContracts
{
    public interface IAuthRepository
    {
        IActionResult LoginUser(UserLogin login);

        IActionResult RegisterUser(UserRegisterRequest userRegisterRequest);

        void LogOutUser();
    }
}
