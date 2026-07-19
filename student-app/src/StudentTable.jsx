import React from 'react';

export default function StudentTable({ students = [], onEdit, onDelete }) {
  return (
    <table className="table table-hover">
      <thead>
        <tr>
          <th>StudentId</th><th>First Name</th><th>Last Name</th>
          <th>DOB</th><th>Gender</th><th>Age</th><th>Email</th>
          <th>Phone</th><th>Address</th><th>City</th><th>State</th>
          <th>Course</th><th>Admission Date</th><th>Action</th>
        </tr>
      </thead>
      <tbody>
        {students.map(s => {
          const id = s.studentID ?? s.StudentID ?? '';
          return (
            <tr key={id}>
              <td>{id}</td>
              <td>{s.firstName ?? s.FirstName}</td>
              <td>{s.lastName ?? s.LastName}</td>
              <td>{s.dateofbirth ?? s.Dateofbirth}</td>
              <td>{s.gender ?? s.Gender}</td>
              <td>{s.age ?? s.Age}</td>
              <td>{s.email ?? s.Email}</td>
              <td>{s.phone ?? s.Phone}</td>
              <td>{s.address ?? s.Address}</td>
              <td>{s.city ?? s.City}</td>
              <td>{s.state ?? s.State}</td>
              <td>{s.course ?? s.Course}</td>
              <td>{s.admiDate ?? s.AdmiDate}</td>
              <td>
                <button className="btn btn-sm btn-primary me-1" onClick={() => onEdit(s)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => onDelete(id)}>Delete</button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}