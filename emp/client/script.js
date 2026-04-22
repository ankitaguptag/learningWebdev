
const API_URL = "https://localhost:7079/api/Employee";
async function createEmp(event)
{
    event.preventDefault();
    var f_name= document.getElementById("f_name").value; 
    var l_name= document.getElementById("l_name").value;
    var email= document.getElementById("email").value;
    var phone= document.getElementById("phone").value;
    
    var employee = {
        f_name: f_name,
        l_name: l_name,
        email: email,
        phone: phone
    }

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {  
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(employee)
    });
    if(response.ok)
    {        alert("Employee created successfully");
    }   
    else
    {        alert("Error creating employee");
    }
}
getAllEmp();
var emplist =[]
async function getAllEmp()
{
    const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if(response.ok)
    {
         emplist = await response.json();
         displayEmployee(emplist)
        console.log(emplist);
    }
    else
    {
        alert("Error fetching employees");
    }
}

function displayEmployee(employees) {
    const tableBody = document.getElementById('EmployeeTableBody');
    tableBody.innerHTML = '';

    employees.forEach(employee => {
       const rows = `
        <tr> 
         <td>${employee.id}</td> 
            <td>${employee.f_name}</td> 
            <td>${employee.l_name}</td>  
            <td>${employee.email}</td>  
            <td>${employee.phone}</td> 
            <td>
                <button class="btn btn-sm btn-warning me-2" onclick="editEmp(${employee.id})">
                    Edit
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteEmp(${employee.id})">
                    Delete
                </button>
            </td>
        </tr>
        `;
            tableBody.innerHTML =  tableBody.innerHTML  + rows;

    });

}