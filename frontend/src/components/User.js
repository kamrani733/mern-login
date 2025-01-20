import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    email: "",
    bio: "",
    profilePicture: null,
  });

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
          setForm({
            email: data.email || "",
            bio: data.bio || "",
            profilePicture: null,
          });
        }
      } catch (err) {
        setProfile(null);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, profilePicture: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    const formData = new FormData();
    formData.append("email", form.email);
    formData.append("bio", form.bio);
    if (form.profilePicture) {
      formData.append("profilePicture", form.profilePicture);
    }
  
     for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
  
    try {
      const { data } = await axios.put("http://localhost:5000/api/auth/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      setProfile(data.user);
      setIsEditing(false);
      alert("Profile updated successfully");
    } catch (err) {
      console.error("Error updating profile:", err.response ? err.response.data : err.message);
      setError("Error updating profile: " + (err.response ? err.response.data.message : err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      {profile ? (
        <div className="profile-info">
          <h1>Profile</h1>
          <p>Email: {profile.email}</p>
          <p>Bio: {profile.bio}</p>
          <img
            src={profile.profilePicture || "https://via.placeholder.com/150"}
            alt="Profile"
          />
          {!isEditing && (
            <button onClick={handleEditClick}>Edit Profile</button>
          )}
        </div>
      ) : null}

      {isEditing && (
        <form className="form-container" onSubmit={handleSubmit}>
          <h1>Edit Your Profile</h1>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Bio:</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleInputChange}
            ></textarea>
          </div>
          <div>
            <label>Profile Picture:</label>
            <input
              type="file"
              name="profilePicture"
              onChange={handleFileChange}
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
      )}
    </div>
  );
};

export default Profile;
