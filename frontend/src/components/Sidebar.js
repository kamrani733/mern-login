import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ role }) => {
  return (
    <div className="bg-primary-blue text-primary-yellow w-64 min-h-screen mt-5 p-4">
      <div className="text-xl font-bold mb-6">Menu</div>
      <ul className="space-y-2">
        <li>
          <Link
            to={role === "admin" ? "/admin" : "/User"}
            className="block py-2 px-4 hover:  rounded transition duration-300"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/edit-profile"
            className="block py-2 px-4 hover:  rounded transition duration-300"
          >
            Edit Profile
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;