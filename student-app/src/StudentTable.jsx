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
}) {
  const visibleIds = students.map((s) => s.studentID ?? s.StudentID ?? "");

  function toggleOne(id) {
    if (!id) return;
    const exists = selectedStudents.includes(id);
    if (exists) setSelectedStudents(selectedStudents.filter((x) => x !== id));
    else setSelectedStudents([...selectedStudents, id]);
  }

  function toggleAll() {
    const allSelected = visibleIds.every((id) => selectedStudents.includes(id) && id !== "");
    if (allSelected) {
      // remove visible ids
      setSelectedStudents(selectedStudents.filter((x) => !visibleIds.includes(x)));
    } else {
      // add visible ids (unique)
      const next = Array.from(new Set([...selectedStudents, ...visibleIds.filter(Boolean)]));
      setSelectedStudents(next);
    }
  }

  const anySelected = selectedStudents && selectedStudents.length > 0;
  return (
    <div className="table-responsive">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>
          <button
            className="btn btn-outline-primary btn-sm me-2"
            disabled={!anySelected}
            onClick={() => onBulkUpdate && onBulkUpdate(selectedStudents)}
          >
            Bulk Update
          </button>
          <button
            className="btn btn-danger btn-sm"
            disabled={!anySelected}
            onClick={() => onBulkDelete && onBulkDelete(selectedStudents)}
          >
            Delete Selected
          </button>
        </div>
        <div className="text-muted small">{students.length} shown</div>
      </div>

      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th style={{ width: 40 }}>
              <input
                type="checkbox"
                aria-label="select all"
                checked={visibleIds.length > 0 && visibleIds.every((id) => id && selectedStudents.includes(id))}
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

            return (
              <tr key={id}>
                <td>
                  <input
                    type="checkbox"
                    aria-label={`select-${id}`}
                    checked={selectedStudents.includes(id)}
                    onChange={() => toggleOne(id)}
                  />
                </td>

                <td className="text-muted">#{id}</td>

                <td>
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
                </td>

                <td>{formatDate(s.dateofbirth ?? s.Dateofbirth)}</td>

                <td>
                  {gender ? (
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

                <td>{s.age ?? s.Age ?? "—"}</td>

                <td>
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
                </td>

                <td>
                  <div className="small">
                    {city || "—"}
                    {state ? `, ${state}` : ""}
                  </div>
                </td>

                <td>
                  {course ? (
                    <span className="badge bg-info-subtle text-info-emphasis">
                      {course}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>

                <td>{formatDate(s.admiDate ?? s.AdmiDate)}</td>

                <td className="text-end">
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