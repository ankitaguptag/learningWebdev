using from_backend_v8.Models;
using Microsoft.EntityFrameworkCore;

namespace from_backend_v8.Data
 
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            :base(options) { }
        public DbSet<Student> Students { get; set; }
        public DbSet<Users> Users { get; set; }
        public DbSet<UserDto> UserDtos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<StudentListDto>()
                .HasNoKey();

            modelBuilder.Entity<Users>()
               .ToTable("Users");

            modelBuilder.Entity<Users>()
               .HasKey(u => u.Email);


        }
    }
}