using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace emp.server.Models
{
    public class Employee
    {
        public int Id { get; set; }
        [Column(TypeName = "varchar(50)")]
        public string F_name  { get; set; }

        public string L_name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }



    }

    public class EmployeeDto
    {
        public int Id { get; set; }
        public string  F_name { get; set; }
        public string L_name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }



    }
}