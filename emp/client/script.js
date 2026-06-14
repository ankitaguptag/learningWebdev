const API_URL = "https://localhost:7079/api/Employee";
let searchTimer;
let emplist = []; // Holds the master list from the database

// --- PAGINATION VARIABLES ---
let currentPage = 1;
let pageSize = 10;
let totalRecords = 0;
let totalPages = 1;
let lastSearchText = ""; // Track the last search to maintain pagination
let selectedIds = new Set(); // Tracks selected rows for bulk actions

// --- GET ALL EMPLOYEES ---
async function getAllEmp(page = 1) {
    currentPage = page;
    const searchText = "";
    lastSearchText = "";

    const response = await fetch(
        `${API_URL}/GetEmployees?searchText=${searchText}&currentPage=${currentPage}&pageSize=${pageSize}`
    );
    if (response.ok) {
        const data = await response.json();
        emplist = data.employees || data; // Handle both array and object responses
        selectedIds.clear();
        totalRecords = data[0]?.totalRecords || emplist.length;
        totalPages = Math.ceil(totalRecords / pageSize);
        displayEmployee(emplist);
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

    lastSearchText = searchText;
    currentPage = 1; // Reset to first page when searching

    // If search box is empty, show all employees
    if (searchText === "") {
        getAllEmp(1);
        return;
    }

    const response = await fetch(
        `${API_URL}/GetEmployees?searchText=${searchText}&currentPage=${currentPage}&pageSize=${pageSize}`
    );

    if (response.ok) {
        const data = await response.json();
        emplist = data.employees || data;
        selectedIds.clear();
        totalRecords = data[0]?.totalRecords || emplist.length;
        totalPages = Math.ceil(totalRecords / pageSize);
        displayEmployee(emplist);
    }
    else {
        alert("Search failed");
    }
}

function updateEmployeeCount(count) {
    document.getElementById("employeeCount").textContent = count;
}

// --- UPDATE PAGINATION CONTROLS ---
function updatePaginationControls() {
    document.getElementById("currentPageNum").textContent = currentPage;
    document.getElementById("totalPages").textContent = totalPages;

    // Disable Previous button if on first page
    const prevPageItem = document.getElementById("prevPageItem");
    if (currentPage <= 1) {
        prevPageItem.classList.add("disabled");
    } else {
        prevPageItem.classList.remove("disabled");
    }

    // Disable Next button if on last page
    const nextPageItem = document.getElementById("nextPageItem");
    if (currentPage >= totalPages) {
        nextPageItem.classList.add("disabled");
    } else {
        nextPageItem.classList.remove("disabled");
    }

    updateBulkActionButtons();
}

function updateBulkActionButtons() {
    const hasSelection = selectedIds.size > 0 && !bulkEditMode;
    document.getElementById("bulkEditBtn").style.display = hasSelection ? "inline-block" : "none";
    document.getElementById("bulkDeleteBtn").style.display = hasSelection ? "inline-block" : "none";
}

function toggleSelectAll(headerCheckbox) {
    const checkboxes = document.querySelectorAll(".row-select-checkbox");
    checkboxes.forEach(cb => {
        cb.checked = headerCheckbox.checked;
        const id = String(cb.dataset.id);
        if (headerCheckbox.checked) {
            selectedIds.add(id);
        } else {
            selectedIds.delete(id);
        }
    });
    updateBulkActionButtons();
}

function toggleEmployeeSelection(checkbox, id) {
    const key = String(id);
    if (checkbox.checked) {
        selectedIds.add(key);
    } else {
        selectedIds.delete(key);
    }

    const selectAllCheckbox = document.getElementById("selectAllCheckbox");
    const rowCheckboxes = document.querySelectorAll(".row-select-checkbox");
    const checkedCount = Array.from(rowCheckboxes).filter(cb => cb.checked).length;

    selectAllCheckbox.checked = checkedCount === rowCheckboxes.length && rowCheckboxes.length > 0;
    selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < rowCheckboxes.length;

    updateBulkActionButtons();
}

function getSelectedIds() {
    return Array.from(selectedIds);
}

// --- PAGINATION NAVIGATION ---
async function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        if (lastSearchText) {
            await searchEmpWithPage();
        } else {
            await getAllEmp(currentPage);
        }
    }
}

