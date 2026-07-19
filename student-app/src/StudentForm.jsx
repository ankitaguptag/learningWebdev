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
    <form className="p-3 border rounded" onSubmit={handleSubmit}>
      <div className="text-danger mb-2">{error}</div>

      <label>Id:</label>
      <input name="StudentID" value={form.StudentID} onChange={handleChange} className="form-control" />

      <div className="row mb-2">
        <div className="col">
          <label>First Name:</label>
          <input name="FirstName" value={form.FirstName} onChange={handleChange} className="form-control" />
        </div>
        <div className="col">
          <label>Last Name:</label>
          <input name="LastName" value={form.LastName} onChange={handleChange} className="form-control" />
        </div>
      </div>

      <label>Date of Birth:</label>
      <input name="Dateofbirth" type="date" value={form.Dateofbirth} onChange={handleChange} className="form-control" />

      <label className="mt-2">Gender:</label>
      <div>
        <div className="form-check form-check-inline">
          <input className="form-check-input" type="radio" name="Gender" value="Male" checked={form.Gender === 'Male'} onChange={handleChange} />
          <label className="form-check-label">Male</label>
        </div>
        <div className="form-check form-check-inline">
          <input className="form-check-input" type="radio" name="Gender" value="Female" checked={form.Gender === 'Female'} onChange={handleChange} />
          <label className="form-check-label">Female</label>
        </div>
        <div className="form-check form-check-inline">
          <input className="form-check-input" type="radio" name="Gender" value="Other" checked={form.Gender === 'Other'} onChange={handleChange} />
          <label className="form-check-label">Other</label>
        </div>
      </div>

      <div className="row mb-2 mt-2">
        <div className="col">
          <label>Age:</label>
          <input name="Age" type="number" value={form.Age} onChange={handleChange} className="form-control" />
        </div>
        <div className="col">
          <label>Email:</label>
          <input name="Email" type="email" value={form.Email} onChange={handleChange} className="form-control" />
        </div>
      </div>

      <div className="row mb-2">
        <div className="col">
          <label>Phone:</label>
          <input name="Phone" value={form.Phone} onChange={handleChange} className="form-control" />
        </div>
        <div className="col">
          <label>Address:</label>
          <input name="Address" value={form.Address} onChange={handleChange} className="form-control" />
        </div>
      </div>

      <div className="row mb-2">
        <div className="col">
          <label>City:</label>
          <select name="City" value={form.City} onChange={handleChange} className="form-select">
            <option value="">-- Select City --</option>
            <option value="Delhi">Delhi</option>
            <option value="Noida">Noida</option>
            <option value="Ghaziabad">Ghaziabad</option>
          </select>
        </div>
        <div className="col">
          <label>State:</label>
          <select name="State" value={form.State} onChange={handleChange} className="form-select">
            <option value="">-- Select State --</option>
            <option value="Delhi">Delhi</option>
            <option value="UP">Uttar Pradesh</option>
            <option value="Maharashtra">Maharashtra</option>
          </select>
        </div>
      </div>

      <div className="row mb-2">
        <div className="col">
          <label>Course:</label>
          <select name="Course" value={form.Course} onChange={handleChange} className="form-select">
            <option value="">-- Select Course --</option>
            <option value="BCA">BCA</option>
            <option value="MCA">MCA</option>
            <option value="IIT">IIT</option>
          </select>
        </div>
        <div className="col">
          <label>Admission Date:</label>
          <input name="AdmiDate" type="date" value={form.AdmiDate} onChange={handleChange} className="form-control" />
        </div>
      </div>

      <div className="mt-3">
        <button type="submit" className="btn btn-primary me-2">
          {editing ? 'Update' : 'Submit'}
        </button>
        {editing && <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}