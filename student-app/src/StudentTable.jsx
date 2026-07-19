import React from 'react';

function formatDate(d) {
  if (!d) return '—';
  const date = new Date(d);
  if (isNaN(date.getTime())) return d;
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

const genderBadge = {
  Male: 'bg-primary-subtle text-primary-emphasis',
  Female: 'bg-danger-subtle text-danger-emphasis',
  Other: 'bg-secondary-subtle text-secondary-emphasis',
};

export default function StudentTable({ students = [], onEdit, onDelete }) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>DOB</th>
            <th>Gender</th>
            <th>Age</th>
            <th>Contact</th>
            <th>Location</th>
            <th>Course</th>
            <th>Admission Date</th>
            <th className="text-end">Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => {
            const id = s.studentID ?? s.StudentID ?? '';
            const firstName = s.firstName ?? s.FirstName ?? '';
            const lastName = s.lastName ?? s.LastName ?? '';
            const gender = s.gender ?? s.Gender ?? '';
            const email = s.email ?? s.Email ?? '';
            const phone = s.phone ?? s.Phone ?? '';
            const city = s.city ?? s.City ?? '';
            const state = s.state ?? s.State ?? '';
            const course = s.course ?? s.Course ?? '';
            const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

            return (
              <tr key={id}>
                <td className="text-muted">#{id}</td>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle bg-primary text-white fw-semibold flex-shrink-0"
                      style={{ width: 32, height: 32, fontSize: '0.75rem' }}
                    >
                      {initials || '?'}
                    </div>
                    <span className="fw-medium">{firstName} {lastName}</span>
                  </div>
                </td>
                <td>{formatDate(s.dateofbirth ?? s.Dateofbirth)}</td>
                <td>
                  {gender ? (
                    <span className={`badge rounded-pill ${genderBadge[gender] || 'bg-light text-dark'}`}>
                      {gender}
                    </span>
                  ) : '—'}
                </td>
                <td>{s.age ?? s.Age ?? '—'}</td>
                <td>
                  <div className="small">
                    {email && <div><i className="bi bi-envelope me-1 text-muted"></i>{email}</div>}
                    {phone && <div className="text-muted"><i className="bi bi-telephone me-1"></i>{phone}</div>}
                  </div>
                </td>
                <td>
                  <div className="small">
                    {city || '—'}{state ? `, ${state}` : ''}
                  </div>
                </td>
                <td>
                  {course ? <span className="badge bg-info-subtle text-info-emphasis">{course}</span> : '—'}
                </td>
                <td>{formatDate(s.admiDate ?? s.AdmiDate)}</td>
                <td className="text-end">
  <div className="btn-group btn-group-sm">
    <button className="btn btn-outline-primary" onClick={() => onEdit(s)}>
      Edit
    </button>
    <button className="btn btn-outline-danger" onClick={() => onDelete(id)}>
      Delete
    </button>
  </div>
</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}