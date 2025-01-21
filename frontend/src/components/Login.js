import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsLoggedIn, setError, error, setRole }) => {
  const [email, setEmail] = useState("");
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
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading2(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role: role }),
        credentials: "include",
      });

      const data = await response.json();
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
    <div className="min-h-screen flex items-center justify-center ">
      <div className="  p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold text-primary-yellow text-center mb-6">
          Login
        </h1>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-primary-yellow"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-primary-yellow"
        />
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="flex flex-col space-y-4">
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-primary-yellow hover:bg-secondary-yellow text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:bg-gray-400"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <button
            onClick={handleRegister}
            disabled={loading2}
            className="w-full bg-primary-yellow hover:bg-secondary-yellow text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:bg-gray-400"
          >
            {loading2 ? "Registering..." : "Register"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;