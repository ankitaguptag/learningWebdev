
import React, { useEffect, useState } from "react";
import { getUsers } from "../api";

export default function UserList() {
  const [users, setUsers] = useState("");
  const [error, setError] = useState("");

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

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>User List</h2>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-body">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => {
                  const email = user.email ?? user.Email ?? "";

                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>

                      <td>
                        <i className="bi bi-envelope me-1 text-muted"></i>
                        {email}
                      </td>

                      <td>
                        <button className="btn btn-sm btn-primary me-2">
                          Edit
                        </button>

                        <button className="btn btn-sm btn-danger">
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="3" className="text-center text-muted">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}