import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiPost, setToken } from "../utils/api";
import "./Auth.css";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", aadhaar: "", mobile: "", password: "" });
  const [error, setError] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Basic front-end validation
      if (!/^[2-9]\d{11}$/.test(form.aadhaar)) throw new Error("Enter a valid 12-digit Aadhaar number");
      if (!/^\S+@\S+\.\S+$/.test(form.email)) throw new Error("Enter a valid email address");
      if (!/^\d{10}$/.test(form.mobile)) throw new Error("Enter a valid 10-digit mobile number");
      if (form.password.length < 6) throw new Error("Password must be at least 6 characters");

      const data = await apiPost("/api/auth/signup", form);
      setToken(data.token);
      navigate("/home");
    } catch (err) {
      setError(err.message || "Signup failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Join our community and fuel impactful causes.</p>

        {error && <div className="error">{error}</div>}

        <form className="auth-form" onSubmit={onSubmit}>
          <div className="row">
            <input className="input" name="name" placeholder="Full Name" value={form.name} onChange={onChange} required />
            <input className="input" name="email" placeholder="Email" value={form.email} onChange={onChange} required />
          </div>

          <div className="row">
            <input className="input" name="aadhaar" placeholder="Aadhaar Number (12 digits)" value={form.aadhaar} onChange={onChange} required />
            <input className="input" name="mobile" placeholder="Mobile Number (10 digits)" value={form.mobile} onChange={onChange} required />
          </div>

          <input className="input" name="password" type="password" placeholder="Password (min 6 chars)" value={form.password} onChange={onChange} required />

          <button className="btn btn-primary" type="submit">Sign Up</button>
        </form>

        <div className="meta">
          <span>Already have an account?</span>
          <Link to="/" className="btn btn-ghost">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
