using emp.server.Data;
using emp.server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Text.Json;
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
        [Obsolete("Use /api/Employee/GetEmployees?searchText=uihjb&currentPage=1&pageSize=10")]

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

        [HttpGet("search")]
        [Obsolete("Use /api/Employee/GetEmployees?searchText=uihjb&currentPage=1&pageSize=10")]
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
        [Obsolete("Use /api/Employee/GetEmployees?searchText=uihjb&currentPage=1&pageSize=10")]

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

        [HttpPut("bulk-update")]
        public IActionResult BulkUpdate([FromBody] List<EmployeeBulkUpdateDto> employees)
        {
            var json = JsonSerializer.Serialize(employees);

            _context.Database.ExecuteSqlRaw(
                "EXEC procBulkUpdateEmployee_20260607 @EmployeeJson",
                new SqlParameter("@EmployeeJson", json));

            return Ok(new
            {
                message = "Employees updated successfully"
            });
        
        }

        [HttpGet("GetEmployees")]
        public async Task<IActionResult> GetEmployees(
    string? searchText,
    int currentPage = 1,
    int pageSize=10
    
  )
        {
            var employees = await _context.Set<EmployeeDto>()
                .FromSqlRaw(
                    @"EXEC procGetEmployees_Pagination20260609
                @PageSize,
                @CurrentPage,
                @SearchText",
                    new SqlParameter("@PageSize", pageSize),
                    new SqlParameter("@CurrentPage", currentPage),
                    new SqlParameter("@SearchText",
                        (object?)searchText ?? DBNull.Value))
                .ToListAsync();

            return Ok(employees);
        }

        [HttpDelete("BulkDeleteEmployees")]
        public async Task<IActionResult> BulkDeleteEmployees([FromBody] List<int> employeeIds)
        {
            if (employeeIds == null || !employeeIds.Any())
            {
                return BadRequest("Employee IDs are required.");
            }

            var employees = await _context.Employees
                .Where(e => employeeIds.Contains(e.Id))
                .ToListAsync();

            if (!employees.Any())
            {
                return NotFound("No employees found.");
            }

            _context.Employees.RemoveRange(employees);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Employees deleted successfully.",
                DeletedCount = employees.Count
            });
        }
    }

}
