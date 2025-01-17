 import React from "react";

const Welcome = ({ role, handleLogout }) => {
  return (
    <div>
      <h1>Welcome!</h1>
      <p>You are logged in as a {role}.</p>
      <button className="button logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Welcome;