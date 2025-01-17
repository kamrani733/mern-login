import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Login from "./Login";
import Welcome from "./Welcome";
import AdminPage from "./AdminPage";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setRole("user");
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
    return <div>Loading...</div>;
  }

  return (
    <div className="app-container">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Navigate to={role === "admin" ? "/admin" : "/welcome"} />
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
            path="/welcome"
            element={
              isLoggedIn && role === "user" ? (
                <Welcome role={role} handleLogout={handleLogout} />
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
        </Routes>
      </Router>
    </div>
  );
};

export default App;