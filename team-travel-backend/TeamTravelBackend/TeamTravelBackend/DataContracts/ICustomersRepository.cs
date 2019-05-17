using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using TeamTravelBackend.Data.Entities;
using TeamTravelBackend.DataContracts.Requests;
using TeamTravelBackend.Models;

namespace TeamTravelBackend.DataContracts
{
    public interface ICustomersRepository
    {
        Task<Me> Me();
        Task<IActionResult> Update(UserUpdateRequest userUpdateRequest);
    }
}
