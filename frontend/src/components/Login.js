import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsLoggedIn, setError, error, setRole }) => {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const navigate = useNavigate();
  const [role, setRoleState] = useState("user");

  const handleLogin = async () => {
    if (!email || !password) {
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
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        setIsLoggedIn(true);
        setError("");
        setRole(data.user.role);
        navigate("/User");
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
    console.log("Register button clicked");
    if (!email || !password  ) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading2(true);
    try {
      console.log("Sending registration request...");
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role: role }),
        credentials: "include",
      });

      console.log("Registration response:", response);
      const data = await response.json();
      console.log("Registration response data:", data);

      if (response.ok) {
        navigate("/");
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Error during registration:", err);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading2(false);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Login</h1>
      <input
        type="text"
        placeholder="email"
        value={email}
        onChange={(e) => setemail(e.target.value)}
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
          className="button register-btn"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <button
          onClick={handleRegister}
          className="button login-btn"
          disabled={loading2}
        >
          {loading2 ? "Registering..." : "Register"}
        </button>
      </div>
    </div>
  );
};

export default Login;
