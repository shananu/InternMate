import React, { useState, useEffect } from "react";
import { FaGithub, FaLinkedin, FaInstagram, FaCopy } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import EditProfileModal from "./EditProfileModal";
import "../styles/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!user) {
    return <p className="profile-loading">Loading profile...</p>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-avatar">👩🏻‍💻</div>
        <h2 className="profile-heading">My Profile</h2>

        <div className="profile-section">
          <h3>🧠 Personal Info</h3>
          <ul>
            <li><strong>Name:</strong> {user.name}</li>
            <li><strong>Email:</strong> {user.email}</li>
            <li><strong>Age:</strong> {user.age}</li>
            <li><strong>Degree:</strong> {user.degree}</li>
            <li><strong>Major:</strong> {user.major}</li>
            <li><strong>Year:</strong> {user.year}</li>
            <li><strong>College:</strong> {user.college}</li>
            <li>
              <strong>Resume:</strong>{" "}
              {user.resume ? (
                <a href={user.resume} target="_blank" rel="noreferrer" className="resume-link">
                  View
                </a>
              ) : (
                "Not uploaded"
              )}
            </li>
          </ul>
        </div>

        <div className="profile-section profile-links">
          <h3>🔗 Social Links</h3>

          {user.github && (
            <div>
              <FaGithub />
              <a href={user.github} target="_blank" rel="noreferrer">{user.github}</a>
              <button onClick={() => copyToClipboard(user.github)}><FaCopy /></button>
            </div>
          )}

          {user.linkedin && (
            <div>
              <FaLinkedin />
              <a href={user.linkedin} target="_blank" rel="noreferrer">{user.linkedin}</a>
              <button onClick={() => copyToClipboard(user.linkedin)}><FaCopy /></button>
            </div>
          )}

          {user.instagram && (
            <div>
              <FaInstagram />
              <a href={user.instagram} target="_blank" rel="noreferrer">{user.instagram}</a>
              <button onClick={() => copyToClipboard(user.instagram)}><FaCopy /></button>
            </div>
          )}

          {user.leetcode && (
            <div>
              <SiLeetcode />
              <a href={user.leetcode} target="_blank" rel="noreferrer">{user.leetcode}</a>
              <button onClick={() => copyToClipboard(user.leetcode)}><FaCopy /></button>
            </div>
          )}
        </div>

        <button className="edit-profile-btn" onClick={() => setShowModal(true)}>
          ✏️ Edit Profile
        </button>

        {showModal && (
          <EditProfileModal
            user={user}
            onClose={() => setShowModal(false)}
            onSave={(updated) => setUser(updated)}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;
