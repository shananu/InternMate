import React, { useState } from "react";
import "../styles/EditProfileModal.css";

const EditProfileModal = ({ user, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: user.name || "",
    age: user.age || "",
    degree: user.degree || "",
    major: user.major || "",
    year: user.year || "",
    college: user.college || "",
    github: user.github || "",
    linkedin: user.linkedin || "",
    instagram: user.instagram || "",
    leetcode: user.leetcode || "",
  });

  const [resumeFile, setResumeFile] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    // Add text fields
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Add file field if selected
    if (resumeFile) {
      formData.append("resume", resumeFile);
    }

    try {
      const res = await fetch("http://localhost:5000/api/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (res.ok) {
        const updated = await res.json();
        onSave(updated);
        onClose();
      } else {
        alert("Failed to update profile.");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("An error occurred while updating.");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>Edit Profile</h3>

        {[
          ["Name", "name"],
          ["Age", "age"],
          ["Degree", "degree"],
          ["Major", "major"],
          ["Year", "year"],
          ["College", "college"],
          ["GitHub", "github"],
          ["LinkedIn", "linkedin"],
          ["Instagram", "instagram"],
          ["LeetCode", "leetcode"],
        ].map(([label, name]) => (
          <div className="form-group" key={name}>
            <label>{label}:</label>
            <input
              name={name}
              value={form[name]}
              onChange={handleChange}
              placeholder={label}
            />
          </div>
        ))}

        <div className="form-group">
          <label>Upload Resume (PDF only):</label>
          <input type="file" accept=".pdf" onChange={handleFileChange} />
        </div>

        <div className="modal-actions">
          <button onClick={handleSubmit}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
