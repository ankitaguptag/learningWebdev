const API_URL = "https://localhost:7079/api/Employee";
let searchTimer;
let emplist = []; // Holds the master list from the database

// --- GET ALL EMPLOYEES ---
async function getAllEmp() {
    const response = await fetch(API_URL);

    if (response.ok) {
        emplist = await response.json();
        // Applies active filter or displays everything if empty
        searchEmp(); 
    } else {
        alert("Error fetching employees");
    }
}

// --- CORRECTED SEARCH FUNCTION ---
function searchEmp() {
    // FIX: Changed from 'searchInput' to 'employeeSearch' to match your HTML ID
    const searchInput = document.getElementById("employeeSearch");
    const query = searchInput ? searchInput.value.toLowerCase().trim() : "";

    // Filter the master list based on what fields START with the query
    const filteredList = emplist.filter(emp => {
        return (
            (emp.f_name && emp.f_name.toLowerCase().startsWith(query)) ||
            (emp.l_name && emp.l_name.toLowerCase().startsWith(query)) ||
            (emp.id && emp.id.toString().startsWith(query))
        );
    });

    // Render the matching results
    displayEmployee(filteredList);
}
function searchEmpDeBound() {

    clearTimeout(searchTimer);

    searchTimer = setTimeout(() => {
        searchEmpAPI();
    }, 500); // wait 500 ms after user stops typing
}

async function searchEmpAPI() {

    const searchText = document
        .getElementById("employeeSearch")
        .value
        .trim();

    // If search box is empty, show all employees
    if (searchText === "") {
        getAllEmp();
        return;
    }

    const response = await fetch(
        `${API_URL}/search?searchText=${searchText}`
    );

    if (response.ok) {
        const employees = await response.json();
        displayEmployee(employees);
    }
    else {
        alert("Search failed");
    }
}

function updateEmployeeCount(count) {
    document.getElementById("employeeCount").textContent = count;
}

// --- HELPER TO CLEAR SEARCH ---
function clearSearchInput() {
    const searchInput = document.getElementById("employeeSearch");
    if (searchInput) searchInput.value = "";
}

// --- CREATE EMPLOYEE ---
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
        document.querySelector("form").reset();
        clearSearchInput(); // Clear search box so the user sees their new entry
        getAllEmp();
    } else {
        alert("Error creating employee");
    }
}

let bulkEditMode = false;

function displayEmployee(employees) {

    updateEmployeeCount(employees.length);

    const tableBody = document.getElementById('EmployeeTableBody');
    tableBody.innerHTML = '';

    employees.forEach(emp => {

        const row = `
        <tr>
        <td><input type="checkbox"/></td>
            <td>${emp.id}</td>

            <td>
                ${bulkEditMode
                    ? `<input
                        type="text"
                        value="${emp.f_name ?? ''}"
                        class="form-control fname"
                        data-id="${emp.id}">`
                    : emp.f_name}
            </td>

            <td>
                ${bulkEditMode
                    ? `<input
                        type="text"
                        value="${emp.l_name ?? ''}"
                        class="form-control lname"
                        data-id="${emp.id}">`
                    : emp.l_name}
            </td>

            <td>
                ${bulkEditMode
                    ? `<input
                        type="email"
                        value="${emp.email ?? ''}"
                        class="form-control email"
                        data-id="${emp.id}">`
                    : emp.email}
            </td>

            <td>
                ${bulkEditMode
                    ? `<input
                        type="text"
                        value="${emp.phone ?? ''}"
                        class="form-control phone"
                        data-id="${emp.id}">`
                    : emp.phone}
            </td>

            <td>
                ${bulkEditMode
                    ? `<span class="text-success fw-bold">
                        Editable
                       </span>`
                    : `
                        <button
                            class="btn btn-sm btn-primary"
                            onclick="editEmp(${emp.id})">
                            Edit
                        </button>

                        <button
                            class="btn btn-sm btn-danger"
                            onclick="deleteEmp(${emp.id})">
                            Delete
                        </button>
                    `}
            </td>
        </tr>
        `;

        tableBody.innerHTML += row;
    });
}

