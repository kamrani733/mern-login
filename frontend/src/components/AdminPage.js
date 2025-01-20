 import React from "react";

const AdminPage = ({ handleLogout }) => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome to the Admin page.</p>
      <button className="button logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default AdminPage;