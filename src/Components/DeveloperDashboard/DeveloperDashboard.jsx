import React, { useState } from "react";
import { Link, Routes, Route, useLocation } from "react-router-dom";

const sidebarStyle = {
  width: "250px",
  height: "100vh",
  padding: "20px",
  backgroundColor: "rgba(0, 0, 0, 0.85)", // Slight transparency
  color: "white",
  position: "fixed",
  top: "50px", // Lower the sidebar
  left: 0,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  zIndex: 10,
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  display: "block",
  padding: "12px 16px",
  borderRadius: "8px",
  marginBottom: "8px",
  fontSize: "1.1rem",
  transition: "background 0.2s ease", // For background color transitions
};

const activeLinkStyle = {
  backgroundColor: "#4B5563", // Tailwind gray-700
};

const mainContentStyle = {
  marginLeft: "250px",
  padding: "40px 20px",
  color: "white",
  minHeight: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.6)",
};

const sectionTitleStyle = {
  fontSize: "1.8rem",
  marginBottom: "16px",
};

const DeveloperDashboard = () => {
  const location = useLocation();

  const linkPaths = [
    { path: "notifications", label: "Notifications" },
    { path: "analytics", label: "Analytics" },
    { path: "user-data", label: "User Data" },
    { path: "settings", label: "Settings" },
  ];

  return (
    <div style={{ display: "flex" }}>
      <aside style={sidebarStyle}>
        <div>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>DevDash</h2>
          {linkPaths.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              style={{
                ...linkStyle,
                ...(location.pathname.includes(path) ? activeLinkStyle : {}),
              }}
              className="sidebar-link"  // Add this class for hover effect
            >
              {label}
            </Link>
          ))}
        </div>
        <small style={{ color: "#ccc", fontSize: "0.75rem" }}>© 2025 Planify</small>
      </aside>

      <main style={mainContentStyle}>
        {location.pathname === "/dev-dashboard" && (
          <div>
            <h1 style={sectionTitleStyle}>Developer Dashboard</h1>
            <p>Welcome to the Developer Dashboard! Here, you can monitor project activity.</p>
          </div>
        )}

        <Routes>
          <Route path="notifications" element={<Notifications />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="user-data" element={<UserData />} />
          <Route path="settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
};

const Notifications = () => {
  const notifications = [
    "New user signed up",
    "Event ticket sales have increased",
    "System update completed successfully",
  ];

  return (
    <div>
      <h2 style={sectionTitleStyle}>Notifications</h2>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification}</li>
        ))}
      </ul>
    </div>
  );
};

const Analytics = () => {
  return (
    <div>
      <h2 style={sectionTitleStyle}>Analytics</h2>
      <p>Here are the analytics data...</p>
    </div>
  );
};

const UserData = () => {
  const users = [
    { id: 1, name: "John Doe", lastLogin: "2025-03-05", purchases: [{ item: "Concert Ticket", date: "2025-03-01" }] },
    { id: 2, name: "Jane Smith", lastLogin: "2025-03-03", purchases: [{ item: "Festival Pass", date: "2025-02-25" }] },
  ];

  return (
    <div>
      <h2 style={sectionTitleStyle}>User Data</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <strong>{user.name}</strong> - Last Login: {user.lastLogin}
            <ul>
              {user.purchases.map((purchase, index) => (
                <li key={index}>
                  Bought {purchase.item} on {purchase.date}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Settings = () => {
  return (
    <div>
      <h2 style={sectionTitleStyle}>Settings</h2>
      <p>Manage your account and preferences here.</p>
    </div>
  );
};

export default DeveloperDashboard;
