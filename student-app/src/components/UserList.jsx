
import React, { useEffect, useState } from "react";
import { getUsers, deleteUser, updateUser } from "../api";

export default function UserList() {
  const [user, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editUserName, setEditUserName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 5;

  // Calculate total pages
  const totalPages = Math.max(
    1,
    Math.ceil(user.length / pageSize)
  );

  // Calculate which users to display
  const startIndex = (currentPage - 1) * pageSize;

  const paginatedUser = user.slice(
    startIndex,
    startIndex + pageSize
  );

  // Load all users
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      console.log("Users:", data);

      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load users");
    }
  };

  // Keep the current page valid after deleting a user
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Previous page
  const previousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  // Next page
  const nextPage = () => {
    setCurrentPage((prev) =>
      Math.min(totalPages, prev + 1)
    );
  };

  // Edit user
  const handleEdit = (id, userName) => {
    setEditingId(id);
    setEditUserName(userName);
    setError("");
    setSuccess("");
  };

  // Save updated username
  const handleSave = async (id) => {
    if (!editUserName.trim()) {
      setError("User Name is required");
      return;
    }

    try {
      await updateUser(id, editUserName.trim());

      setUsers((prevUsers) =>
        prevUsers.map((item) => {
          const userId = item.id ?? item.Id;

          if (userId === id) {
            return {
              ...item,
              userName: editUserName.trim(),
              UserName: editUserName.trim(),
            };
          }

          return item;
        })
      );

      setEditingId(null);
      setEditUserName("");
      setError("");
      setSuccess("Save successful");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update user");
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingId(null);
    setEditUserName("");
    setError("");
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      await deleteUser(id);

      setUsers((prevUsers) =>
        prevUsers.filter((item) => (item.id ?? item.Id) !== id)
      );

      setSuccess("User deleted successfully");
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete user");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">User List</h2>

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {success && (
        <div className="alert alert-success">{success}</div>
      )}

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>User Name</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {paginatedUser.length > 0 ? (
                  paginatedUser.map((item, index) => {
                    const id = item.id ?? item.Id;
                    const email = item.email ?? item.Email ?? "";
                    const userName =
                      item.userName ?? item.UserName ?? "";

                    return (
                      <tr key={id}>
                        <td>{startIndex + index + 1}</td>

                        <td>
                          {editingId === id ? (
                            <input
                              type="text"
                              className="form-control"
                              value={editUserName}
                              onChange={(e) =>
                                setEditUserName(e.target.value)
                              }
                            />
                          ) : (
                            <>
                              <i className="bi bi-person me-1 text-muted"></i>
                              {userName}
                            </>
                          )}
                        </td>

                        <td>
                          <i className="bi bi-envelope me-1 text-muted"></i>
                          {email}
                        </td>

                        <td>
                          {editingId === id ? (
                            <>
                              <button
                                className="btn btn-sm btn-success me-2"
                                onClick={() => handleSave(id)}
                              >
                                Save
                              </button>

                              <button
                                className="btn btn-sm btn-secondary"
                                onClick={handleCancel}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="btn btn-sm btn-primary me-2"
                                onClick={() =>
                                  handleEdit(id, userName)
                                }
                              >
                                Edit
                              </button>

                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(id)}
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center text-muted"
                    >
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <nav aria-label="Page navigation" className="mt-4">
            <ul className="pagination justify-content-center">
              <li
                className={`page-item ${
                  currentPage === 1 ? "disabled" : ""
                }`}
              >
                <button
                  type="button"
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
                  currentPage >= totalPages ? "disabled" : ""
                }`}
              >
                <button
                  type="button"
                  className="page-link"
                  onClick={nextPage}
                  disabled={currentPage >= totalPages}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
