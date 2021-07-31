using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using final_proj_server.Models;

namespace hw3.Controllers
{
    public class UsersController : ApiController
    {
        [HttpPost]
        [Route("api/users/validate")]
        public IHttpActionResult ValidateUser([FromBody] AppUser user)
        {
            try
            {
                AppUser u = AppUser.ValidateUser(user.Username, user.Password);
                if (u != null)
                {
                    return Ok($"Validated`{u.Username}");
                }
                else
                {
                    return Content(HttpStatusCode.Unauthorized, "Invalid Credentials");
                }
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.BadRequest, ex);
                //return BadRequest(ex.Message);
            }

        }

        public IHttpActionResult Post([FromBody] AppUser user)
        {
            try
            {
                AppUser.Insert(user);
                return Ok($"Validated`{user.Username}");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("api/users/username/{username}")]
        public IHttpActionResult Get(string username)
        {
            try
            {
                return Ok(AppUser.GetUser(username));
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.BadRequest, ex);
            }
        }

        [Route("api/users/username/{username}")]
        public IHttpActionResult Delete(string username)
        {
            try
            {
                AppUser.Delete(username);
                return Ok("Deleted successfully");
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.BadRequest, ex);
            }
        }
    }
}