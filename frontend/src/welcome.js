import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  useEffect(() => {
     const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/protected", {
          method: "GET",
          credentials: "include",  
        });

        if (!response.ok) {
           navigate("/login");
        }
      } catch (err) {
        console.error("Error checking authentication:", err);
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
       const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "GET",
        credentials: "include", 
      });

      if (response.ok) {
         navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  return (
    <div className="welcome-container">
      <h1>Welcome to the Application!</h1>
      <p>You are now logged in.</p>
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
};

export default Welcome;