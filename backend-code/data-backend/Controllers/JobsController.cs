using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using final_proj_server.Models;

namespace hw3.Controllers
{
    public class JobsController : ApiController
    {
        [Route("api/jobs/username/{username}")]
        public IHttpActionResult Post([FromBody] Job job, string username)
        {
            try
            {
                Job.Insert(username, job);
                return Ok("Added successfully");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("api/jobs/username/{username}")]
        public IHttpActionResult Get(string username)
        {
            try
            {
                return Ok(Job.GetAll(username));
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.BadRequest, ex);
            }
        }
    }
}