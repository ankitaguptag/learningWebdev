using from_backend_v8.Models;
using Microsoft.EntityFrameworkCore;

namespace from_backend_v8.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            :base(options) { }
        public DbSet<Student> Students { get; set; }

    }
}