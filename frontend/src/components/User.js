import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const User = ({ handleLogout }) => {
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
    <div className="profile-container">
      {profile ? (
        <div className="profile-info">
          <h1>User</h1>
          <p>Email: {profile.email}</p>
          <p>Bio: {profile.bio}</p>
          {profile.profilePicture && (
            <img
              src={profile.profilePicture}
              alt="Profile"
              style={{ width: "100px", height: "100px", borderRadius: "50%" }}
            />
          )}
        </div>
      ) : (
        <p>No profile data found.</p>
      )}
      <button className="button logout-btn" onClick={handleLogout}>
        Logout
      </button>
      <Link to="/edit-profile" className="button save-btn">
        Edit Profile
      </Link>
    </div>
  );
};

export default User;