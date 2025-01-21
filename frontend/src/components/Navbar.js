import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ role, handleLogout }) => {
  return (
    <nav className="bg-primary-blue text-primary-yellow p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">Dashboard</div>
        <div className="flex items-center space-x-4">
          <span className="text-sm">Welcome, {role}</span>
          <button
            onClick={handleLogout}
            className="bg-secondary-yellow hover:bg-primary-yellow text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;