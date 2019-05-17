using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TeamTravelBackend.Data.Entities;
using TeamTravelBackend.DataContracts.Requests;
using TeamTravelBackend.Models;

namespace TeamTravelBackend.DataContracts
{
    public interface ITripsRepository
    {
        Task<List<FETrip>> GetAll(GetAllTripsRequest request);

        Task<FETrip> Create(FETrip newTrip);

        Task<FETrip> Update(FETrip newTrip, UpdateTripRequest updateTripRequest);

        Task<bool> Delete(int id);

        Task ConfirmTrip(int userId, string response);
    }
}
