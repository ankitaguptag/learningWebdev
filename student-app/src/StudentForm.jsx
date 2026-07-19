import React, { useEffect, useState } from 'react';

const empty = {
  StudentID: '',
  FirstName: '',
  LastName: '',
  Dateofbirth: '',
  Gender: '',
  Age: '',
  Email: '',
  Phone: '',
  Address: '',
  City: '',
  State: '',
  Course: '',
  AdmiDate: '',
};

export default function StudentForm({ onCreate, onUpdate, editing, onCancel }) {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editing) {
      // Normalize editing object property names if backend uses different casing
      const normalized = {
        StudentID: editing.studentID ?? editing.StudentID ?? '',
        FirstName: editing.firstName ?? editing.FirstName ?? '',
        LastName: editing.lastName ?? editing.LastName ?? '',
        Dateofbirth: editing.dateofbirth ?? editing.Dateofbirth ?? '',
        Gender: editing.gender ?? editing.Gender ?? '',
        Age: editing.age ?? editing.Age ?? '',
        Email: editing.email ?? editing.Email ?? '',
        Phone: editing.phone ?? editing.Phone ?? '',
        Address: editing.address ?? editing.Address ?? '',
        City: editing.city ?? editing.City ?? '',
        State: editing.state ?? editing.State ?? '',
        Course: editing.course ?? editing.Course ?? '',
        AdmiDate: editing.admiDate ?? editing.AdmiDate ?? '',
      };
      setForm(normalized);
      setError('');
    } else {
      setForm(empty);
      setError('');
    }
  }, [editing]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  function validate() {
    if (!form.StudentID) return 'Please enter Student ID';
    if (!form.FirstName) return 'Please enter first name';
    if (!form.LastName) return 'Please enter last name';
    if (!form.Dateofbirth) return 'Please enter DOB';
    if (!form.Gender) return 'Please select gender';
    if (!form.Age) return 'Please enter age';
    if (!form.Email) return 'Please enter email';
    return '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const v = validate();
    if (v) { setError(v); return; }
    setError('');
    const payload = {
      StudentID: parseInt(form.StudentID, 10),
      FirstName: form.FirstName,
      LastName: form.LastName,
      Gender: form.Gender,
      Dateofbirth: form.Dateofbirth,
      Age: parseInt(form.Age || 0, 10),
      Email: form.Email,
      Phone: form.Phone,
      Address: form.Address,
      City: form.City,
      State: form.State,
      Course: form.Course,
      AdmiDate: form.AdmiDate
    };

    try {
      if (editing) await onUpdate(payload);
      else await onCreate(payload);
      setForm(empty);
    } catch (err) {
      console.error(err);
      setError('Server error');
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && (
        <div className="alert alert-danger py-2 d-flex align-items-center gap-2" role="alert">
          <i className="bi bi-exclamation-circle-fill"></i>
          <span>{error}</span>
        </div>
      )}

      <div className="row g-3">
        <div className="col-md-3">
          <label className="form-label fw-semibold">Student ID</label>
          <input
            name="StudentID"
            value={form.StudentID}
            onChange={handleChange}
            className="form-control"
            placeholder="e.g. 1001"
            disabled={!!editing}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label fw-semibold">First Name</label>
          <input name="FirstName" value={form.FirstName} onChange={handleChange} className="form-control" placeholder="First name" />
        </div>
        <div className="col-md-3">
          <label className="form-label fw-semibold">Last Name</label>
          <input name="LastName" value={form.LastName} onChange={handleChange} className="form-control" placeholder="Last name" />
        </div>
        <div className="col-md-3">
          <label className="form-label fw-semibold">Date of Birth</label>
          <input name="Dateofbirth" type="date" value={form.Dateofbirth} onChange={handleChange} className="form-control" />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold d-block">Gender</label>
          <div className="btn-group" role="group">
            {['Male', 'Female', 'Other'].map(g => (
              <React.Fragment key={g}>
                <input
                  type="radio"
                  className="btn-check"
                  name="Gender"
                  id={`gender-${g}`}
                  value={g}
                  checked={form.Gender === g}
                  onChange={handleChange}
                  autoComplete="off"
                />
                <label className="btn btn-outline-primary" htmlFor={`gender-${g}`}>{g}</label>
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="col-md-3">
          <label className="form-label fw-semibold">Age</label>
          <input name="Age" type="number" min="0" value={form.Age} onChange={handleChange} className="form-control" placeholder="Age" />
        </div>
        <div className="col-md-3">
          <label className="form-label fw-semibold">Email</label>
          <input name="Email" type="email" value={form.Email} onChange={handleChange} className="form-control" placeholder="name@example.com" />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold">Phone</label>
          <input name="Phone" value={form.Phone} onChange={handleChange} className="form-control" placeholder="Phone number" />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold">Address</label>
          <input name="Address" value={form.Address} onChange={handleChange} className="form-control" placeholder="Street address" />
        </div>

        <div className="col-md-4">
          <label className="form-label fw-semibold">City</label>
          <select name="City" value={form.City} onChange={handleChange} className="form-select">
            <option value="">-- Select City --</option>
            <option value="Delhi">Delhi</option>
            <option value="Noida">Noida</option>
            <option value="Ghaziabad">Ghaziabad</option>
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label fw-semibold">State</label>
          <select name="State" value={form.State} onChange={handleChange} className="form-select">
            <option value="">-- Select State --</option>
            <option value="Delhi">Delhi</option>
            <option value="UP">Uttar Pradesh</option>
            <option value="Maharashtra">Maharashtra</option>
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label fw-semibold">Course</label>
          <select name="Course" value={form.Course} onChange={handleChange} className="form-select">
            <option value="">-- Select Course --</option>
            <option value="BCA">BCA</option>
            <option value="MCA">MCA</option>
            <option value="IIT">IIT</option>
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label fw-semibold">Admission Date</label>
          <input name="AdmiDate" type="date" value={form.AdmiDate} onChange={handleChange} className="form-control" />
        </div>
      </div>

      <hr className="my-4" />

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary px-4">
          <i className={`bi ${editing ? 'bi-check-circle' : 'bi-plus-circle'} me-1`}></i>
          {editing ? 'Update Student' : 'Add Student'}
        </button>
        {editing && (
          <button type="button" className="btn btn-outline-secondary px-4" onClick={onCancel}>
            <i className="bi bi-x-circle me-1"></i>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}