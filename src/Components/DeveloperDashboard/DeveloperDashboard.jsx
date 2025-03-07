import React, { useState } from "react";
import { Link, Routes, Route, useLocation } from "react-router-dom";

// Styling
const sidebarStyle = {
  width: "250px",
  height: "100vh",
  padding: "20px",
  backgroundColor: "#333",
  color: "white",
  position: "fixed",
};

const mainContentStyle = {
  marginLeft: "250px",
  padding: "20px",
  color: "white", // White text only for the dashboard
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  display: "block",
  padding: "10px",
};

const activeLinkStyle = {
  backgroundColor: "#555",
};

const sectionTitleStyle = {
  textAlign: "left", // Ensure titles are left-aligned
  margin: "0", // Remove any default margin that could push titles to the right
  padding: "10px 0", // Add some padding above and below titles
  fontSize: "1.5rem", // Make the title slightly bigger for better visibility
  color: "white", // Ensure the title color is consistent with the theme
};

const DeveloperDashboard = () => {
  const location = useLocation(); // Get the current location (route)

  console.log("Developer Dashboard Rendered");

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <h2>DevDash</h2>
        <ul>
          <li>
            <Link to="notifications" style={linkStyle} activeStyle={activeLinkStyle}>
              Notifications
            </Link>
          </li>
          <li>
            <Link to="analytics" style={linkStyle} activeStyle={activeLinkStyle}>
              Analytics
            </Link>
          </li>
          <li>
            <Link to="user-data" style={linkStyle} activeStyle={activeLinkStyle}>
              User Data
            </Link>
          </li>
          <li>
            <Link to="settings" style={linkStyle} activeStyle={activeLinkStyle}>
              Settings
            </Link>
          </li>
        </ul>
      </div>

      {/* Main content */}
      <div style={mainContentStyle}>
        {/* Conditionally render the "Welcome" text only if the current path is the root dashboard */}
        {location.pathname === "/dev-dashboard" && (
          <div>
            <h1 style={sectionTitleStyle}>Developer Dashboard</h1>
            <p>Welcome to the Developer Dashboard! Here, you can monitor project activity.</p>
          </div>
        )}

        {/* Nested Routes for Sections */}
        <Routes>
          <Route path="notifications" element={<Notifications />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="user-data" element={<UserData />} />
          <Route path="settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
};

// Notifications Section
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

// Analytics Section with Dynamic Data Display
const Analytics = () => {
  const [showTicketSales, setShowTicketSales] = useState(false);
  const [showEvents, setShowEvents] = useState(false);

  const ticketSalesData = [
    { event: "Concert A", ticketsSold: 120 },
    { event: "Festival B", ticketsSold: 300 },
    { event: "Sports Match C", ticketsSold: 250 },
  ];

  const eventsData = [
    { name: "Music Festival", date: "2025-04-12", location: "Los Angeles" },
    { name: "Tech Conference", date: "2025-05-20", location: "San Francisco" },
    { name: "Comedy Night", date: "2025-06-15", location: "New York" },
  ];

  return (
    <div>
      <h2 style={sectionTitleStyle}>Analytics</h2>
      <button style={{ margin: "5px" }} onClick={() => setShowTicketSales(!showTicketSales)}>
        Ticket Sales
      </button>
      <button style={{ margin: "5px" }} onClick={() => setShowEvents(!showEvents)}>
        Events
      </button>

      {showTicketSales && (
        <div>
          <h3>Ticket Sales</h3>
          <ul>
            {ticketSalesData.map((sale, index) => (
              <li key={index}>
                <strong>{sale.event}</strong>: {sale.ticketsSold} tickets sold
              </li>
            ))}
          </ul>
        </div>
      )}

      {showEvents && (
        <div>
          <h3>Upcoming Events</h3>
          <ul>
            {eventsData.map((event, index) => (
              <li key={index}>
                <strong>{event.name}</strong> - {event.date} in {event.location}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// User Data Section
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

// Settings Section
const Settings = () => {
  return (
    <div>
      <h2 style={sectionTitleStyle}>Settings</h2>
      <p>Manage your account and preferences here.</p>
      <button style={{ margin: "5px" }}>Change Profile Picture</button>
      <button style={{ margin: "5px" }}>Change Email</button>
      <button style={{ margin: "5px" }}>Log Out</button>
    </div>
  );
};

export default DeveloperDashboard;
