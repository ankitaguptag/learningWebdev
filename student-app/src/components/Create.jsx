import React, { useState } from "react";

export default function Create() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-4">
          <div className="card shadow p-4">

            <h2 className="text-center mb-4">Create User</h2>

            <form>

              <div className="mb-3">
                <label htmlFor="inputEmail" className="form-label">
                  Email:
                </label>

                <input
                  id="inputEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  placeholder="Enter email"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="inputPassword" className="form-label">
                  Password:
                </label>

                <input
                  id="inputPassword"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  placeholder="Enter password"
                  required
                />
              </div>

              <div className="d-grid">
                <div className="d-flex justify-content-center">
                  <button
                    type="submit"
                    className="btn btn-primary px-4"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </div>
              </div>

            </form>

          </div>
        </div>
      </div>
    </div>
  );
}