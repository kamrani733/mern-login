import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState(""); // Add an error state

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });
      alert(`Login successful!`);
      setIsLoggedIn(true);
      setError(""); // Reset error if login is successful
    } catch (err) {
      setError("Login failed. Please check your credentials."); // Show error message
    }
  };

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        username,
        password,
      });
      alert("User registered");
      setIsRegistered(true);
      setError(""); // Reset error if registration is successful
    } catch (err) {
      setError("Registration failed. Please try again."); // Show error message
    }
  };

  return (
    <div className="app-container">
      <div className="form-container">
        <h1 className="form-title">Login</h1>

        <>
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
          <div className="button-container">
            <button onClick={handleLogin} className="button login-btn">
              Login
            </button>
            <button onClick={handleRegister} className="button register-btn">
              Register
            </button>
          </div>

          {error && <p className="error-message">{error}</p>} {/* Show error message */}

        </>
      </div>
    </div>
  );
};

export default App;
