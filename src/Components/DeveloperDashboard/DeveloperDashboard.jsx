
import React, { useState } from "react";
import { Link, Routes, Route, useLocation, useNavigate, useParams } from "react-router-dom";


// Basic Styles
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

const linkStyle = {
  color: "white",
  textDecoration: "none",
  display: "block",
  padding: "12px 16px",
  borderRadius: "8px",
  marginBottom: "8px",
  fontSize: "1.1rem",
  transition: "background 0.3s ease",
};

const activeLinkStyle = {
  backgroundColor: "#4B5563",
};

const mainContentStyle = {
  marginLeft: "250px",
  padding: "40px 20px",
  color: "white",
  minHeight: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.6)",
};

// Section Styles with Boxed Layout
const sectionTitleStyle = {
  fontSize: "1.8rem",
  marginBottom: "16px",
  color: "#fff",
};

const sectionBoxStyle = {
  padding: "20px",
  borderRadius: "8px",
  backgroundColor: "#1F2937",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3)",
  marginBottom: "20px",
  animation: "fadeIn 1s ease-in-out",
};

// Main Dashboard Component
const DeveloperDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [events, setEvents] = useState([
    { id: 1, title: "Brazilian Dance Social: Forró & Samba", venue: "Motivo LA", price: 20, seats: 20 },
    { id: 2, title: "Graduation Ceremony", venue: "CSUN", price: 5, seats: 5 },
    { id: 3, title: "Sing! - An 'L.A. Story' Live Music", venue: "West Hollywood", price: 0, seats: 0 },
    { id: 4, title: "The RHYTHMS", venue: "L.A. Arts Center", price: 15, seats: 30 },
    { id: 5, title: "New Year Countdown", venue: "L.A. Downtown", price: 30, seats: 50 },
    { id: 6, title: "Bake Better", venue: "Sweet & Savory Bakery", price: 25, seats: 15 },
    { id: 7, title: "HOPE - LA 6th Annual FUNdraiser 70s Disco Party", venue: "L.A. Disco Hall", price: 50, seats: 100 },
  ]);

  const handleEditEvent = (eventId) => {
    navigate(`/dev-dashboard/event-manager/edit/${eventId}`);
  };

  const handleSaveEvent = (updatedEvent) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
    navigate("/dev-dashboard/event-manager");
  };

  return (
    <div style={{ display: "flex" }}>
      <aside style={sidebarStyle}>
        <div>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>Host Panel</h2>
          <Link to="/dev-dashboard/overview" style={linkStyle}>
            Dashboard Overview
          </Link>
          <Link to="/dev-dashboard/event-manager" style={linkStyle}>
            Event Manager
          </Link>
          <Link to="/dev-dashboard/transactions" style={linkStyle}>
            Transactions
          </Link>
          <Link to="https://docs.google.com/document/d/1u8i1cayhj8q4j6HUniee2QJw8GGnU1XjTmIFnUfGqvc/edit?usp=sharing" style={linkStyle} target="_blank" rel="noopener noreferrer">
            Help & Support
          </Link>
        </div>
        <small style={{ color: "#ccc", fontSize: "0.75rem" }}>© 2025 Planify</small>
      </aside>

      <main style={mainContentStyle}>
        <Routes>
          <Route
            path="overview"
            element={
              <div>
                <h2 style={sectionTitleStyle}>Dashboard Overview</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
                  {events.map((event) => (
                    <div
                      key={event.id}
                      style={sectionBoxStyle}
                      onClick={() => handleEditEvent(event.id)}
                    >
                      <h3>{event.title}</h3>
                      <p>{event.venue}</p>
                      <div><strong>Price:</strong> ${event.price}</div>
                      <div><strong>Seats Available:</strong> {event.seats}</div>
                    </div>
                  ))}
                </div>
              </div>
            }
          />
          <Route
            path="event-manager"
            element={
              <div>
                <h2 style={sectionTitleStyle}>Manage Events</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px" }}>
                  {events.map((event) => (
                    <div
                      key={event.id}
                      style={sectionBoxStyle}
                      onClick={() => handleEditEvent(event.id)}
                    >
                      <h3>{event.title}</h3>
                    </div>
                  ))}
                </div>
              </div>
            }
          />
          <Route
            path="event-manager/edit/:eventId"
            element={
              <EventEditForm events={events} onSaveEvent={handleSaveEvent} />
            }
          />
          <Route path="transactions" element={<div>Transactions Page</div>} />
        </Routes>
      </main>
    </div>
  );
};

// Event Edit Form Component
const EventEditForm = ({ events, onSaveEvent }) => {
  const { eventId } = useParams();
  const eventToEdit = events.find((event) => event.id === parseInt(eventId));

  const [editedEvent, setEditedEvent] = useState({ ...eventToEdit });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveEvent(editedEvent);
  };

  return (
    <div>
      <h2 style={sectionTitleStyle}>Edit Event</h2>
      <form onSubmit={handleSubmit}>
        <label>Event Title:</label>
        <input
          type="text"
          name="title"
          value={editedEvent.title}
          onChange={handleChange}
        />
        <br />
        <label>Event Venue:</label>
        <input
          type="text"
          name="venue"
          value={editedEvent.venue}
          onChange={handleChange}
        />
        <br />
        <label>Price:</label>
        <input
          type="number"
          name="price"
          value={editedEvent.price}
          onChange={handleChange}
        />
        <br />
        <label>Seats Available:</label>
        <input
          type="number"
          name="seats"
          value={editedEvent.seats}
          onChange={handleChange}
        />
        <br />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default DeveloperDashboard;
