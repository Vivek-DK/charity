import React, { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import "./Navbar.css";
import { getToken, apiPost } from "../utils/api";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Fetch user info when token exists
  useEffect(() => {
    const token = getToken();
    if (token) {
      fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setUser(data.user))
        .catch((err) => console.error("Failed to load user:", err));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setOpen(false);
    window.location.href = "/"; // redirect to login
  };

  return (
    <nav className="navbar">
      <div className="navbar-center">
        <span className="nav-link" onClick={() => setOpen((prev) => !prev)}>
          <FaUser className="nav-icon" />
        </span>

        {/* Animated Dropdown */}
        <AnimatePresence>
          {open && user && (
            <motion.div
              className="user-dropdown"
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <p className="user-name">{user.name}</p>
              <p className="user-email">{user.email}</p>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
