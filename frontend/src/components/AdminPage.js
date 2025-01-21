import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const AdminPage = ({ handleLogout }) => {
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
    <div className="min-h-screen bg- -blue">
      <div className="container mx-auto p-6">
        <div className="max-w-3xl mx-auto  p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-primary-yellow text-left mb-6">
            Role: Admin
          </h1>
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
              <div className="flex space-x-4">
                <Link
                  to="/edit-profile"
                  className="bg-primary-yellow hover:bg-secondary-yellow text-white font-bold py-2 px-4 rounded transition duration-300"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-center text-secondary-yellow">
              No profile data found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;