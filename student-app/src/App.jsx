import React, { useEffect, useState } from 'react';
import StudentForm from './StudentForm';
import StudentTable from './StudentTable';
import * as api from './api';

function App() {
  const [students, setStudents] = useState([]);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const data = await api.fetchStudents();
      setStudents(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load students. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(student) {
    try {
      await api.createStudent(student);
      await load();
    } catch (err) { console.error(err); setError('Create failed. Please try again.'); }
  }

  async function handleUpdate(student) {
    try {
      await api.updateStudent(student.StudentID || student.studentID, student);
      setEditing(null);
      await load();
    } catch (err) { console.error(err); setError('Update failed. Please try again.'); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this student?')) return;
    try {
      await api.deleteStudent(id);
      await load();
    } catch (err) { console.error(err); setError('Delete failed. Please try again.'); }
  }

  const filtered = students.filter(s => {
    if (!search) return true;
    return (s.firstName || s.FirstName || '').toLowerCase().startsWith(search.toLowerCase());
  });

  return (
    <div className="bg-light min-vh-100">
      {/* Header */}
      <nav className="navbar navbar-dark bg-dark shadow-sm mb-4">
        <div className="container">
          <span className="navbar-brand mb-0 h1 d-flex align-items-center gap-2">
            <i className="bi bi-mortarboard-fill"></i>
            Student Manager
          </span>
          <span className="badge bg-primary rounded-pill fs-6">
            {students.length} student{students.length !== 1 ? 's' : ''}
          </span>
        </div>
      </nav>

      <div className="container pb-5">
        {/* Error alert */}
        {error && (
          <div className="alert alert-danger alert-dismissible fade show shadow-sm" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
            <button type="button" className="btn-close" onClick={() => setError(null)}></button>
          </div>
        )}

        <div className="row justify-content-center">
          {/* Form card */}
          <div className="col-6">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white border-bottom-0 pt-3">
                <h5 className="mb-0 text-primary">
                  <i className={`bi ${editing ? 'bi-pencil-square' : 'bi-person-plus-fill'} me-2`}></i>
                  {editing ? 'Edit Student' : 'Add New Student'}
                </h5>
              </div>
              <div className="card-body">
                <StudentForm
                  key={editing ? editing.studentID || editing.StudentID : 'new'}
                  onCreate={handleCreate}
                  onUpdate={handleUpdate}
                  editing={editing}
                  onCancel={() => setEditing(null)}
                />
              </div>
            </div>
          </div>

          {/* Table card */}
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white border-bottom-0 pt-3">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <h5 className="mb-0 text-primary">
                    <i className="bi bi-people-fill me-2"></i>
                    Students
                  </h5>
                  <div className="input-group" style={{ maxWidth: '320px' }}>
                    <span className="input-group-text bg-white">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      className="form-control"
                      placeholder="Search by first name..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="card-body">
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="text-center text-muted py-5">
                    <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                    No students found.
                  </div>
                ) : (
                  <StudentTable students={filtered} onEdit={(s) => setEditing(s)} onDelete={handleDelete} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;