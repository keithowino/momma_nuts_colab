import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import "./profile.css";

const url = "http://127.0.0.1:5000"

function Profile() {
  const [user, setUser] = useState({ name: "", email: "", phone: "", id: "" });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) {
      setUser(loggedInUser);
      setNewName(loggedInUser.name);
      setNewEmail(loggedInUser.email);
      setNewPhone(loggedInUser.phone); // Load phone number from localStorage
    }
  }, []);

  const handleUpdate = (e) => {
    e.preventDefault();

    if (!user.id) {
      alert("User ID is missing. Please log in again.");
      return;
    }

    const token = localStorage.getItem("access_token");
    const requestBody = {
      name: newName,
      email: newEmail,
      phone: newPhone, // Send updated phone number
    };

    if (newPassword.trim()) {
      requestBody.current_password = currentPassword;
      requestBody.new_password = newPassword;
    }

    console.log("Sending PATCH request with:", requestBody);

    fetch(`${url}/users`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Server response:", data);
        if (data.error) {
          throw new Error(data.error);
        }
        alert("Profile updated successfully!");
        localStorage.setItem(
          "user",
          JSON.stringify({ name: newName, email: newEmail, phone: newPhone, id: user.id })
        );

        window.location.reload();
      })
      .catch((error) => {
        console.error("Update error:", error.message);
        alert(error.message || "Something went wrong. Please try again.");
      });
  };

  const handleDelete = () => {
  if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone!")) {
    return;
  }

  const token = localStorage.getItem("access_token");

  fetch(`${url}/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    // Only include body if your backend requires user_id (e.g., for admin-deleting other users)
    // body: JSON.stringify({ user_id: user.id })
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to delete account");
      return res.json(); 
    })
    .then(() => {
      alert("Account soft-deleted successfully!");
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      navigate("/login");
    })
    .catch((error) => {
      console.error("Delete error:", error.message);
      alert(error.message || "Something went wrong. Please try again.");
    });
};

  return (
  <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div className="profile-container">
      <h2>Edit Profile</h2>
      <form onSubmit={handleUpdate}>
        <label className="profileLabel">Name:</label>
        <input
          type="text"
          value={newName || user.name}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Your name"
        />

        <label className="profileLabel">Email:</label>
        <input
          type="email"
          value={newEmail || user.email}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="Your email"
        />

        <label className="profileLabel">Phone:</label>
        <input
          type="number"
          value={newPhone || user.phone}
          onChange={(e) => setNewPhone(e.target.value)}
          placeholder="Your phone"
        />

        <label className="profileLabel">Current Password:</label>
        <input
          type="password"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current password"
        />

        <label className="profileLabel">New Password (optional):</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password"
        />

        <div className="profileButtons">
          <button className="updateProfileBtn" type="submit">Update</button>
          <button
            onClick={handleDelete}
            className="deleteProfileBtn"
            type="button"
          >
            Delete Account
          </button>
        </div>
      </form>
    </div>
  </div>
);
}

export default Profile;
