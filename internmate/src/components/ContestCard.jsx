import React, { useState, useEffect } from "react";
import "./../styles/ContestCard.css";

const formatDateTime = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleString("en-IN", {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    day: "numeric",
    month: "short",
  });
};

const formatDuration = (durationSec) => {
  if (!durationSec || isNaN(durationSec)) return "N/A";

  const totalSeconds = Math.floor(parseFloat(durationSec));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  let result = "";
  if (hours > 0) result += `${hours}h `;
  if (minutes > 0) result += `${minutes}m`;
  return result.trim() || "0m";
};

const ContestCard = ({ platform, name, start, duration, link, index }) => {
  const [reminderTime, setReminderTime] = useState("");

  const handleReminderChange = (minutesBefore) => {
    setReminderTime(minutesBefore);
    if (!minutesBefore) return;

    const startTime = new Date(start).getTime();
    const reminderOffset = parseInt(minutesBefore) * 60 * 1000;
    const reminderTimestamp = startTime - reminderOffset;
    const now = Date.now();
    const delay = reminderTimestamp - now;

    if (delay > 0) {
      setTimeout(() => {
        alert(`⏰ Reminder: "${name}" on ${platform} starts in ${minutesBefore} minutes!`);
      }, delay);
    } else {
      alert("⏰ Contest is too close or already started!");
    }
  };

  return (
    <div
      className="contest-card"
      style={{
        backgroundColor: index % 2 === 0 ? "var(--card-bg-1)" : "var(--card-bg-2)",
      }}
    >
      <div className="contest-info">
        <h3>{name}</h3>
        <p className="contest-platform">🌐 {platform}</p>
        <p className="contest-time">
          🕒 {formatDateTime(start)} • {formatDuration(duration)}
        </p>
      </div>

      <div className="contest-actions">
        <select
          value={reminderTime}
          onChange={(e) => handleReminderChange(e.target.value)}
          className="reminder-dropdown"
        >
          <option value="">⏰</option>
          <option value="10">10 min</option>
          <option value="30">30 min</option>
          <option value="60">1 hour</option>
        </select>

        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="contest-btn"
        >
          Register →
        </a>
      </div>
    </div>
  );
};

export default ContestCard;
