import React from "react";
import { useEffect, useState } from "react";
import { fetchLogin } from "../api";
import { Routes, Route } from "react-router-dom";


//import Login from "./Login";

export default function Login() {
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassward] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");

  try {
    const data = await fetchLogin({
      email: email,
      password: password,
    });

    console.log("Login API Response:", data);

    alert(data.message || "Login successful!");
  } catch (error) {
    console.error("Login Error:", error);
    setError(error.message);
  }
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                placeholder=""
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password:</label>
              <input
                 type="password"
                 value={password}
                 onChange={(e) => setPassward(e.target.value)}
                className="form-control"
                placeholder=""
              />
              {error && (
    <div className="alert alert-danger mt-2">
      {error}
    </div>
  )}
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
