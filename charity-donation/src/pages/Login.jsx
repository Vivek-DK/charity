import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiPost, setToken } from "../utils/api";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ aadhaar: "", email: "", password: "" });
  const [error, setError] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (!/^[2-9]\d{11}$/.test(form.aadhaar)) throw new Error("Enter a valid 12-digit Aadhaar number");
      if (!/^\S+@\S+\.\S+$/.test(form.email)) throw new Error("Enter a valid email address");
      if (!form.password) throw new Error("Password is required");

      const data = await apiPost("/api/auth/login", form);
      setToken(data.token);
      navigate("/home");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Log in to continue your support for those who need it most.</p>

        {error && <div className="error">{error}</div>}

        <form className="auth-form" onSubmit={onSubmit}>
          <input className="input" name="aadhaar" placeholder="Aadhaar Number (12 digits)" value={form.aadhaar} onChange={onChange} required />
          <input className="input" name="email" placeholder="Email" value={form.email} onChange={onChange} required />
          <input className="input" name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} required />

          <button className="btn btn-primary" type="submit">Log In</button>
        </form>

        <div className="meta">
          <span>New here?</span>
          <Link to="/signup" className="btn btn-ghost">Create account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
