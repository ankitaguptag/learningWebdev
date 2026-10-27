import React, { useCallback, useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { getUsers, deleteUser, updateUser } from "../api"; // Make sure fetchLogin is replaced/handled if needed

export default function UserList() {
  const [user, setUsers] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editUserName, setEditUserName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

  // Load users (using getUsers or updating to handle your API response correctly)
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // If getUsers() returns all records, we handle pagination on the frontend, 
      // OR if it accepts params, pass them. Assuming getUsers() returns all or an object:
      const data = await getUsers({
        searchText: "",
        currentPage,
        pageSize,
      });

      const rows = Array.isArray(data)
        ? data
        : data?.users ?? data?.data ?? data?.items ?? [];

      const firstRow = rows[0] ?? {};

      const count = Number(
        data?.totalRecords ??
        data?.TotalRecords ??
        data?.totalCount ??
        data?.TotalCount ??
        firstRow?.totalRecords ??
        firstRow?.TotalRecords ??
        rows.length 
        // Fallback to array length if total count is missing
      );

      // If your API returns all users at once without pagination, slice them for the current page:
      const startIndex = (currentPage - 1) * pageSize;
      const paginatedRows = Array.isArray(data) 
        ? rows.slice(startIndex, startIndex + pageSize) 
        : rows;

      setUsers(paginatedRows);
      setTotalRecords(count);

      const lastPage = Math.max(1, Math.ceil(count / pageSize));
      if (currentPage > lastPage) {
        setCurrentPage(lastPage);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Export all users to Excel
  const downloadUsersExcel = async () => {
    try {
      setError("");
      const allUsers = await getUsers();

      const userRows = Array.isArray(allUsers)
        ? allUsers
        : allUsers?.users ?? allUsers?.data ?? allUsers?.items ?? [];

      if (!Array.isArray(userRows) || userRows.length === 0) {
        setError("No user data available to export");
        return;
      }

      const excelData = userRows.map((item, index) => ({
        "S.No.": index + 1,
        "User ID": item.id ?? item.Id,
        "User Name": item.userName ?? item.UserName ?? "",
        Email: item.email ?? item.Email ?? "",
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, "All Users");

      worksheet["!cols"] = [
        { wch: 10 },
        { wch: 12 },
        { wch: 25 },
        { wch: 35 },
      ];

      const now = new Date();
      const timestamp =
        `${now.getFullYear()}_` +
        `${String(now.getMonth() + 1).padStart(2, "0")}_` +
        `${String(now.getDate()).padStart(2, "0")}_` +
        `${String(now.getHours()).padStart(2, "0")}_` +
        `${String(now.getMinutes()).padStart(2, "0")}`;

      XLSX.writeFile(workbook, `All_Users_${timestamp}.xlsx`);
      setSuccess("Excel file downloaded successfully");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to download Excel file");
    }
  };

  const previousPage = () => {
    if (currentPage > 1 && !loading) {
      setCurrentPage((page) => page - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages && !loading) {
      setCurrentPage((page) => page + 1);
    }
  };

  const handleEdit = (id, userName) => {
    setEditingId(id);
    setEditUserName(userName);
    setError("");
    setSuccess("");
  };

  const handleSave = async (id) => {
    if (!editUserName.trim()) {
      setError("User Name is required");
      return;
    }

    try {
      await updateUser(id, editUserName.trim());
      setEditingId(null);
      setEditUserName("");
      setSuccess("Save successful");
      await loadUsers();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update user");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditUserName("");
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      await deleteUser(id);

      setSuccess("User deleted successfully");
      setError("");

      if (user.length === 1 && currentPage > 1) {
        setCurrentPage((page) => page - 1);
      } else {
        await loadUsers();
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete user");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h2 className="mb-0">User List</h2>
        <button
          type="button"
          className="btn btn-success"
          onClick={downloadUsersExcel}
        >
          <i className="bi bi-file-earmark-excel me-1"></i>
          Download Excel
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>User Name</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center">
                      Loading users...
                    </td>
                  </tr>
                ) : user.length > 0 ? (
                  user.map((item, index) => {
                    const id = item.id ?? item.Id;
                    const userName = item.userName ?? item.UserName ?? "";
                    const email = item.email ?? item.Email ?? "";

                    return (
                      <tr key={id}>
                        <td>{(currentPage - 1) * pageSize + index + 1}</td>
                        <td>
                          {String(editingId) === String(id) ? (
                            <input
                              type="text"
                              className="form-control"
                              value={editUserName}
                              onChange={(e) => setEditUserName(e.target.value)}
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
                          {String(editingId) === String(id) ? (
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
                                onClick={() => handleEdit(id, userName)}
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

          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-3">
            <span>Total Records: {totalRecords}</span>
            <nav aria-label="Page navigation">
              <ul className="pagination mb-0">
                <li className={`page-item ${currentPage <= 1 ? "disabled" : ""}`}>
                  <button
                    type="button"
                    className="page-link"
                    onClick={previousPage}
                    disabled={loading || currentPage <= 1}
                  >
                    Previous
                  </button>
                </li>
                <li className="page-item disabled">
                  <span className="page-link">
                    Page {currentPage} of {totalPages}
                  </span>
                </li>
                <li className={`page-item ${currentPage >= totalPages ? "disabled" : ""}`}>
                  <button
                    type="button"
                    className="page-link"
                    onClick={nextPage}
                    disabled={loading || currentPage >= totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}