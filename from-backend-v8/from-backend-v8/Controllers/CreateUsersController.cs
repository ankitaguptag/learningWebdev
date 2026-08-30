using from_backend_v8.Data;
using from_backend_v8.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace from_backend_v8.Controllers
{
    /*  [Route("api/[controller]")]
       [ApiController]
       public class CreateUsersController : ControllerBase
       {
           private readonly ApplicationDbContext _context;

           public CreateUsersController(ApplicationDbContext context)
           {
               _context = context;
           }

           [HttpPost]
           public async Task<IActionResult> CreateUser(string email, string password)
           {
               // Check if email already exists
               var existingUser = await _context.Users
                   .FirstOrDefaultAsync(u => u.Email == email);

               if (existingUser != null)
               {
                   return BadRequest(new
                   {
                       message = "Email already exists"
                   });
               }
               // Create new user
               var user = new Users
               {
                   Email = email,
                   Passward = password
               };

               _context.Users.Add(user);
               await _context.SaveChangesAsync();

               return Ok(new
               {
                   message = "User created successfully",
                   email = user.Email
               });
           }
       }*/

    [Route("api/[controller]")]
    [ApiController]
    public class CreateUsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CreateUsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser(string email, string password)
        {
            // Check if email already exists
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);

            if (existingUser != null)
            {
                return BadRequest(new
                {
                    message = "Email already exists"
                });
            }
            // Create new user
            var user = new Users
            {
                Email = email,
                Password = password
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "User created successfully",
                email = user.Email
            });
        }
            [HttpPost]
        [Route("createUser")]
        public IActionResult CreateUsers( Users user)
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