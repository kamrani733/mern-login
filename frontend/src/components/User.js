import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    email: "",
    bio: "",
    profilePicture: null,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get("/api/user/profile", {
          withCredentials: true,
        });
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

    try {
      const { data } = await axios.put("/api/user/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      setProfile(data.user);
      alert("Profile updated successfully");
    } catch (err) {
      setError("Error updating profile");
    } finally {
      setLoading(false);
    }
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
        </div>
      ) : (
        <form className="form-container" onSubmit={handleSubmit}>
          <h1>Complete Your Profile</h1>
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
          {error && <p className="error-message">{error}</p>}
        </form>
      )}
    </div>
  );
};

export default Profile;
