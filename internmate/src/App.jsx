import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, Outlet, useLocation } from "react-router-dom";

import Pomodoro from "./components/Pomodoro";
import Planner from "./components/Planner";
import ContestNotifications from "./components/ContestNotifications";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";

import "./styles/theme.css";
import "./styles/Pomodoro.css";
import "./styles/Planner.css";
import "./styles/ContestNotifications.css";
import "./styles/Auth.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/*Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/*Profile */}
        <Route path="/profile" element={<Profile />} />

        {/* Main Layout */}
        <Route element={<MainLayout />}>
          <Route path="/pomodoro" element={<Pomodoro />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/contest" element={<ContestNotifications />} />
        </Route>

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

function MainLayout() {
  const [theme, setTheme] = useState("light");
  const location = useLocation();

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);

    // Automatically update page styling
    const currentPage = location.pathname.replace("/", "") || "login";
    document.body.setAttribute("data-page", currentPage);
  }, [theme, location]);

  return (
    <>
      <HeaderControls theme={theme} setTheme={setTheme} />
      <Outlet />
    </>
  );
}

function HeaderControls({ theme, setTheme }) {
  return (
    <div className="top-controls">
      {/* Keep the theme toggle (optional) */}
      {/* <button onClick={() => setTheme(theme === "light" ? "dark" : "light")} className="theme-toggle">
        {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
      </button> */}

      {/* ❌ Remove this page switch section */}
      {/* <div className="page-switch-buttons">...</div> */}
    </div>
  );
}


export default App;
