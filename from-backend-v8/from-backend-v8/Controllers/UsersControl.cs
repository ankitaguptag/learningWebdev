using from_backend_v8.Data;
using from_backend_v8.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace from_backend_v8.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LoginController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Login(string email, string password)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u =>
                    u.Email == email &&
                    u.Password == password);

            if (user == null)
            {
                return Unauthorized(new
                {
                    message = "Invalid email or password"
                });
            }

            return Ok(new
            {
                message = "Login successful",
                email = user.Email
            });
        }

        [HttpPost]
        [Route("CreateUser")]
        public IActionResult CreateUsers(Users user)
        {
            _context.Database.ExecuteSqlInterpolated($@"
       EXEC CreateUser_20260911
                @UserName = {user.UserName},
                @Email = {user.Email},
            @Password = {user.Password}
      ");

            return Ok(new { message = "User Created Successfully" });
        }


        [HttpGet("GetUsers")]
        public async Task<IActionResult> GetUsers(
              string? searchText,
              int currentPage = 1,
              int pageSize = 10
            )

        {
            var users = await _context.UserDtos
                .FromSqlRaw(@"Exec procGetUserPagination
                @PageSize,
                @CurrentPage,
                @SearchText",
                new SqlParameter("@PageSize", pageSize),
                    new SqlParameter("@CurrentPage", currentPage),
                    new SqlParameter("@SearchText",
                        (object?)searchText ?? DBNull.Value)
                )
                .ToListAsync();

            return Ok(users);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserUpdateDto user)
        {
            try
            {
                await _context.Database.ExecuteSqlRawAsync(
                    "EXEC UpdateUsers @Id = {0}, @UserName = {1}",
                    id,
                    user.UserName
                );

                return Ok(new
                {
                    message = "User updated successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }


        [HttpDelete("{id}")]
        public IActionResult DeleteById(int id)
        {
            _context.Database.ExecuteSqlRaw(
               "EXEC deleteUserId @Id",
               new SqlParameter("@Id", id)
           );
            return Ok();

        }



    }
}