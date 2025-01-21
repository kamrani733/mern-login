import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import User from "./components/User";
import AdminPage from "./components/AdminPage";
import EditProfile from "./components/EditProfile";
import { Cloudinary } from "@cloudinary/url-gen";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { AdvancedImage } from "@cloudinary/react";

const cld = new Cloudinary({ cloud: { cloudName: "dob3u0cre" } });

const img = cld
  .image("cld-sample-5")
  .format("auto")
  .quality("auto")
  .resize(auto().gravity(autoGravity()).width(500).height(500));

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
            element={<EditProfile handleLogout={handleLogout} />}
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
