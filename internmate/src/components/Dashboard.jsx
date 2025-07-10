// Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Dashboard.css";
import ProfileProgressRing from "./ProfileProgressRing";
import axios from "axios";
import Layout from "../components/Layout";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isNewUser = new URLSearchParams(location.search).get("new") === "true";
  const [userCompletion, setUserCompletion] = useState(0);
  const [showPrompt, setShowPrompt] = useState(isNewUser);

  const calculateCompletion = (data) => {
    const keys = [
      "name", "age", "degree", "major", "year",
      "college", "resume", "github", "linkedin",
      "instagram", "leetcode", "codeforces"
    ];
    const filled = keys.filter(key => data[key] && data[key].toString().trim() !== '');
    return Math.round((filled.length / keys.length) * 100);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const pct = calculateCompletion(res.data);
        setUserCompletion(pct);
        if (pct === 100) setShowPrompt(false);
      } catch (e) {
        console.error(e);
      }
    };
    fetchProfile();
  }, []);

  return (
    <Layout title="Dashboard">
      <div className="dashboard-widgets">
        {/* Left Column */}
        <div className="widget-column">
          <div className="widget">
            <h3>🔥 Daily Streak</h3>
            <p>You’re on a 3-day streak! Keep going!</p>
          </div>

          <div className="widget">
            <h3>💬 Quote of the Day</h3>
            <p>“The future depends on what you do today.” – Mahatma Gandhi</p>
          </div>

          <div className="widget">
            <h3>⏳ Upcoming Contest</h3>
            <p>LeetCode Weekly - June 29, 7:30 PM</p>
          </div>
        </div>

        {/* Right Column (Sidebar) */}
        <div className="widget-sidebar">
          <div className="widget widget-center">
            <h3>👤 Profile Completion</h3>
            <ProfileProgressRing percentage={userCompletion} />
            <p>{userCompletion}% complete</p>
          </div>
        </div>
      </div>

      {showPrompt && userCompletion < 100 && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Welcome Aboard!</h2>
            <p>Complete your profile to unlock all features.</p>
            <div className="modal-buttons">
              <button onClick={() => navigate('/profile/edit')} className="btn-primary">Complete Profile</button>
              <button onClick={() => setShowPrompt(false)} className="btn-outline">Skip</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
