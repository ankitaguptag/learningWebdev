namespace emp.server.Models
{
    public class EmployeePaginationRequest
    {
        public int PageSize { get; set; }
        public int CurrentPage { get; set; }
        public string? SearchText { get; set; }

    }
}
