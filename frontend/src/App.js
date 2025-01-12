import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });
      alert(`Login successful!`);
      setIsLoggedIn(true);
    } catch (err) {
      alert("Login failed");
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
    } catch (err) {
      alert("Registration failed");
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
        </>
      </div>
    </div>
  );
};

export default App;
