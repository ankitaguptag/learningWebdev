using emp.server.Data;
using emp.server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Xml.Linq;

namespace emp.server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        ApplicationDbContext _context;

        public EmployeeController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetEmployees()
        {
            var data = _context.Employees.FromSqlRaw("EXEC getEmployees").ToList();
            return Ok(data);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetEmployee(int id)
        {
            var list = await _context.Employees
                .FromSqlRaw("EXEC getEmployeeById @id",
                             new SqlParameter("@id", id))
                .AsNoTracking()
                .ToListAsync();   // 👈 execute SQL first

            var data = list.FirstOrDefault(); // 👈 in-memory filtering

            if (data == null)
                return NotFound();

            return Ok(data);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteById(int id)
        {
            _context.Database.ExecuteSqlRaw(
               "EXEC deleteEmployeeId20262404 @Id",
               new SqlParameter("@Id", id)
           );
            return Ok();

        }

        [HttpPost]
        public IActionResult CreateEmployee(EmployeeDto employeeDto)
        {

            _context.Database.ExecuteSqlInterpolated($@" Exec createEmployee_20260421
           @f_name={employeeDto.F_name},
           @l_name = { employeeDto.L_name},
           @email = {employeeDto.Email }, 
           @phone = {employeeDto.Phone}"
           


                );


            return Ok(new {suceess=true ,message= "Employee created successfully" });

        }


        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Employee employee)
        {
            if (id != employee.Id)
            {
                return BadRequest("ID mismatch");
            }

            _context.Database.ExecuteSqlInterpolated($@"
        EXEC procUpdateEmployee20262504
        @ID = {employee.Id},
        @F_name = {employee.F_name},
        @L_name = {employee.L_name},
        @Email = {employee.Email},
        @Phone = {employee.Phone}
    ");

            return Ok(new { message = "Employee Updated Successfully" });
        }


    }

}
