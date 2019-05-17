using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TeamTravelBackend.DataContracts.Requests;
using TeamTravelBackend.Models;

namespace TeamTravelBackend.DataContracts
{
    public interface IAdminRepository
    {
        Task<FEUser> Create(FEUser newUser);
        Task<List<FEUser>> GetAll(SearchUsersRequest request);
        Task<FEUser> Get(int userId);
        Task<FEUser> Update(FEUser modifiedUser);
        Task<IActionResult> Delete(int userId);
    }
}
