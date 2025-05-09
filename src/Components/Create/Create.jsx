import React, { useEffect, useRef, useState } from 'react';
import {
  GoogleMap,
  Marker,
  Autocomplete
} from '@react-google-maps/api';
import './Create.css';
import { supabase } from '../../../backend/supabaseClient';
import { useAuth } from '../Login_SignUp/Auth.jsx';
import { useNavigate } from 'react-router-dom';
import GoogleMapsProvider from '../../GoogleMapsProvider.jsx';
import DeveloperDashboard from '../DeveloperDashboard/DeveloperDashboard'; // Adjust import path as needed

const Create = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    eventTitle: '',
    eventDate: '',
    eventTime: '',
    eventSummary: '',
    price: '',
    eventLocation: '',
    isOnline: false
  });
  const [tickets, setTickets] = useState([
    { ticketName: '', ticketPrice: '', ticketQuantity: '' }
  ]);
  const [location, setLocation] = useState({ lat: 37.7749, lng: -122.4194 });
  const [activeStep, setActiveStep] = useState('build');
  const autocompleteRef = useRef(null);
  const { authData } = useAuth();
  const [showDashboard, setShowDashboard] = useState(false);
  const [notification, setNotification] = useState(null);

  // Auto-dismiss notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Image upload state
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const imageInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = null;
    }
  };

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.geometry) {
      const loc = place.geometry.location;
      setLocation({ lat: loc.lat(), lng: loc.lng() });
      handleChange('eventLocation')({
        target: { value: place.formatted_address }
      });
    }
  };

  const handleLocationToggle = () => {
    handleChange('isOnline')({
      target: { value: !formData.isOnline }
    });
  };

  const handleChange = (input) => (e) => {
    setFormData({ ...formData, [input]: e.target.value });
  };

  const handleTicketChange = (index, field) => (e) => {
    const updatedTickets = [...tickets];
    updatedTickets[index][field] = e.target.value;
    setTickets(updatedTickets);
  };

  const addTicket = () => {
    setTickets([...tickets, { ticketName: '', ticketPrice: '', ticketQuantity: '' }]);
  };

  const removeTicket = (index) => {
    const updatedTickets = tickets.filter((_, i) => i !== index);
    setTickets(updatedTickets);
  };
  const handleNext = () => {
    if (activeStep === "build") setActiveStep("tickets");
    else if (activeStep === "tickets") setActiveStep("publish");
  };

  const handleBack = () => {
    if (activeStep === "publish") setActiveStep("tickets");
    else if (activeStep === "tickets") setActiveStep("build");
  };

  const handleSubmit = async () => {
    if (!authData) {
      setNotification({ message: "You need to be logged in to create an event.", type: "error" });
      return;
    }

    // Validate event details
    if (
      !formData.eventTitle ||
      formData.eventTitle.trim().toUpperCase() === "N/A" ||
      !formData.eventDate ||
      formData.eventDate.trim().toUpperCase() === "N/A" ||
      !formData.eventTime ||
      formData.eventTime.trim().toUpperCase() === "N/A" ||
      !formData.eventSummary ||
      formData.eventSummary.trim().toUpperCase() === "N/A" ||
      !formData.eventLocation ||
      formData.eventLocation.trim().toUpperCase() === "N/A"
    ) {
      setNotification({ message: "Please provide valid event title, date, time, summary, and location.", type: "error" });
      return;
    }

    // Validate tickets: each ticket must have a name and a positive quantity
    for (let i = 0; i < tickets.length; i++) {
      const ticket = tickets[i];
      if (!ticket.ticketName || ticket.ticketName.trim().toUpperCase() === "N/A") {
        setNotification({ message: `Ticket ${i + 1} must have a valid name.`, type: "error" });
        return;
      }
      if (!ticket.ticketQuantity || parseInt(ticket.ticketQuantity) <= 0) {
        setNotification({ message: `Ticket ${i + 1} must have a positive quantity.`, type: "error" });
        return;
      }
    }

    const eventDateTime = new Date(`${formData.eventDate}T${formData.eventTime}:00Z`);

    const { data, error } = await supabase.from('EventTable').insert([
      {
        event_title: formData.eventTitle,
        description: formData.eventSummary,
        location: formData.eventLocation,
        date: eventDateTime,
        create_by: authData.id,
        created_at: new Date(),
        updated_at: new Date(),
        price: parseFloat(formData.price.replace('$', ''))
      }
    ]).select();

    if (error || !data || data.length === 0) {
      console.error('Error inserting event:', error);
      setNotification({ message: "Failed to create event.", type: "error" });
      return;
    }
    console.log('Event created:', data[0].event_id);
    const eventId = data[0].event_id;

    let ticketsData = [];
    tickets.forEach(ticket => {
      const quantity = parseInt(ticket.ticketQuantity) || 0;
      for (let i = 0; i < quantity; i++) {
        ticketsData.push({
          name: ticket.ticketName,
          price: parseFloat(ticket.ticketPrice) || 0,
          created_at: new Date(),
          purchased_by: null,
          status: 'available',
          event_id: eventId
        });
      }
    });

    const { error: ticketError } = await supabase
      .from('Ticket')
      .insert(ticketsData);

    if (ticketError) {
      console.error('Error inserting tickets:', ticketError);
      setNotification({ message: "Event created but failed to add tickets.", type: "error" });
      return;
    }

    setNotification({ message: "Event created successfully!", type: "success" });

    setFormData({
      eventTitle: '',
      eventDate: '',
      eventTime: '',
      eventSummary: '',
      price: '',
      eventLocation: '',
      isOnline: false
    });
    setTickets([{ ticketName: '', ticketPrice: '', ticketQuantity: '' }]);
    setImageFile(null);
    setImagePreview(null);
    setActiveStep('build');
  };

  return (
    <div className="event-page">
      {notification && (
        <div className={`popup-notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
      <aside className="sidebar">
        <button className="back-button" onClick={() => navigate('/Event')}>← Find events</button>
        {authData && (
          <button 
            className="dashboard-button" 
            onClick={() => setShowDashboard(true)}
          >
            Dashboard
          </button>
        )}
        <ul className="steps">
          <li className={activeStep === 'build' ? 'active' : ''} onClick={() => setActiveStep('build')}>
            Build event page
          </li>
          <li className={activeStep === 'tickets' ? 'active' : ''} onClick={() => setActiveStep('tickets')}>
            Add tickets
          </li>
          <li className={activeStep === 'publish' ? 'active' : ''} onClick={() => setActiveStep('publish')}>
            Publish
          </li>
        </ul>
      </aside>

      <main className="form-content">
        {activeStep === 'build' && (
          <>
            <div className="banner-image">
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="uploaded-banner" />
                  <button className="remove-image-button" onClick={handleRemoveImage}>✕ Remove Image</button>
                </>
              ) : (
                <label htmlFor="imageUpload" className="image-upload">📤 Upload photos and video</label>
              )}
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={handleImageChange}
                ref={imageInputRef}
                style={{ display: 'none' }}
              />
            </div>

              <section className="form-section">
                <h2>Event Overview</h2>
                <div className="form-group">
                  <label htmlFor="title">Event title</label>
                  <input
                    type="text"
                    id="title"
                    placeholder="Event title"
                    value={formData.eventTitle}
                    onChange={handleChange('eventTitle')}
                  />
                </div>
  
                <div className="form-group">
                  <label htmlFor="eventDate">Event Date</label>
                  <input
                    type="date"
                    id="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange('eventDate')}
                  />
                </div>
  
                <div className="form-group">
                  <label htmlFor="eventTime">Event Time</label>
                  <input
                    type="time"
                    id="eventTime"
                    value={formData.eventTime}
                    onChange={handleChange('eventTime')}
                  />
                </div>
  
                <div className="form-group">
                  <label htmlFor="summary">Summary</label>
                  <textarea
                    id="summary"
                    rows="3"
                    placeholder="Grab people’s attention with a short description..."
                    value={formData.eventSummary}
                    onChange={handleChange('eventSummary')}
                  />
                </div>
              </section>
  
              <section className="form-section">
                <div className="switch_box">
                  <input
                    type="checkbox"
                    id="isOnline"
                    checked={formData.isOnline}
                    onChange={handleLocationToggle}
                    className="switch_1"
                  />
                  <label htmlFor="isOnline" style={{ marginLeft: '8px' }}>
                    Online Event?
                  </label>
                </div>
  
                
                  {!formData.isOnline && (
                    <GoogleMapsProvider>
                    <>
                      <h2>Event Location</h2>
                      <Autocomplete
                        key={formData.isOnline ? 'hidden' : 'shown'}
                        onLoad={(ref) => (autocompleteRef.current = ref)}
                        onPlaceChanged={handlePlaceSelect}
                      >
                        <input
                          type="text"
                          placeholder="Enter event address"
                          value={formData.eventLocation || ''}
                          onChange={handleChange('eventLocation')}
                          className="location-input"
                        />
                      </Autocomplete>
  
                      <GoogleMap
                        center={location}
                        zoom={14}
                        mapContainerStyle={{
                          width: '100%',
                          height: '300px',
                          marginTop: '20px',
                          borderRadius: '10px'
                        }}
                      >
                        <Marker position={location} />
                      </GoogleMap>
                    </>
                    </GoogleMapsProvider>
                  )}
              </section>
            </>
          )}
  
          {activeStep === 'tickets' && (
            <section className="form-section">
              <h2>Ticket Details</h2>
              {tickets.map((ticket, index) => (
                <div key={index} className="ticket-group">
                  <div className="form-group">
                    <label>Ticket Name</label>
                    <input
                      type="text"
                      placeholder="General Admission"
                      value={ticket.ticketName}
                      onChange={handleTicketChange(index, 'ticketName')}
                    />
                  </div>
                  <div className="form-group">
                    <label>Price ($)</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={ticket.ticketPrice}
                      onChange={handleTicketChange(index, 'ticketPrice')}
                    />
                  </div>
                  <div className="form-group">
                    <label>Quantity</label>
                    <input
                      type="number"
                      placeholder="100"
                      value={ticket.ticketQuantity}
                      onChange={handleTicketChange(index, 'ticketQuantity')}
                    />
                  </div>
                  {tickets.length > 1 && (
                    <button onClick={() => removeTicket(index)} className="remove-ticket-button">
                      ✕ Remove Ticket
                    </button>
                  )}
                </div>
              ))}
              <button onClick={addTicket} className="add-ticket-button">
                ＋ Add another ticket
              </button>
            </section>
          )}
  
          {activeStep === 'publish' && (
            <section className="form-section publish-review">
              <h2>Review & Publish</h2>
  
              <div className="review-grid">
                <div className="review-box">
                  <h3>Event Details</h3>
                  <p><strong>Title:</strong> {formData.eventTitle || 'N/A'}</p>
                  <p><strong>Date:</strong> {formData.eventDate || 'N/A'}</p>
                  <p><strong>Time:</strong> {formData.eventTime || 'N/A'}</p>
                  <p><strong>Summary:</strong> {formData.eventSummary || 'N/A'}</p>
                  <p><strong>Location:</strong> {formData.isOnline ? 'Online Event' : (formData.eventLocation || 'N/A')}</p>
  
                  {imagePreview && (
                    <div style={{ marginTop: '20px' }}>
                      <p><strong>Banner Preview:</strong></p>
                      <img src={imagePreview} alt="Banner" style={{ width: '100%', borderRadius: '8px' }} />
                    </div>
                  )}
                </div>
  
                <div className="review-box">
                  <h3>Tickets</h3>
                  {tickets.length === 0 ? (
                    <p>No tickets added.</p>
                  ) : (
                    tickets.map((ticket, index) => (
                      <div key={index} className="ticket-review">
                        <h4>Ticket {index + 1}</h4>
                        <p><strong>Name:</strong> {ticket.ticketName || 'N/A'}</p>
                        <p><strong>Price:</strong> ${ticket.ticketPrice || '0.00'}</p>
                        <p><strong>Quantity:</strong> {ticket.ticketQuantity || '0'}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
  

            </section>
          )}
        <div className="nav-buttons">
          {activeStep !== "build" && (
            <button className="button-89 back-btn" onClick={handleBack}>Back</button>
          )}
          {activeStep !== "publish" ? (
            <button className="button-89 next-btn" onClick={handleNext}>Next</button>
          ) : (
            <button className="button-89 create-btn" onClick={handleSubmit}>Create Event</button>
          )}
        </div>
      </main>

      {/* Conditionally render the Dev Dashboard popup */}
      {showDashboard && (
        <DeveloperDashboard onClose={() => setShowDashboard(false)} />
      )}
    </div>
  );
};

export default Create;
