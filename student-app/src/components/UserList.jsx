
import React, { Component } from "react";

export class UserList extends Component {
  render() {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>User List</h2>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Email</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>ankita@gmail.com</td>
                  <td>
                  </td>
                </tr>

                <tr>
                  <td>user@gmail.com</td>
                  <td>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default UserList;

