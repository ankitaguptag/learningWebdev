using from_backend_v8.Data;
using from_backend_v8.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace from_backend_v8.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StudentController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetStudents()    
        {
            var data = _context.Students.FromSqlRaw("EXEC procGetAllStudent").ToList();
            return Ok(data);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteById(int id)
        {
            _context.Database.ExecuteSqlRaw(
               "EXEC DeleteStudentId @Id",
               new SqlParameter("@Id", id)
           );
            return Ok();

        }


        [HttpPost]
        public IActionResult Create(Student student)
        {
            _context.Database.ExecuteSqlInterpolated($@"
        EXEC InsertStudent
        @ID={student.StudentID},
        @FirstName={student.FirstName},
        @LastName={student.LastName},
        @Gender={student.Gender},
        @Dateofbirth={student.Dateofbirth},
        @Age={student.Age},
        @Email={student.Email},
        @Phone={student.Phone},
        @Address={student.Address},
        @City={student.City},
        @State={student.State},
        @Course={student.Course},
        @AdmiDate={student.AdmiDate}
    ");

            return Ok(new { message = "Student Created Successfully" });
        }


        [HttpPut]
        public IActionResult Update(Student student)
        {
            _context.Database.ExecuteSqlInterpolated($@"
        EXEC Studentupdate
        @ID={student.StudentID},
        @FirstName={student.FirstName},
        @LastName={student.LastName},
        @Gender={student.Gender},
        @Dateofbirth={student.Dateofbirth},
        @Age={student.Age},
        @Email={student.Email},
        @Phone={student.Phone},
        @Address={student.Address},
        @City={student.City},
        @State={student.State},
        @Course={student.Course},
        @AdmiDate={student.AdmiDate}
    ");

            return Ok(new { message = "Student Updated Successfully" });
        }

    } 
}
