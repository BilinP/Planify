import React, { useState, useEffect } from 'react';
import Footer from '../Footer/Footer.jsx';
import './Create.css';

const Create = () => {
    const [showOtherInput, setShowOtherInput] = useState(false);
    const [eventType, setEventType] = useState('');
    const [eventDate, setEventDate] = useState('');

    const handleEventChange = (e) => {
        const selectedEvent = e.target.value;
        setEventType(selectedEvent);
        setShowOtherInput(selectedEvent === 'other');
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
        <div className='container'>
            <div className="header">
                <div className='text'>Event Creator</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                <div className="input">
                    <img className="person" src="https://png.pngtree.com/png-clipart/20240107/original/pngtree-holiday-concept-event-on-chalkboard-play-write-drawing-photo-png-image_14048196.png" alt="" />
                    <select className="event-dropdown" value={eventType} onChange={handleEventChange}>
                        <option value="" disabled>Select Event Type</option>
                        <option value="anniversary">Anniversary</option>
                        <option value="baby-shower">Baby Shower</option>
                        <option value="birthday">Birthday</option>
                        <option value="conference">Conference</option>
                        <option value="convention">Convention</option>
                        <option value="festival">Festival</option>
                        <option value="fundraiser">Fundraiser</option>
                        <option value="gala">Gala</option>
                        <option value="meeting">Meeting</option>
                        <option value="networking">Networking</option>
                        <option value="non-profit">Non-Profit Event</option>
                        <option value="open-house">Open House</option>
                        <option value="party">Party</option>
                        <option value="performance">Performance</option>
                        <option value="professional-event">Professional Event</option>
                        <option value="retreat">Retreat</option>
                        <option value="reunion">Reunion</option>
                        <option value="screening">Screening</option>
                        <option value="seminar">Seminar</option>
                        <option value="sporting-event">Sporting Event or Competition</option>
                        <option value="tasting">Tasting</option>
                        <option value="tour">Tour</option>
                        <option value="trip">Trip</option>
                        <option value="wedding">Wedding</option>
                        <option value="workshop">Workshop or Class</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                {showOtherInput && (
                    <div className="input">
                        <input type="text" placeholder="Please specify your event type" />
                    </div>
                )}

                <div className="input">
                    <img className="email" src="https://cdn.iconscout.com/icon/free/png-256/free-email-2026367-1713640.png" alt="" />
                    <input type="email" placeholder="Email" />
                </div>

                <div className="input">
                    <img className="capacity" src="https://png.pngtree.com/png-clipart/20240107/original/pngtree-holiday-concept-event-on-chalkboard-play-write-drawing-photo-png-image_14048196.png" alt="" />
                    <input type="text" placeholder="Number of Attendee's" />
                </div>

                <div className="input">
                    <img className="date1" src="https://www.clipartmax.com/png/full/31-316421_calendar-computer-icons-clip-art-calendar-date-icon.png" alt="" />
                    <input 
                        id="dateInput" 
                        type="date" 
                        value={eventDate}
                        min={eventDate}
                        onChange={handleDateChange} 
                        placeholder="Date" 
                    />
                </div>

                <div className="createButton">
                    <div className="createBut" onClick={handleSubmit}>Create!</div>
                </div>

                <div className="agreement-checkbox">
                    <input type="checkbox" id="agreeToTerms" required />
                    <label htmlFor="agreeToTerms">I agree to the Terms and Conditions</label>
                </div>
            </div>
        </div>
    )
}

export default Create;
