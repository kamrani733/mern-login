// components/User.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const User = ({ role, handleLogout }) => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/auth/profile",
          {
            withCredentials: true,
          }
        );
        if (data) {
          setProfile(data);
        }
      } catch (err) {
        setError("Failed to fetch profile data");
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4"> Role : User</h1>
      {profile ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            {profile.profilePicture && (
              <img
                src={profile.profilePicture}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            )}
            <div>
              <p className="text-lg font-semibold">{profile.email}</p>
              <p className="text-gray-600">{profile.bio}</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-600">No profile data found.</p>
      )}
    </div>
  );
};

export default User;
