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
    <div className="min-h-screen ">
      <div className="container mx-auto  bg-white p-6 rounded-lg shadow-md">
        <div className="  bg-white p-8 rounded-lg  ">
          <h1 className="text-3xl font-bold text-left  mb-6">Role : Admin </h1>
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
              <div className="flex space-x-4">
                <Link
                  to="/edit-profile"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-600">No profile data found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
