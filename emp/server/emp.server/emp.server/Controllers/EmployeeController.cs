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
        [HttpPost]
        public IActionResult CreateEmployee(EmployeeDto employeeDto)
        {

            _context.Database.ExecuteSqlInterpolated($@" Exec createEmployee_20260421
           @f_name={employeeDto.F_name},
           @l_name = { employeeDto.L_name},
           @email = {employeeDto.Email }, 
           @phone = {employeeDto.phone}"
           


                );


            return Ok(new {suceess=true ,message= "Employee created successfully" });

        }
       
    }

}