async function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        if (lastSearchText) {
            await searchEmpWithPage();
        } else {
            await getAllEmp(currentPage);
        }
    }
}

// --- SEARCH WITH PAGINATION ---
async function searchEmpWithPage() {
    const response = await fetch(
        `${API_URL}/GetEmployees?searchText=${lastSearchText}&currentPage=${currentPage}&pageSize=${pageSize}`
    );

    if (response.ok) {
        const data = await response.json();
        emplist = data.employees || data;
        selectedIds.clear();
        totalRecords = data.totalRecords || emplist.length;
        totalPages = Math.ceil(totalRecords / pageSize);
        displayEmployee(emplist);
    } else {
        alert("Failed to load page");
    }
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
        currentPage = 1; // Reset to first page
        getAllEmp(1);
    } else {
        alert("Error creating employee");
    }
}

let bulkEditMode = false;

function displayEmployee(employees) {

    updateEmployeeCount(employees.length);
    updatePaginationControls();

    const tableBody = document.getElementById('EmployeeTableBody');
    tableBody.innerHTML = '';

    employees.forEach(emp => {

        const isChecked = selectedIds.has(String(emp.id));
        const row = `
        <tr>
            <td>
                <input
                    type="checkbox"
                    class="row-select-checkbox"
                    data-id="${emp.id}"
                    ${isChecked ? 'checked' : ''}
                    onclick="toggleEmployeeSelection(this, '${emp.id}')"
                />
            </td>
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

// remove after verification
// async function getEmployees() {
//     const pageSize = 10;
//     const currentPage = 1;
//     const searchText = null;

//     const response = await fetch(
//         `${API_URL}/GetEmployees?searchText=${searchText}&currentPage=${currentPage}&pageSize=${pageSize}`
//     );

//     const data = await response.json();

//     console.log(data);
// }

//getEmployees();





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
        currentPage = 1; // Reset to first page
        getAllEmp(1);
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
            selectedIds.delete(String(employeeId));
            currentPage = 1; // Reset to first page
            getAllEmp(1);
        } else {
            alert("Failed to delete. Server returned: " + response.status);
        }
    }
}

function enableBulkEdit() {

    bulkEditMode = true;

    document.getElementById("bulkEditBtn").style.display = "none";
    document.getElementById("bulkDeleteBtn").style.display = "none";
    document.getElementById("saveAllBtn").style.display = "inline-block";
    document.getElementById("cancelBulkEditBtn").style.display = "inline-block";

    displayEmployee(emplist);
}

function cancelBulkEdit() {

    bulkEditMode = false;

    document.getElementById("saveAllBtn").style.display = "none";
    document.getElementById("cancelBulkEditBtn").style.display = "none";

    displayEmployee(emplist);
    updateBulkActionButtons();
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

        currentPage = 1;
        selectedIds.clear();
        getAllEmp(1);
    }
}

async function bulkDelete() {
    const idsToDelete = getSelectedIds();
    if (idsToDelete.length === 0) {
        alert("Please select at least one employee to delete.");
        return;
    }

    const confirmed = confirm(`Delete ${idsToDelete.length} selected employee(s)?`);
    if (!confirmed) return;

    // Placeholder for future bulk delete API call.
    // Example payload: { ids: idsToDelete } 
    // await fetch(`${API_URL}/bulk-delete`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids: idsToDelete }) });

    alert("Bulk delete request is ready. Implement the API and uncomment the fetch call.");

    selectedIds.clear();
    document.getElementById("selectAllCheckbox").checked = false;
    updateBulkActionButtons();
}

// Run immediately on page initialization
getAllEmp();