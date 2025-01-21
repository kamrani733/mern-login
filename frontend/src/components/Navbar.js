// components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ role, handleLogout }) => {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">Dashboard</div>
        <div className="flex items-center space-x-4">
          <span className="text-sm">Welcome, {role}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;