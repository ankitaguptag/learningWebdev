using from_backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace from_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        public ActionResult CreateStudent(Student student)
        {
            //save in db using sp
            return Ok(student);
        }
    }
}
