namespace emp.server.Models
{
    public class EmployeeListDto
    {
        public int TotalRecords { get; set; }

        public int Id { get; set; }

        public string F_name { get; set; }

        public string L_name { get; set; }

        public string Email { get; set; }

        public string Phone { get; set; }
    }
}