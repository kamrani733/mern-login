import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Users = ({ role, handleLogout }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== "admin") {
      navigate("/");
      return;
    }

    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/auth/users",
          {
            withCredentials: true,
          }
        );
        setUsers(data.users);
      } catch (err) {
        setError("Failed to fetch users");
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [role, navigate]);

  const toggleRole = async (userId, currentRole) => {
    try {
      const newRole = currentRole === "admin" ? "user" : "admin";

      const { data } = await axios.put(
        `http://localhost:5000/api/auth/users/${userId}/role`,
        { role: newRole },
        { withCredentials: true }
      );

      // Update the user's role in the local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );

      alert(`Role updated to ${newRole}`);
    } catch (err) {
      console.error("Error updating role:", err);
      setError("Failed to update role");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-yellow"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="p-8 rounded-lg shadow-lg ">
        <h1 className="text-3xl font-bold text-primary-yellow mb-6">
          All Users
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-primary-blue p-4 rounded-lg shadow-md text-primary-yellow"
            >
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                      <span className="text-sm">N/A</span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{user.email}</p>
                    <p className="text-sm text-secondary-yellow">{user.role}</p>
                  </div>
                </div>
                <p className="text-sm">{user.bio || "No bio available."}</p>
                <button
                  onClick={() => toggleRole(user._id, user.role)}
                  className="bg-primary-yellow hover:bg-secondary-yellow text-white font-bold py-1 px-2 rounded text-sm transition duration-300"
                >
                  Toggle Role
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Users;