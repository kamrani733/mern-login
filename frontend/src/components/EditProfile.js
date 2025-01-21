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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-dark-blue">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-yellow"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  flex items-center justify-center p-6">
      <div className=" p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-primary-yellow mb-6">
          Edit Profile
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-primary-yellow">
              Bio:
            </label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleInputChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md   text-primary-yellow focus:outline-none focus:ring-2 focus:ring-primary-yellow"
              rows="4"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-yellow">
              Profile Picture:
            </label>
            <input
              type="file"
              name="profilePicture"
              onChange={handleFileChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md   text-primary-yellow focus:outline-none focus:ring-2 focus:ring-primary-yellow"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/User")}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-yellow hover:bg-secondary-yellow text-white font-bold py-2 px-4 rounded transition duration-300 disabled:bg-gray-400"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default EditProfile;