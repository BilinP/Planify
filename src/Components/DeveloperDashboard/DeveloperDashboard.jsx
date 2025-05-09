// DeveloperDashboard.jsx
import React, { useState, useEffect } from "react";
import { Link, Routes, Route, useLocation, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../../backend/supabaseClient";

// --- Styles ---
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

// --- Main Component ---
const DeveloperDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("EventTable")
        .select("event_id, event_title, location, price, seats");

      if (error) console.error("Error fetching events:", error);
      else setEvents(data);
    };
    fetchEvents();
  }, []);

  const handleEditEvent = (eventId) => navigate(`event-manager/edit/${eventId}`);

  const handleSaveEvent = async (updatedEvent) => {
    const { error } = await supabase
      .from("EventTable")
      .update({
        event_title: updatedEvent.event_title,
        location: updatedEvent.location,
        price: updatedEvent.price,
        seats: updatedEvent.seats,
      })
      .eq("event_id", updatedEvent.event_id);

    if (error) console.error("Error updating event:", error);
    else {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.event_id === updatedEvent.event_id ? updatedEvent : event
        )
      );
      navigate("event-manager");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <aside style={sidebarStyle}>
        <div>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>Host Panel</h2>

          <Link
            to="overview"
            style={{
              ...linkStyle,
              ...(location.pathname.endsWith("overview") && {
                backgroundColor: "#2563EB",
                fontWeight: "bold",
              }),
            }}
          >
            Dashboard Overview
          </Link>

          <Link
            to="event-manager"
            style={{
              ...linkStyle,
              ...(location.pathname.includes("event-manager") &&
                !location.pathname.includes("edit") && {
                  backgroundColor: "#2563EB",
                  fontWeight: "bold",
                }),
            }}
          >
            Event Manager
          </Link>

          <Link
            to="transactions"
            style={{
              ...linkStyle,
              ...(location.pathname.includes("transactions") && {
                backgroundColor: "#2563EB",
                fontWeight: "bold",
              }),
            }}
          >
            Transactions
          </Link>

          <Link
            to="https://docs.google.com/document/d/1u8i1cayhj8q4j6HUniee2QJw8GGnU1XjTmIFnUfGqvc/edit?usp=sharing"
            style={linkStyle}
            target="_blank"
            rel="noopener noreferrer"
          >
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
                      key={event.event_id}
                      style={sectionBoxStyle}
                      onClick={() => handleEditEvent(event.event_id)}
                    >
                      <h3>{event.event_title}</h3>
                      <p>{event.location}</p>
                      <div><strong>Price:</strong> ${event.price ?? 0}</div>
                      <div><strong>Seats Available:</strong> {event.seats ?? 0}</div>
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
                      key={event.event_id}
                      style={sectionBoxStyle}
                      onClick={() => handleEditEvent(event.event_id)}
                    >
                      <h3>{event.event_title}</h3>
                    </div>
                  ))}
                </div>
              </div>
            }
          />
          <Route
            path="event-manager/edit/:eventId"
            element={<EventEditForm events={events} onSaveEvent={handleSaveEvent} />}
          />
          <Route
            path="transactions"
            element={<TransactionsInline />}
          />
        </Routes>
      </main>
    </div>
  );
};

const TransactionsInline = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      console.log("User:", user);
      if (!user) {
        console.warn("No user found");
        return;
      }

      const { data: purchases, error: purchaseError } = await supabase
        .from("ticket_purchase_history")
        .select(`
          id,
          user_id,
          quantity,
          total_price,
          purchased_at,
          ticket_types (
            event_id,
            EventTable:event_id (
              event_title
            )
          )
        `);

      if (purchaseError) {
        console.error("Purchase fetch error:", purchaseError);
        return;
      }

      const transactionsWithNames = purchases.map((p) => ({
        id: p.id,
        buyer_email: p.user_id,
        amount: p.total_price,
        created_at: p.purchased_at,
        event_title: p.ticket_types?.EventTable?.event_title || "Unknown Event",
      }));

      setTransactions(transactionsWithNames);
      setLoading(false);
    };

    fetchTransactions();
  }, []);

  if (loading) return <p>Loading transactions...</p>;

  return (
    <div>
      <h2 style={sectionTitleStyle}>Transaction History</h2>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#fff", color: "#000", borderRadius: "8px", overflow: "hidden" }}>
          <thead style={{ backgroundColor: "#1F2937", color: "#fff" }}>
            <tr>
              <th style={{ padding: "12px", borderBottom: "1px solid #ccc" }}>Event</th>
              <th style={{ padding: "12px", borderBottom: "1px solid #ccc" }}>Transaction ID</th>
              <th style={{ padding: "12px", borderBottom: "1px solid #ccc" }}>Buyer Email</th>
              <th style={{ padding: "12px", borderBottom: "1px solid #ccc" }}>Amount</th>
              <th style={{ padding: "12px", borderBottom: "1px solid #ccc" }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>{tx.event_title}</td>
                <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>{tx.id}</td>
                <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>{tx.buyer_email}</td>
                <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>${tx.amount.toFixed(2)}</td>
                <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>{new Date(tx.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const EventEditForm = ({ events, onSaveEvent }) => {
  const { eventId } = useParams();
  const eventToEdit = events.find((event) => event.event_id === parseInt(eventId));
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

  if (!editedEvent) return <p>Loading event...</p>;

  return (
    <div>
      <h2 style={sectionTitleStyle}>Edit Event</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: "400px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <label style={{ fontWeight: "bold" }}>Event Title:</label>
        <input type="text" name="event_title" value={editedEvent.event_title} onChange={handleChange} />

        <label style={{ fontWeight: "bold" }}>Event Location:</label>
        <input type="text" name="location" value={editedEvent.location} onChange={handleChange} />

        <label style={{ fontWeight: "bold" }}>Price:</label>
        <input type="number" name="price" value={editedEvent.price} onChange={handleChange} />

        <label style={{ fontWeight: "bold" }}>Seats Available:</label>
        <input type="number" name="seats" value={editedEvent.seats} onChange={handleChange} />

        <button type="submit" style={{ marginTop: "12px" }}>Save Changes</button>
      </form>
    </div>
  );
};

export default DeveloperDashboard;
