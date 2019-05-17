using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using TeamTravelBackend.DataContracts;
using TeamTravelBackend.Models;
using TeamTravelBackend.DataContracts.Requests;

namespace TeamTravelBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminRepository adminRepository;

        public AdminController(IAdminRepository adminRepository)
        {
            this.adminRepository = adminRepository;
        }

        //POST api/admin
        [HttpPost]
        public async Task<ActionResult<FEUser>> Post([FromBody] FEUser newUser)
        {
            try
            {
                newUser = await adminRepository.Create(newUser);

                return CreatedAtAction(nameof(GetAll), new { id = newUser.Id }, newUser); // return all users after;
            }
            catch (ArgumentException e)
            {
                return BadRequest(new Dictionary<string, string[]>
                {
                     { e.ParamName, new[] { e.Message.Split(Environment.NewLine)[0] } }
                });
            }
            catch (Exception e)
            {
                return StatusCode(500, e);
            }
        }

        //GET api/admin
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FEUser>>> GetAll([FromQuery] SearchUsersRequest request)
        {
            try
            {
                return await adminRepository.GetAll(request);
            }
            catch (Exception e)
            {
                return StatusCode(500, e);
            }
        }

        //GET api/admin/id
        [HttpGet("{id}")]
        public async Task<ActionResult<FEUser>> Get(int id) {
            try
            {
                return await adminRepository.Get(id);
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

        // PUT api/admin
        [HttpPut]
        public async Task<ActionResult<FEUser>> Put([FromBody] FEUser modifiedUser)
        {
            try
            {
                return await adminRepository.Update(modifiedUser);
            }
            catch (InvalidOperationException e)
            {
                return BadRequest(e);
            }
            catch (ArgumentException e)
            {
                return BadRequest(new Dictionary<string, string[]>
                {
                     { e.ParamName, new[] { e.Message.Split(Environment.NewLine)[0] } }
                });
            }
            catch (Exception e)
            {
                return StatusCode(500, e);
            }
        }

        // DELETE api/admin
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id) {
            try
            {
                return await adminRepository.Delete(id);
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
    }
}
