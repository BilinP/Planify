import React, { useState, useEffect } from 'react';
import './Create.css';
import headerImage from '../../assets/header-image.webp';


const Create = () => {
    const [showOtherInput, setShowOtherInput] = useState(false);
    const [eventType, setEventType] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventTitle, setEventTitle] = useState('');
    const [eventSummary, setEventSummary] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [isOnline, setIsOnline] = useState(false);

    const handleEventChange = (e) => {
        const selectedEvent = e.target.value;
        setEventType(selectedEvent);
        setShowOtherInput(selectedEvent === 'other');
    }

    const handleLocationChange = (e) => {
        const selectedLocation = e.target.value;
        setEventType(selectedLocation);
        setIsOnline(selectedLocation === 'online');
    }

    useEffect(() => {
        // Set the min attribute to today's date for the date input
        const today = new Date().toISOString().split('T')[0];
        setEventDate(today);
    }, []);

    const handleDateChange = (e) => {
        setEventDate(e.target.value);
    }

    const handleSubmit = () => {
        // Add form submission logic here (e.g., validation, API calls)
        alert('Event created successfully!');
    }

    return (
        <div className="create-container">
            <img 
                src={headerImage}
                alt="eventBanner" 
                className="header-image" 
            />

            {/* Event Name Box */}
            <div className="event-name-box">
                <div className="event-name-header">
                    <h3>Event Title</h3>
                    <div className="underline"></div>
                    <input 
                        type="text" 
                        className="event-title-input" 
                        placeholder="Name" 
                        value={eventTitle} 
                        onChange={(e) => setEventTitle(e.target.value)} 
                    />
                </div>
            </div>

            {/* Event Date Box */}
            <div className="event-date-box">
                <div className="event-date-time">
                    <h3>Date and Time</h3>
                    <div className="underline"></div>
                    <div className="event-date">
                        <input 
                            id="dateInput" 
                            type="date" 
                            value={eventDate} 
                            min={eventDate} 
                            onChange={handleDateChange} 
                            placeholder="Date" 
                        />
                    </div>
                </div>
            </div> 

            {/* Event Location Box */}
            <div className='event-location-box'>
                <div className="event-location">
                    <h3>Location</h3>
                    <div className="underline"></div>
                    <div className="location-info">
                        <select 
                            className="location-dropdown" 
                            value={eventType} 
                            onChange={handleLocationChange}
                        >                        
                            <option value="" disabled>Select Location Type</option>
                            <option value="online">Online</option>
                            <option value="in-person">In Person</option>
                        </select>
                    </div>
                    {!isOnline && (
                        <div className="location-info">
                            <input 
                                type="text" 
                                placeholder="Event Location" 
                                value={eventLocation} 
                                onChange={(e) => setEventLocation(e.target.value)}
                                className="event-location-input"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* About Event Box */}
            <div className='about-event-box'>
                <div className='event-about'>
                    <h3>About Event</h3>
                    <div className="underline"></div>
                    <input 
                        type='text' 
                        className='event-about-input' 
                        placeholder='Description' 
                        value={eventSummary} 
                        onChange={(e) => setEventSummary(e.target.value)} 
                    />
                </div>
            </div>

            {/* Create Button Creation */}
            <div className='create-button-box'>
                <button className='create-button' onClick={handleSubmit}>Create</button>
            </div>
        </div>
    )
}

export default Create;