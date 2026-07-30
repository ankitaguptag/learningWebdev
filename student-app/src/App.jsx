import React, { useEffect, useRef, useState } from 'react';
import StudentForm from './StudentForm';
import StudentTable from './StudentTable';
import * as api from './api';

const PAGE_SIZE = 5;

function App() {
  const [students, setStudents] = useState([]);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
 const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const searchTimerRef = useRef(null);

async function load(page = currentPage, searchText = search) {
    setLoading(true);
    try {
      const data = await api.fetchStudents({
        searchText,
        currentPage: page,
        pageSize: PAGE_SIZE,
      });

      const items = Array.isArray(data) ? data : data.students || [];
      const firstItem = items[0] || {};

      const records = Number(
        firstItem.totalRecord ??
          firstItem.TotalRecord ??
          firstItem.totalRecords ??
          firstItem.TotalRecords ??
          items.length ??
          0
      );

      const pages = records > 0 ? Math.ceil(records / PAGE_SIZE) : 1;

      setStudents(items);
      setCurrentPage(page);
      setTotalPages(pages);
      setTotalRecords(records);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load students. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(1,''); }, []);

  async function handleCreate(student) {
    try {
      await api.createStudent(student);
      await load(1, search);
    } catch (err) { console.error(err); setError('Create failed. Please try again.'); }
  }

  async function handleUpdate(student) {
    try {
      await api.updateStudent(student.StudentID || student.studentID, student);
      setEditing(null);
       await load(currentPage, search);
    } catch (err) { console.error(err); setError('Update failed. Please try again.'); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this student?')) return;
    try {
      await api.deleteStudent(id);
     await load(currentPage, search);
    } catch (err) { console.error(err); setError('Delete failed. Please try again.'); }
  }

  async function handleBulkDelete(ids) {
    if (!ids || ids.length === 0) return;
    if (!window.confirm(`Delete ${ids.length} selected student(s)?`)) return;
    try {
      const payload = ids.map((x) => Number(x));
      await api.bulkDeleteStudents(payload);
      setSelectedStudents([]);
      setSuccessMessage('Selected students deleted.');
      setError(null);
      await load(currentPage, search);
    } catch (err) { console.error(err); setError('Bulk delete failed. Please try again.'); setSuccessMessage(''); }
  }

  async function handleBulkUpdate() {
    if (!selectedStudents || selectedStudents.length === 0) return;
    if (!window.confirm(`Update ${selectedStudents.length} selected student(s)?`)) return;

    const selectedIdSet = new Set(selectedStudents.map((id) => String(id)));
    const payload = students
      .filter((student) => selectedIdSet.has(String(student.studentID ?? student.StudentID ?? "")))
      .map((student) => ({
        StudentID: Number(student.studentID ?? student.StudentID),
        FirstName: student.firstName ?? student.FirstName ?? '',
        LastName: student.lastName ?? student.LastName ?? '',
        Gender: student.gender ?? student.Gender ?? '',
        Dateofbirth: student.dateofbirth ?? student.Dateofbirth ?? '',
        Age: Number(student.age ?? student.Age ?? 0),
        Email: student.email ?? student.Email ?? '',
        Phone: student.phone ?? student.Phone ?? '',
        Address: student.address ?? student.Address ?? '',
        City: student.city ?? student.City ?? '',
        State: student.state ?? student.State ?? '',
        Course: student.course ?? student.Course ?? '',
        AdmiDate: student.admiDate ?? student.AdmiDate ?? '',
      }));

    if (payload.length === 0) {
      setError('No selected students available to update.');
      setSuccessMessage('');
      return;
    }

    try {
      await api.bulkUpdateStudents(payload);
      setSelectedStudents([]);
      setSuccessMessage(`Updated ${payload.length} student(s).`);
      setError(null);
      await load(currentPage, search);
    } catch (err) {
      console.error(err);
      setError('Bulk update failed. Please try again.');
      setSuccessMessage('');
    }
  }

function handleSearchChange(event) {
  const value = event.target.value;
  setSearch(value);

  if (searchTimerRef.current) {
    clearTimeout(searchTimerRef.current);
  }

  searchTimerRef.current = setTimeout(() => {
    load(1, value);
  }, 400);
}
  function previousPage() {
    if (currentPage > 1) {
      load(currentPage - 1, search);
    }
  }

  function nextPage() {
    if (currentPage < totalPages) {
      load(currentPage + 1, search);
    }
  }

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
            {totalRecords || students.length} student{(totalRecords || students.length) !== 1 ? 's' : ''}
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

        {successMessage && (
          <div className="alert alert-success alert-dismissible fade show shadow-sm" role="alert">
            <i className="bi bi-check-circle-fill me-2"></i>
            {successMessage}
            <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
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
                      onChange={handleSearchChange}
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
                ) : students.length === 0 ? (
                  <div className="text-center text-muted py-5">
                    <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                    No students found.
                  </div>
                ) : (
                  <StudentTable students={students} onEdit={(s) => setEditing(s)} onDelete={handleDelete} 
                     currentPage={currentPage}
                    totalPages={totalPages}
                    previousPage={previousPage}
                    nextPage={nextPage}
                    selectedStudents={selectedStudents}
                    setSelectedStudents={setSelectedStudents}
                    onBulkDelete={handleBulkDelete}
                    onBulkUpdate={handleBulkUpdate}
                  />
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