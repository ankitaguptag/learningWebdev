const API_URL = 'https://localhost:7222/api/Student';

export async function fetchStudents({ searchText = '', currentPage = 1, pageSize = 5 } = {}) {
  const params = new URLSearchParams({
    searchText,
    currentPage: String(currentPage),
    pageSize: String(pageSize),
  });

  const res = await fetch(`${API_URL}/GetStudents?${params.toString()}`, {
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