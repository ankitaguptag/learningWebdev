import React, { useEffect, useState } from 'react';
import StudentForm from './StudentForm';
import StudentTable from './StudentTable';
import * as api from './api';

function App() {
  const [students, setStudents] = useState([]);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');

  async function load() {
    try {
      const data = await api.fetchStudents();
      setStudents(data);
    } catch (err) {
      console.error(err);
      // optionally show user-friendly error
    }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(student) {
    try {
      await api.createStudent(student);
      await load();
    } catch (err) { console.error(err); alert('Create failed'); }
  }

  async function handleUpdate(student) {
    try {
      await api.updateStudent(student.StudentID || student.studentID, student);
      setEditing(null);
      await load();
    } catch (err) { console.error(err); alert('Update failed'); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this student?')) return;
    try {
      await api.deleteStudent(id);
      await load();
    } catch (err) { console.error(err); alert('Delete failed'); }
  }

  const filtered = students.filter(s => {
    if (!search) return true;
    return (s.firstName || s.FirstName || '').toLowerCase().startsWith(search.toLowerCase());
  });

  return (
    <div className="container mt-4">
      <h3 className="text-center">Student Form (React)</h3>
      <div className="row">
        <div className="col-md-5">
          <StudentForm
            key={editing ? editing.studentID || editing.StudentID : 'new'}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            editing={editing}
            onCancel={() => setEditing(null)}
          />
        </div>
        <div className="col-md-7">
          <div className="mb-2">
            <input
              className="form-control"
              placeholder="Search by first name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <StudentTable students={filtered} onEdit={(s) => setEditing(s)} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
}

export default App;