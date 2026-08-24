import React from "react";

export default function Login() {
  const handleSubmit = (e) => {
    alter("Login Successfully!");
  };
  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-4">
          <div className="card shadow p-4">
            <h2 className="text-center mb-4">Login</h2>
            <div className="mb-3">
              <label htmlFor="inputEmail" className="form-label">
                Email:
              </label>

              <input
                type="email"
                id="inputEmail"
                className="form-control"
                placeholder=""
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password:</label>
              <input
                 type="password"
                id="inputPassword"
                className="form-control"
                placeholder=""
              />
            </div>
            <div className="d-grid">
              <div className="col d-flex justify-content-center gap-2">
                <button  type="submit" className="btn btn-primary px-4" onClick={handleSubmit}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
