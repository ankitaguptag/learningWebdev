using emp.server.Data;
using emp.server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;
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
        public async Task<IActionResult> GetEmployees(
     string? searchText = null,
     int pageNumber = 1,
     int pageSize = 10)
        {
            var result = await _context.Set<EmployeeListDto>()
                .FromSqlRaw(
                    "EXEC getEmployees_20260607 @SearchText, @PageNumber, @PageSize",
                    new SqlParameter("@SearchText",
                        string.IsNullOrWhiteSpace(searchText)
                            ? DBNull.Value
                            : searchText),
                    new SqlParameter("@PageNumber", pageNumber),
                    new SqlParameter("@PageSize", pageSize))
                .AsNoTracking()
                .ToListAsync();

            var totalRecords = result.FirstOrDefault()?.TotalRecords ?? 0;

            return Ok(new
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalRecords = totalRecords,
                TotalPages = (int)Math.Ceiling((double)totalRecords / pageSize),
                Data = result.Select(x => new
                {
                    x.Id,
                    x.F_name,
                    x.L_name,
                    x.Email,
                    x.Phone
                })
            });
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

        [HttpGet("search")]
        public async Task<IActionResult> SearchEmployee(string searchText)
        {
            var param = new SqlParameter("@SearchText",
                string.IsNullOrEmpty(searchText) ? DBNull.Value : searchText);

            var data = await _context.Employees
                .FromSqlRaw("EXEC procSearchEmployee @SearchText", param)
                .AsNoTracking()
                .ToListAsync();

            return Ok(data);
        }
        [HttpGet("search/{name}")]
        public async Task<IActionResult> SearchEmployeeName(string name)
        {
            var param = new SqlParameter("@SearchName", name);

            var data = await _context.Employees
                .FromSqlRaw("EXEC searchEmployeeName @SearchName", param)
                .ToListAsync();

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
            try
            {
                _context.Database.ExecuteSqlInterpolated($@"
            EXEC createEmployee_20260421
            @f_name={employeeDto.F_name},
            @l_name={employeeDto.L_name},
            @email={employeeDto.Email},
            @phone={employeeDto.Phone}
        ");

                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
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
