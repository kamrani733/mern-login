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
    <div className=" max-w-3xl mx-auto  p-8 rounded-lg shadow-md mt-5 ">
      <h1 className="text-2xl font-bold text-primary-yellow mb-4">Role: User</h1>
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
              <p className="text-lg font-semibold text-primary-yellow">
                {profile.email}
              </p>
              <p className="text-secondary-yellow">{profile.bio}</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-secondary-yellow">
          No profile data found.
        </p>
      )}
    </div>
  );
};

export default User;