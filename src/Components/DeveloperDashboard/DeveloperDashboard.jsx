// DeveloperDashboard.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../../../backend/supabaseClient";

// --- Updated Styles ---
const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "80vh",
  width: "100%",
  padding: "20px",
};

const dashboardStyle = {
  width: "1300px",
  height: "800px",
  display: "flex",
  backgroundColor: "rgba(0, 0, 0, 0.9)",
  borderRadius: "8px",
  overflow: "hidden",
};

const sidebarStyle = {
  width: "250px",
  padding: "20px",
  backgroundColor: "rgba(0, 0, 0, 1)",
  color: "white",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};

const mainContentStyle = {
  flexGrow: 1,
  padding: "40px 20px",
  color: "white",
  overflowY: "auto",
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
  cursor: "pointer",
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

// --- Popup Styles ---
const popupOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const popupContentStyle = {
  borderRadius: "8px",
  overflow: "hidden",
  position: "relative",
};

// --- Main Component ---
const DeveloperDashboard = ({ onClose }) => {
  const [events, setEvents] = useState([]);
  const [currentView, setCurrentView] = useState("overview"); // "overview", "eventManager", "edit", "transactions"
  const [editingEvent, setEditingEvent] = useState(null);

  // Disable scrolling on mount and re-enable on unmount
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

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

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setCurrentView("edit");
  };

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
      setCurrentView("overview");
      setEditingEvent(null);
    }
  };

  return (
    <div style={popupOverlayStyle} onClick={onClose}>
      <div style={popupContentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={containerStyle}>
          <div style={dashboardStyle}>
            <aside style={sidebarStyle}>
              <div>
                <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>
                  Host Panel
                </h2>
                <div
                  style={{
                    ...linkStyle,
                    backgroundColor: currentView === "overview" ? "#2563EB" : "transparent",
                    fontWeight: currentView === "overview" ? "bold" : "normal",
                  }}
                  onClick={() => { setCurrentView("overview"); setEditingEvent(null); }}
                >
                  Dashboard Overview
                </div>
                <div
                  style={{
                    ...linkStyle,
                    backgroundColor: currentView === "eventManager" ? "#2563EB" : "transparent",
                    fontWeight: currentView === "eventManager" ? "bold" : "normal",
                  }}
                  onClick={() => { setCurrentView("eventManager"); setEditingEvent(null); }}
                >
                  Event Manager
                </div>
                <div
                  style={{
                    ...linkStyle,
                    backgroundColor: currentView === "transactions" ? "#2563EB" : "transparent",
                    fontWeight: currentView === "transactions" ? "bold" : "normal",
                  }}
                  onClick={() => { setCurrentView("transactions"); setEditingEvent(null); }}
                >
                  Transactions
                </div>
                <a
                  href="https://docs.google.com/document/d/1u8i1cayhj8q4j6HUniee2QJw8GGnU1XjTmIFnUfGqvc/edit?usp=sharing"
                  style={linkStyle}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Help & Support
                </a>
              </div>
              <small style={{ color: "#ccc", fontSize: "0.75rem" }}>
                © 2025 Planify
              </small>
            </aside>

            <main style={mainContentStyle} className="main-content-custom-scroll">
              {currentView === "overview" && (
                <div>
                  <h2 style={sectionTitleStyle}>Dashboard Overview</h2>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: "20px",
                    }}
                  >
                    {events.map((event) => (
                      <div
                        key={event.event_id}
                        style={sectionBoxStyle}
                        onClick={() => handleEditEvent(event)}
                      >
                        <h3>{event.event_title}</h3>
                        <p>{event.location}</p>
                        <div>
                          <strong>Price:</strong> ${event.price ?? 0}
                        </div>
                        <div>
                          <strong>Seats Available:</strong> {event.seats ?? 0}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentView === "eventManager" && (
                <div>
                  <h2 style={sectionTitleStyle}>Manage Events</h2>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr",
                      gap: "20px",
                    }}
                  >
                    {events.map((event) => (
                      <div
                        key={event.event_id}
                        style={sectionBoxStyle}
                        onClick={() => handleEditEvent(event)}
                      >
                        <h3>{event.event_title}</h3>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentView === "transactions" && (
                <TransactionsInline />
              )}

              {currentView === "edit" && editingEvent && (
                <EventEditForm 
                  event={editingEvent} 
                  onSaveEvent={handleSaveEvent} 
                  onCancel={() => { setCurrentView("overview"); setEditingEvent(null); }}
                />
              )}
            </main>
          </div>
        </div>
      </div>
      
      <style>
        {`
          .main-content-custom-scroll::-webkit-scrollbar {
            width: 8px;
            height: 10px;
          }
          .main-content-custom-scroll::-webkit-scrollbar-track {
            background: inherit;
          }
          .main-content-custom-scroll::-webkit-scrollbar-thumb {
            background: yellow;
          }
        `}
      </style>
    </div>
  );
};

// Inline Transactions component remains unchanged
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

// EventEditForm receives the event to edit via prop and calls onSaveEvent when done.
const EventEditForm = ({ event, onSaveEvent, onCancel }) => {
  const [editedEvent, setEditedEvent] = useState({ ...event });

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
