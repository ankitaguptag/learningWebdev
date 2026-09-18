
import React, { useEffect, useState } from "react";
import { getUsers, deleteUser, updateUser } from "../api";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editUserName, setEditUserName] = useState("");

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

  // Click Edit
  const handleEdit = (id, userName) => {
    setEditingId(id);
    setEditUserName(userName);
  };

  // Click Save
  const handleSave = async (id) => {
    if (!editUserName.trim()) {
      setError("User Name is required");
      return;
    }

    try {
      await updateUser(id, editUserName);

      // Update UI
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
  };

  // Cancel Edit
  const handleCancel = () => {
    setEditingId(null);
    setEditUserName("");
  };

  // Delete
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

        </div>
      </div>
    </div>
  );
}
