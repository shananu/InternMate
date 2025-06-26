// TopBar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const colorMap = {
  orange: {
    light: "bg-orange-100 text-orange-800",
    dark: "bg-orange-900 text-orange-100",
  },
  blue: {
    light: "bg-blue-100 text-blue-800",
    dark: "bg-blue-900 text-blue-100",
  },
  violet: {
    light: "bg-violet-100 text-violet-800",
    dark: "bg-violet-900 text-violet-100",
  },
  green: {
    light: "bg-green-100 text-green-800",
    dark: "bg-green-900 text-green-100",
  },
};

const TopBar = ({ color = "blue" }) => {
  const navigate = useNavigate();
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
  };

  const colors = colorMap[color] || colorMap.blue;

  return (
    <div
      className={`topbar w-full flex justify-between items-center px-6 py-3 shadow-md ${colors.light} dark:${colors.dark}`}
    >
      <h2 className="text-xl font-semibold">InternMate</h2>

      <div className="flex gap-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-white dark:bg-transparent dark:border-white border border-black px-3 py-1 rounded-md"
        >
          ⬅ Dashboard
        </button>
        <button
          onClick={toggleDarkMode}
          className="bg-white dark:bg-transparent dark:border-white border border-black px-3 py-1 rounded-md"
        >
          🌗 Toggle Theme
        </button>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
          className="bg-red-500 text-white px-3 py-1 rounded-md"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default TopBar;
