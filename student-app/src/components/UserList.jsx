
import React, { useEffect, useState } from "react";
import { getUsers, deleteUser, updateUser } from "../api";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editUserName, setEditUserName] = useState("");
 const [currentPage, setCurrentPage] = useState(1);
const pageSize = 10;

const totalPages = Math.max(1, Math.ceil(users.length / pageSize));

const startIndex = (currentPage - 1) * pageSize;

const paginatedUsers = users.slice(
  startIndex,
  startIndex + pageSize
);

const nextPage = () => {
  if (currentPage < totalPages) {
    setCurrentPage((prev) => prev + 1);
  }
};

const previousPage = () => {
  if (currentPage > 1) {
    setCurrentPage((prev) => prev - 1);
  }
};
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
    
      const data = await getUsers();
      console.log("Users:", data);
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };
  const handleEdit = (id, userName) => {
    setEditingId(id);
    setEditUserName(userName);
  };
  const handleSave = async (id) => {
    if (!editUserName.trim()) {
      setError("User Name is required");
      return;
    }
    try {
      await updateUser(id, editUserName);

      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          const userId = user.id ?? user.Id;

          if (userId === id) {
            return {
              ...user,
              userName: editUserName,
              UserName: editUserName
            };
          }

          return user;
        })
      );

      setEditingId(null);
      setEditUserName("");
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
    setSuccess("Save successful");
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditUserName("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      await deleteUser(id);

      setUsers((prevUsers) =>
        prevUsers.filter((user) => (user.id ?? user.Id) !== id)
      );
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="container mt-4">

      <h2 className="mb-3">User List</h2>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}
      {success && (
  <div className="alert alert-success">
    {success}
  </div>
)}

      <div className="card shadow-sm">
        <div className="card-body">

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

              {users.length > 0 ? (

                users.map((user, index) => {

                  const id = user.id ?? user.Id;
                  const email = user.email ?? user.Email ?? "";
                  const userName =
                    user.userName ?? user.UserName ?? "";

                  return (
                    <tr key={id}>

                      <td>{index + 1}</td>

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
                  <td colSpan="4" className="text-center text-muted">
                    No users found
                  </td>
                </tr>

              )}

            </tbody>

          </table>
          <nav aria-label="Page navigation" className="mt-4">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
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
      </div>
    </div>
  );
}
