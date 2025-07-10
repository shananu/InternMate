// 📁 src/components/Layout.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Layout.css";

const Layout = ({ title, children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);

  const pageName = location.pathname.replace("/", "") || "dashboard";

  useEffect(() => {
    document.body.setAttribute("data-page", pageName);

    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      document.body.setAttribute("data-theme", "dark");
      setDarkMode(true);
    } else {
      document.body.setAttribute("data-theme", "light");
      setDarkMode(false);
    }

    return () => {
      document.body.removeAttribute("data-page");
    };
  }, [pageName]);

  const toggleTheme = () => {
    const newMode = darkMode ? "light" : "dark";
    setDarkMode(!darkMode);
    document.body.setAttribute("data-theme", newMode);
    localStorage.setItem("theme", newMode);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // 📌 Scroll detection to hide/reveal header
  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const currentY = window.scrollY;
      setHideHeader(currentY > lastY);
      lastY = currentY;
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`layout-container ${pageName === "dashboard" ? "dashboard-theme" : ""}`}>
      {/* 👉 Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {sidebarCollapsed ? "➡️" : "⬅️"}
        </button>
        <h2 className="logo">{!sidebarCollapsed && "InternMate"}</h2>

        <button onClick={() => navigate("/dashboard")}>🏠 {!sidebarCollapsed && "Dashboard"}</button>
        <button onClick={() => navigate("/profile")}>👤 {!sidebarCollapsed && "Profile"}</button>
        <button onClick={() => navigate("/planner")}>🗓️ {!sidebarCollapsed && "Planner"}</button>
        <button onClick={() => navigate("/pomodoro")}>⏱️ {!sidebarCollapsed && "Pomodoro"}</button>
        <button onClick={() => navigate("/contest")}>🧭 {!sidebarCollapsed && "Contests"}</button>

        <div className="sidebar-footer-row">
          <button className="theme-toggle" onClick={toggleTheme}>
            {darkMode ? "🌞" : "🌙"} {!sidebarCollapsed && "Theme"}
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 {!sidebarCollapsed && "Logout"}
          </button>
        </div>
      </aside>

      {/* 👉 Main Content */}
      <main className="main-content full-width">
        <header className={`topbar full-width ${hideHeader ? "hide-header" : ""}`}>
          <h1>{title}</h1>
        </header>

        {/* Add padding so content doesn’t go under the header */}
        <section className="content" style={{ paddingTop: "5rem" }}>
          {children}
        </section>
      </main>
    </div>
  );
};

export default Layout;
