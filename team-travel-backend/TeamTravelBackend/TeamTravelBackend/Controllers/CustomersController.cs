using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TeamTravelBackend.Data.Entities;
using TeamTravelBackend.DataContracts;
using TeamTravelBackend.DataContracts.Requests;
using TeamTravelBackend.Models;

namespace TeamTravelBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "User")]
    public class CustomersController : ControllerBase
    {
        private readonly  ICustomersRepository customersRepository;

        public CustomersController(ICustomersRepository customersRepository)
        {
            this.customersRepository = customersRepository;
        }

        // POST api/Customers/me
        [HttpGet("me")]
        public async Task<ActionResult<Me>> Me()
        {
            try
            {
                var customer = await customersRepository.Me();

                return Ok(customer);
            }
            catch (Exception e)
            {
                return StatusCode(500, e);
            }

        }

        //PUT api/Customers/me
        [HttpPut("me")]
        public async Task<IActionResult> UpdateUserData([FromBody] UserUpdateRequest userUpdateRequest)
        {
            try
            {
                return await customersRepository.Update(userUpdateRequest);
            }
            catch (ArgumentException e)
            {
                return BadRequest(new Dictionary<string, string[]>
                {
                    { e.ParamName, new [] { e.Message.Split(Environment.NewLine)[0] } }
                });
            }
            catch (Exception e)
            {
                return StatusCode(500, e);
            }
        }
    }
}