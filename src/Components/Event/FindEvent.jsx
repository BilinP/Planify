import React, { useState, useEffect } from 'react';
import { useLocation, Routes, Route, Link } from 'react-router-dom';
import supabase from '@backend/supabaseClient';

const sidebarStyle = {
  width: "250px",
  height: "100vh",
  padding: "20px",
  backgroundColor: "rgba(0, 0, 0, 0.85)",
  color: "white",
  position: "fixed",
  top: "50px",
  left: 0,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  zIndex: 10,
};

const mainContentStyle = {
  marginLeft: "250px",
  padding: "40px 20px",
  color: "white",
  minHeight: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.6)",
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  display: "block",
  padding: "12px 16px",
  borderRadius: "8px",
  marginBottom: "8px",
  fontSize: "1.1rem",
  transition: "background 0.2s ease",
};

const activeLinkStyle = {
  backgroundColor: "#4B5563",
};

// Developer Dashboard Component
const DeveloperDashboard = () => {
  const location = useLocation();
  const [dashboardData, setDashboardData] = useState(null);

  const linkPaths = [
    { path: "overview", label: "Dashboard Overview" },
    { path: "transactions", label: "Transactions" },
    { path: "event-manager", label: "Event Manager" },
    { path: "messages", label: "Messages" },
    { path: "payouts", label: "Payouts" },
    { path: "help", label: "Help & Support" },
  ];

  useEffect(() => {
    // Fetch event data
    const fetchData = async () => {
      try {
        const { data: events, error } = await supabase
          .from('events')
          .select('*');
        if (error) throw error;

        const totalEvents = events.length;
        const totalTicketsSold = events.reduce((acc, event) => acc + event.seats, 0);
        const totalRevenue = events.reduce((acc, event) => acc + event.price * event.seats, 0);
        const avgTicketPrice = totalTicketsSold ? totalRevenue / totalTicketsSold : 0;
        const upcomingEvents = events.filter(event => new Date(event.date) > new Date()).slice(0, 3);

        setDashboardData({
          totalEvents,
          totalTicketsSold,
          totalRevenue,
          avgTicketPrice,
          upcomingEvents,
        });
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchData();
  }, []);

  if (!dashboardData) {
    return <div style={{ padding: "20px", color: "white" }}>Loading...</div>;
  }

  return (
    <div style={{ display: "flex" }}>
      <aside style={sidebarStyle}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>Host Panel</h2>
        {linkPaths.map(({ path, label }) => (
          <Link
            key={path}
            to={path}
            style={{
              ...linkStyle,
              ...(location.pathname.includes(path) ? activeLinkStyle : {}),
            }}
          >
            {label}
          </Link>
        ))}
        <small style={{ color: "#ccc", fontSize: "0.75rem" }}>© 2025 Planify</small>
      </aside>

      <main style={mainContentStyle}>
        <h2 style={{ fontSize: "1.8rem", marginBottom: "16px" }}>Dashboard Overview</h2>
        <div>
          <div>Total Events: {dashboardData.totalEvents}</div>
          <div>Total Tickets Sold: {dashboardData.totalTicketsSold}</div>
          <div>Total Revenue: ${dashboardData.totalRevenue}</div>
          <div>Average Ticket Price: ${dashboardData.avgTicketPrice.toFixed(2)}</div>
        </div>

        <div style={{ marginTop: '40px' }}>
          <h3>Upcoming Events</h3>
          <ul>
            {dashboardData.upcomingEvents.map((event, index) => (
              <li key={index}>
                {event.event_title} - {new Date(event.date).toLocaleDateString()} at {event.location}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default DeveloperDashboard;
