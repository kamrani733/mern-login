import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import User from "./components/User";
import AdminPage from "./components/AdminPage";
import EditProfile from "./components/EditProfile";
import Users from "./components/Users"; // Import the Users component
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import "./App.css";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setIsLoggedIn(false);
        setRole("user");
        alert("Logged out successfully!");
      } else {
        console.error("Logout failed:", response.statusText);
      }
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/protected", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();
        if (res.ok && data.user) {
          setIsLoggedIn(true);
          setRole(data.user.role);
        }
      } catch (err) {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen   ">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-yellow"></div>
      </div>
    );
  }

  return (
    <Router>
      {isLoggedIn && <Navbar role={role} handleLogout={handleLogout} />}
      <div className="flex    min-h-screen">
        {isLoggedIn && <Sidebar role={role} />}
        <div className="flex-1 p-6 ">
          <Routes>
            <Route
              path="/"
              element={
                isLoggedIn ? (
                  <Navigate to={role === "admin" ? "/admin" : "/User"} />
                ) : (
                  <Login
                    setIsLoggedIn={setIsLoggedIn}
                    setError={setError}
                    error={error}
                    setRole={setRole}
                  />
                )
              }
            />
            <Route
              path="/User"
              element={
                isLoggedIn && role === "user" ? (
                  <User role={role} handleLogout={handleLogout} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/admin"
              element={
                isLoggedIn && role === "admin" ? (
                  <AdminPage handleLogout={handleLogout} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/edit-profile"
              element={
                isLoggedIn ? (
                  <EditProfile handleLogout={handleLogout} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/users"
              element={
                isLoggedIn && role === "admin" ? (
                  <Users role={role} handleLogout={handleLogout} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;