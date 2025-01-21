import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditProfile = ({ handleLogout }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    email: "",
    bio: "",
    profilePicture: null,
  });

  const navigate = useNavigate();

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
        setError("Failed to fetch profile data");
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setForm((prev) => ({ ...prev, profilePicture: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("bio", form.bio);
    if (form.profilePicture) {
      formData.append("profilePicture", form.profilePicture);
    }

    try {
      const { data } = await axios.put(
        "http://localhost:5000/api/auth/profile",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      setProfile(data.user);
      alert("Profile updated successfully");
      navigate("/User");  
    } catch (err) {
      console.error(
        "Error updating profile:",
        err.response ? err.response.data : err.message
      );
      setError(
        "Error updating profile: " +
          (err.response ? err.response.data.message : err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <form className="form-container" onSubmit={handleSubmit}>
        <h1>Edit Your Profile</h1>
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
        <div className="buttons">
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
          <button type="button" onClick={() => navigate("/profile")}>
            Cancel
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default EditProfile;