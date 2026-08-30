using from_backend_v8.Data;
using Microsoft.AspNetCore.Mvc;
using from_backend_v8.Models;
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
        EXEC CreateUser_202608024
            @Email = {user.Email},
            @Passward = {user.Password}
      ");

            return Ok(new { message = "User Created Successfully" });
        }


    }
}