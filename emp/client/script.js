const API_URL = "https://localhost:7079/api/Employee";

let emplist = [];


async function createEmp(event) {
    event.preventDefault();

    const employee = {
        id: document.getElementById("id").value,
        f_name: document.getElementById("f_name").value,
        l_name: document.getElementById("l_name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value
    };

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employee)
    });

    if (response.ok) {
        alert("Employee created successfully");
        getAllEmp();
        event.target.reset();
    } else {
        alert("Error creating employee");
    }
}

async function getAllEmp() {
    const response = await fetch(API_URL);

    if (response.ok) {
        emplist = await response.json();
        displayEmployee(emplist);
    } else {
        alert("Error fetching employees");
    }
}
function displayEmployee(employees) {
    const tableBody = document.getElementById('EmployeeTableBody');
    tableBody.innerHTML = '';

    employees.forEach(emp => {
        const row = `
        <tr>
            <td>${emp.id}</td>
            <td>${emp.f_name}</td>
            <td>${emp.l_name}</td>
            <td>${emp.email}</td>
            <td>${emp.phone}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editEmp(${emp.id})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteEmp(${emp.id})">Delete</button>
            </td>
        </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function editEmp(employeeId) {
    const emp = emplist.find(x => x.id == employeeId);

    document.getElementById("id").value = emp.id;
    document.getElementById("f_name").value = emp.f_name;
    document.getElementById("l_name").value = emp.l_name;
    document.getElementById("email").value = emp.email;
    document.getElementById("phone").value = emp.phone;

    document.getElementById("submitBtn").style.display = "none";
    document.getElementById("updateBtn").style.display = "inline-block";
    document.getElementById("id").readOnly = true;
}

async function updateEmp(event) {
    event.preventDefault();

    const id = document.getElementById("id").value;

    const employee = {
        id: id,
        f_name: document.getElementById("f_name").value,
        l_name: document.getElementById("l_name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value
    };

    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employee)
    });

    if (response.ok) {
        alert("Employee updated successfully");

        document.getElementById("submitBtn").style.display = "inline-block";
        document.getElementById("updateBtn").style.display = "none";
        document.getElementById("id").readOnly = false;

        document.querySelector("form").reset();
        getAllEmp();
    } else {
        alert("Update failed");
    }
}

async function deleteEmp(employeeId) {
    if (confirm("Are you sure you want to delete this Employee?")) {

      const response = await fetch(`${API_URL}/${employeeId}`, {
        method: 'DELETE',
        headers: {
          'accept': '*/*'
        }
      });

      if (response.ok) {
        alert("Employee deleted successfully!");
        getAllEmp(); // Refresh the table
      } else {
        alert("Failed to delete. Server returned: " + response.status);
      }
    }
  }

getAllEmp(); 