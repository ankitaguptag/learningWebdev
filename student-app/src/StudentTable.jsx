import React from "react";

function formatDate(d) {
  if (!d) return "—";
  const date = new Date(d);
  if (isNaN(date.getTime())) return d;
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const genderBadge = {
  Male: "bg-primary-subtle text-primary-emphasis",
  Female: "bg-danger-subtle text-danger-emphasis",
  Other: "bg-secondary-subtle text-secondary-emphasis",
};

export default function StudentTable({
  students = [],
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  previousPage,
  nextPage,
  selectedStudents = [],
  setSelectedStudents = () => {},
  onBulkDelete,
  onBulkUpdate,
  bulkEditIds = [],
  bulkEditValues = {},
  onBulkEditField = () => {},
  onBulkSave = () => {},
  onBulkCancel = () => {},
}) {
  const visibleIds = students.map((s) => s.studentID ?? s.StudentID ?? "");

  function isSelected(id) {
    return selectedStudents.some((item) => String(item) === String(id));
  }

  function toggleOne(id) {
    if (!id) return;
    const exists = isSelected(id);
    if (exists) setSelectedStudents(selectedStudents.filter((x) => String(x) !== String(id)));
    else setSelectedStudents([...selectedStudents, id]);
  }

  function toggleAll() {
    const allSelected = visibleIds.every((id) => id !== "" && isSelected(id));
    if (allSelected) {
      setSelectedStudents(selectedStudents.filter((x) => !visibleIds.some((id) => String(id) === String(x))));
    } else {
      const next = Array.from(new Set([...selectedStudents, ...visibleIds.filter(Boolean)]));
      setSelectedStudents(next);
    }
  }

  const anySelected = selectedStudents && selectedStudents.length > 0;
  const isBulkEditing = bulkEditIds && bulkEditIds.length > 0;
  return (
    <div className="table-responsive">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <div className="d-flex flex-wrap gap-2">
          <button
            className="btn btn-outline-primary btn-sm"
            disabled={!anySelected}
            onClick={() => (isBulkEditing ? onBulkSave?.() : onBulkUpdate?.(selectedStudents))}
          >
            {isBulkEditing ? "Save Changes" : "Bulk Edit"}
          </button>
          {isBulkEditing && (
            <button className="btn btn-outline-secondary btn-sm" onClick={() => onBulkCancel?.()}>
              Cancel
            </button>
          )}
          <button
            className="btn btn-outline-danger btn-sm"
            disabled={!anySelected}
            onClick={() => onBulkDelete && onBulkDelete(selectedStudents)}
          >
            Bulk Delete
          </button>
        </div>
        <div className="text-muted small">{students.length} shown</div>
      </div>

      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th style={{ width: 42 }}>
              <input
                type="checkbox"
                aria-label="select all"
                checked={visibleIds.length > 0 && visibleIds.every((id) => id && isSelected(id))}
                onChange={toggleAll}
              />
            </th>
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
          {students.map((s) => {
            const id = s.studentID ?? s.StudentID ?? "";
            const firstName = s.firstName ?? s.FirstName ?? "";
            const lastName = s.lastName ?? s.LastName ?? "";
            const gender = s.gender ?? s.Gender ?? "";
            const email = s.email ?? s.Email ?? "";
            const phone = s.phone ?? s.Phone ?? "";
            const city = s.city ?? s.City ?? "";
            const state = s.state ?? s.State ?? "";
            const course = s.course ?? s.Course ?? "";
            const initials = `${firstName.charAt(0)}${lastName.charAt(
              0
            )}`.toUpperCase();
            const isEditingRow = bulkEditIds.some((bulkId) => String(bulkId) === String(id));
            const rowValues = bulkEditValues[String(id)] || {};

            return (
              <tr key={id}>
                <td>
                  <input
                    type="checkbox"
                    aria-label={`select-${id}`}
                    checked={isSelected(id)}
                    onChange={() => toggleOne(id)}
                  />
                </td>

                <td className="text-muted">#{id}</td>

                <td style={{ minWidth: 180 }}>
                  {isEditingRow ? (
                    <div className="d-flex flex-column gap-2">
                      <input
                        className="form-control form-control-sm"
                        value={rowValues.FirstName ?? ""}
                        onChange={(e) => onBulkEditField?.(id, "FirstName", e.target.value)}
                        placeholder="First name"
                      />
                      <input
                        className="form-control form-control-sm"
                        value={rowValues.LastName ?? ""}
                        onChange={(e) => onBulkEditField?.(id, "LastName", e.target.value)}
                        placeholder="Last name"
                      />
                    </div>
                  ) : (
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="d-flex align-items-center justify-content-center rounded-circle bg-primary text-white fw-semibold flex-shrink-0"
                        style={{
                          width: 32,
                          height: 32,
                          fontSize: "0.75rem",
                        }}
                      >
                        {initials || "?"}
                      </div>

                      <span className="fw-medium">
                        {firstName} {lastName}
                      </span>
                    </div>
                  )}
                </td>

                <td style={{ minWidth: 120 }}>
                  {isEditingRow ? (
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      value={rowValues.Dateofbirth ?? ""}
                      onChange={(e) => onBulkEditField?.(id, "Dateofbirth", e.target.value)}
                    />
                  ) : (
                    formatDate(s.dateofbirth ?? s.Dateofbirth)
                  )}
                </td>

                <td style={{ minWidth: 110 }}>
                  {isEditingRow ? (
                    <select
                      className="form-select form-select-sm"
                      value={rowValues.Gender ?? ""}
                      onChange={(e) => onBulkEditField?.(id, "Gender", e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : gender ? (
                    <span
                      className={`badge rounded-pill ${
                        genderBadge[gender] || "bg-light text-dark"
                      }`}
                    >
                      {gender}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>

                <td style={{ minWidth: 90 }}>
                  {isEditingRow ? (
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      value={rowValues.Age ?? ""}
                      onChange={(e) => onBulkEditField?.(id, "Age", e.target.value)}
                    />
                  ) : (
                    s.age ?? s.Age ?? "—"
                  )}
                </td>

                <td style={{ minWidth: 220 }}>
                  {isEditingRow ? (
                    <div className="d-flex flex-column gap-2">
                      <input
                        className="form-control form-control-sm"
                        value={rowValues.Email ?? ""}
                        onChange={(e) => onBulkEditField?.(id, "Email", e.target.value)}
                        placeholder="Email"
                      />
                      <input
                        className="form-control form-control-sm"
                        value={rowValues.Phone ?? ""}
                        onChange={(e) => onBulkEditField?.(id, "Phone", e.target.value)}
                        placeholder="Phone"
                      />
                    </div>
                  ) : (
                    <div className="small">
                      {email && (
                        <div>
                          <i className="bi bi-envelope me-1 text-muted"></i>
                          {email}
                        </div>
                      )}
                      {phone && (
                        <div className="text-muted">
                          <i className="bi bi-telephone me-1"></i>
                          {phone}
                        </div>
                      )}
                    </div>
                  )}
                </td>

                <td style={{ minWidth: 180 }}>
                  {isEditingRow ? (
                    <div className="d-flex flex-column gap-2">
                      <input
                        className="form-control form-control-sm"
                        value={rowValues.City ?? ""}
                        onChange={(e) => onBulkEditField?.(id, "City", e.target.value)}
                        placeholder="City"
                      />
                      <input
                        className="form-control form-control-sm"
                        value={rowValues.State ?? ""}
                        onChange={(e) => onBulkEditField?.(id, "State", e.target.value)}
                        placeholder="State"
                      />
                    </div>
                  ) : (
                    <div className="small">
                      {city || "—"}
                      {state ? `, ${state}` : ""}
                    </div>
                  )}
                </td>

                <td style={{ minWidth: 120 }}>
                  {isEditingRow ? (
                    <select
                      className="form-select form-select-sm"
                      value={rowValues.Course ?? ""}
                      onChange={(e) => onBulkEditField?.(id, "Course", e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="BCA">BCA</option>
                      <option value="MCA">MCA</option>
                      <option value="IIT">IIT</option>
                    </select>
                  ) : course ? (
                    <span className="badge bg-info-subtle text-info-emphasis">
                      {course}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>

                <td style={{ minWidth: 120 }}>
                  {isEditingRow ? (
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      value={rowValues.AdmiDate ?? ""}
                      onChange={(e) => onBulkEditField?.(id, "AdmiDate", e.target.value)}
                    />
                  ) : (
                    formatDate(s.admiDate ?? s.AdmiDate)
                  )}
                </td>

                <td className="text-end" style={{ minWidth: 110 }}>
                  {isEditingRow ? (
                    <span className="text-muted small">Editing</span>
                  ) : (
                    <div className="btn-group btn-group-sm">
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => onEdit(s)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-outline-danger"
                        onClick={() => onDelete(id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination */}
      <nav aria-label="Page navigation" className="mt-4">
        <ul className="pagination justify-content-center">
          <li
            className={`page-item ${
              currentPage === 1 ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={previousPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
          </li>

          <li className="page-item disabled">
            <span className="page-link">
              Page {currentPage} of {totalPages}
            </span>
          </li>

          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}