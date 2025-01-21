import { useState } from "react";
import axios from "axios";

const Register = () => {
    const [formData, setFormData] = useState({ username: "", password: "", role: "user" });
    const [error, setError] = useState("");
    console.log("clicked submit")

    const handleSubmit = async (e) => {
        console.log("clicked submit")
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/auth/register", formData, {
                withCredentials: true
            });
            alert("Registration successful");
        } catch (error) {
            setError(error.response?.data?.message || "Registration failed. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
            <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
                <option value="user">User</option>
                <option value="admin">Admin</option>
            </select>
            {error && <p className="error-message">{error}</p>}
            <button type="submit">Register</button>
        </form>
    );
};
export default Register;
