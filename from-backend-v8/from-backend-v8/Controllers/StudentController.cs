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
        [HttpGet("GetStudent")]
        public async Task<IActionResult> GetStudents(
            string? searchText,
            int currentPage = 1,
            int pageSize = 5
            )
        {
            var students = await _context.Set<Student>()
            .FromSqlRaw(
              @"EXEC procGetStudentPagination2026713
                @PageSize,
                @CurrentPage,
                @SearchText",
                new SqlParameter("@PageSize", pageSize),
                new SqlParameter("@CurrentPage", currentPage),
                new SqlParameter("@SearchText",
                (object?)searchText ?? DBNull.Value))
            .ToListAsync();

            return Ok(students);
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


        [HttpPut("{id}")] // <--- Add this "{id}"
        public IActionResult Update(int id, [FromBody] Student student) // <--- Add 'int id' parameter
        {
            // Optional: Safety check to ensure the URL ID matches the Body ID
            if (id != student.StudentID)
            {
                return BadRequest("ID mismatch");
            }

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
