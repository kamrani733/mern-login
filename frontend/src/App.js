import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import "./App.css";

const api = axios.create({
  baseURL: "http://localhost:5000/api/auth",
  withCredentials: true,
});

const Login = ({ setIsLoggedIn, setError, error }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/login", { username, password });
      alert("Login successful!");
      setIsLoggedIn(true);
      setError("");
      navigate("/welcome");
    } catch (err) {
      setError("Login failed. Please check your credentials.");
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
      const res = await api.post("/register", { username, password });
      alert("Registration successful! Please log in.");
      navigate("/");
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
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
    </div>
  );
};

const Welcome = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.get("/logout");
      setIsLoggedIn(false);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div >
      <h1>Welcome!</h1>
      <p>You are now logged in.</p>
      <button onClick={handleLogout} className="  logout-btn">
        Logout
      </button>
    </div>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/protected");
        if (res.data.user) {
          setIsLoggedIn(true);
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
              <Navigate to="/welcome" />
            ) : (
              <Login
                setIsLoggedIn={setIsLoggedIn}
                setError={setError}
                error={error}
              />
            )
          }
        />
        <Route
          path="/welcome"
          element={
            isLoggedIn ? (
              <Welcome setIsLoggedIn={setIsLoggedIn} />
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