async function getEmployees() {
    const pageSize = 10;
    const currentPage = 1;
    const searchText = "";

    const response = await fetch(
        `https://localhost:5001/api/Employee/GetEmployees?pageSize=${pageSize}&currentPage=${currentPage}&searchText=${searchText}`
    );

    const data = await response.json();

    console.log(data);
}

getEmployees();





// --- DISPLAY EMPLOYEES ---
// function displayEmployee(employees) {

//      updateEmployeeCount(employees.length);

//     const tableBody = document.getElementById('EmployeeTableBody');
//     tableBody.innerHTML = '';

//     employees.forEach(emp => {
//         const row = `
//         <tr>
//             <td>${emp.id}</td>
//             <td>${emp.f_name}</td>
//             <td>${emp.l_name}</td>
//             <td>${emp.email}</td>
//             <td>${emp.phone}</td>
//             <td>
//                 <button class="btn btn-sm btn-primary" onclick="editEmp(${emp.id})">Edit</button>
//                 <button class="btn btn-sm btn-danger" onclick="deleteEmp(${emp.id})">Delete</button>
//             </td>
//         </tr>
//         `;
//         tableBody.innerHTML += row;
//     });
// }

// --- EDIT MODE ACTIVATION ---
function editEmp(employeeId) {
    const emp = emplist.find(x => x.id == employeeId);

    if (!emp) return;

    document.getElementById("id").value = emp.id;
    document.getElementById("f_name").value = emp.f_name;
    document.getElementById("l_name").value = emp.l_name;
    document.getElementById("email").value = emp.email;
    document.getElementById("phone").value = emp.phone;

    document.getElementById("submitBtn").style.display = "none";
    document.getElementById("updateBtn").style.display = "inline-block";
    document.getElementById("id").readOnly = true;
}

// --- UPDATE EMPLOYEE ---
async function updateEmp(event) {
    event.preventDefault();

    const id = document.getElementById("id").value;

    const employee = {
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
        clearSearchInput(); // Clear the search so they can see their updated data
        getAllEmp();
    } else {
        alert("Update failed");
    }
}

// --- DELETE EMPLOYEE ---
async function deleteEmp(employeeId) {
    if (confirm("Are you sure you want to delete this Employee?")) {
        const response = await fetch(`${API_URL}/${employeeId}`, {
            method: 'DELETE',
            headers: { 'accept': '*/*' }
        });

        if (response.ok) {
            alert("Employee deleted successfully!");
            getAllEmp(); 
        } else {
            alert("Failed to delete. Server returned: " + response.status);
        }
    }
}

function enableBulkEdit() {

    bulkEditMode = true;

    document.getElementById("saveAllBtn").style.display = "inline-block";
    document.getElementById("cancelBulkEditBtn").style.display = "inline-block";

    displayEmployee(emplist);
}

function cancelBulkEdit() {

    bulkEditMode = false;

    document.getElementById("saveAllBtn").style.display = "none";
    document.getElementById("cancelBulkEditBtn").style.display = "none";

    displayEmployee(emplist);
}

async function saveAllEmployees() {

    const employees = [];

    document.querySelectorAll(".fname")
        .forEach(fnameInput => {

            const id = parseInt(
                fnameInput.dataset.id
            );

            employees.push({
                id: id,

                f_name: fnameInput.value,

                l_name:
                    document.querySelector(
                        `.lname[data-id="${id}"]`
                    ).value,

                email:
                    document.querySelector(
                        `.email[data-id="${id}"]`
                    ).value,

                phone:
                    document.querySelector(
                        `.phone[data-id="${id}"]`
                    ).value
            });
        });

    const response = await fetch(
        `${API_URL}/bulk-update`,
        {
            method: "PUT",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify(employees)
        });

    if(response.ok)
    {
        alert("Updated Successfully");

        bulkEditMode = false;

        document.getElementById("saveAllBtn")
            .style.display = "none";

        getAllEmp(currentPage);
    }
}

// Run immediately on page initialization
getAllEmp();