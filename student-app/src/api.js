const API_URL = 'https://localhost:7222/api';



export async function fetchStudents({ searchText = '', currentPage = 1, pageSize = 5 } = {}) {
  const params = new URLSearchParams({
    searchText,
    currentPage: String(currentPage),
    pageSize: String(pageSize),
  });

  const res = await fetch(`${API_URL}/Student/GetStudents?${params.toString()}`, {
    method: 'GET',
    headers: { accept: '*/*' },
  });
  if (!res.ok) throw new Error('Fetch failed: ' + res.status);
  return res.json();
}

export async function fetchAllStudents() {
  const params = new URLSearchParams({
  });

  const res = await fetch(`${API_URL}/Student`, {
    method: 'GET',
    headers: { accept: '*/*' },
  });
  if (!res.ok) throw new Error('Fetch failed: ' + res.status);
  return res.json();
}

 
export async function createStudent(student) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', accept: '*/*' },
    body: JSON.stringify(student)
  });
  if (!res.ok) throw new Error('Create failed: ' + res.status);
  return res.json();
}

export async function fetchLogin({ email= '', password = '',  } = {}) {
  const params = new URLSearchParams({
    email,
    password,
  });

  const res = await fetch(`${API_URL}/Login?${params.toString()}`, {
    method: 'POST',
    headers: { accept: '*/*' },
  });
   const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}


export async function createUser(user){
  const  res = await fetch(`${API_URL}/createUser`,{
    method: 'POST',
    headers: {'Content-Type': 'application/json', accept: '*/*'},
     body: JSON.stringify({
        email: user.email,
        password: user.password
      })
  });
  if(!res.ok) throw new Error('Created faild:' + res.status);
  return res.json();
}


 



export async function updateStudent(id, student) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', accept: '*/*' },
    body: JSON.stringify(student)
  });
  if (!res.ok) throw new Error('Update failed: ' + res.status);
  return res.json();
}

export async function deleteStudent(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE', headers: { accept: '*/*' } });
  if (!res.ok) throw new Error('Delete failed: ' + res.status);
  return true;
}
export const bulkUpdateStudents = async (students) => {
  const response = await fetch(`${API_URL}/bulk-update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      accept: "*/*",
    },
    body: JSON.stringify(students),
  });

  if (!response.ok) {
    throw new Error("Failed to update students");
  }

  return await response.json();
};

export const bulkDeleteStudents = async (studentIds) => {
  const response = await fetch(`${API_URL}/BulkDeleteStudent`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(studentIds),
  });

  if (!response.ok) {
    throw new Error("Failed to delete students");
  }

  return await response.json();
};