// components/Sidebar.js
import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ role }) => {
  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="text-xl font-bold mb-6">Menu</div>
      <ul className="space-y-2">
        <li>
          <Link
            to={role === "admin" ? "/admin" : "/User"}
            className="block py-2 px-4 hover:bg-blue-600 rounded"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/edit-profile"
            className="block py-2 px-4 hover:bg-blue-600 rounded"
          >
            Edit Profile
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;