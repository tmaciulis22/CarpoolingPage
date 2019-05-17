using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TeamTravelBackend.DataContracts;
using TeamTravelBackend.DataContracts.Requests;
using TeamTravelBackend.Hubs;
using TeamTravelBackend.Models;

namespace TeamTravelBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "User")]
    public class TripsController : ControllerBase
    {
        private readonly ITripsRepository tripsRepository;

        public TripsController(ITripsRepository tripsRepository)
        {
            this.tripsRepository = tripsRepository;
        }

        // GET api/trip
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FETrip>>> GetAll([FromQuery] GetAllTripsRequest request)
        {
            try
            {
                 return await tripsRepository.GetAll(request);
            }
            catch (Exception e)
            {
                return StatusCode(500, e);
            }
        }
        // POST api/trip
        [HttpPost]
        public async Task<ActionResult<FETrip>> Post([FromBody] FETrip newTrip) //new instance of an object everytime
        {
            try
            {
                newTrip = await tripsRepository.Create(newTrip);

                return CreatedAtAction(nameof(GetAll),new {id = newTrip.ID }, newTrip); // return all trips after;
            }
            catch(Exception e)
            {
                return StatusCode(500,e);
            }
           
        }

        // PUT api/trip
        [HttpPut]
        public async Task<ActionResult<FETrip>> Put ([FromBody]  FETrip newTrip,[FromQuery] UpdateTripRequest updateTripRequest) //same result with same request
        {
            try
            {
                return await tripsRepository.Update(newTrip, updateTripRequest);
            }
            catch (InvalidOperationException e)
            {
                return BadRequest(e);
            }
            catch (Exception e)
            {
                return StatusCode(500, e);
            }
        }

        // DELETE api/trip/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                bool success = await tripsRepository.Delete(id);
                if (success)
                    return Ok();
                else
                    return NotFound();
            }
            catch (Exception e)
            {
                return StatusCode(500, e);
            }
        }

        [HttpPut]
        [Route("confirm")]
        public async Task<ActionResult> ConfirmTrip([FromQuery] int id, [FromQuery] string response)
        {
            try
            {
                await tripsRepository.ConfirmTrip(id, response);
                return Ok();
            }
            catch (Exception e)
            {
                return StatusCode(500, e);
            }
        }


    }
}