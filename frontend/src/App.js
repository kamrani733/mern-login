import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import "./App.css";

const Login = ({ setIsLoggedIn, setError, error, setRole }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [role, setRoleState] = useState("user");

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        alert("Login successful!");
        setIsLoggedIn(true);
        setError("");
        setRole(data.user.role);
        navigate("/welcome");
      } else {
        setError(
          data.message || "Login failed. Please check your credentials."
        );
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, role: role }),
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        alert("Registration successful! Please log in.");
        navigate("/");
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input-field"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input-field"
      />

      {error && <p className="error-message">{error}</p>}
      <div className="button-container">
        <button
          onClick={handleLogin}
          className="button login-btn"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <button
          onClick={handleRegister}
          className="button login-btn"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </div>
    </div>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Add these state variables here
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogout = () => {
    setIsLoggedIn(false);
    setRole("user");
  };

  const Welcome = () => (
    <div>
      <h1>Welcome!</h1>
      <p>You are logged in as a {role}.</p>
      <button className="button logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );

  const AdminPage = ({ username, setUsername, password, setPassword, role, setRole, handleLogout }) => {
    return (
      <div>
        <h1>Admin Dashboard</h1>
        <p>Welcome to the Admin page.</p>
        {/* <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input-field"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="input-field"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select> */}
        <button className="button logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    );
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
            isLoggedIn && role === "user" ? <Welcome /> : <Navigate to="/" />
          }
        />
        <Route
          path="/admin"
          element={
            isLoggedIn && role === "admin" ? (
              <AdminPage
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
                role={role}
                setRole={setRole}
                handleLogout={handleLogout}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
};


export default App;