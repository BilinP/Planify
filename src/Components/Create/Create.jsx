import React, { useState, useEffect, useRef } from 'react';
import './Create.css';
import headerImage from '../../assets/header-image.webp';
import { supabase } from '../../../backend/supabaseClient';
import { useAuth } from '../Login_SignUp/Auth.jsx';

const Create = () => {
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [eventTitle, setEventTitle] = useState('');
    const [eventSummary, setEventSummary] = useState('');
    const [price, setPrice] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [isOnline, setIsOnline] = useState(false);
    const fileInputRef = useRef(null);
    const { authData } = useAuth();

    const handleEventChange = (e) => {
        const selectedEvent = e.target.value;
        setEventType(selectedEvent);
        setShowOtherInput(selectedEvent === 'other');
    }


    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setEventDate(today);
    }, []);

    const handleDateChange = (e) => {
        setEventDate(e.target.value);
    }

    const handlePriceChange = (e) => {
        let value = e.target.value;

        value = value.replace(/[^0-9.]/g, '');

        const parts = value.split('.');
        if (parts.length > 2) {
            return;
        }

        if (parts.length === 2 && parts[1].length > 2) {
            return;
        }

        setPrice(value ? `$${value}` : '');
    };

    const handleFocus = () => {
        if (price.startsWith('$')) {
            setPrice(price.slice(1));
        }
    };

    const handleBlur = () => {
        if (price !== '' && !isNaN(price)) {
            const formattedValue = parseFloat(price).toFixed(2);
            setPrice(`$${formattedValue}`);
        }
    };

    const handleLocationChange = (e) => {
        setEventLocation("Online");
        setIsOnline(e.target.checked);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const eventDateTime = new Date(`${eventDate}T${eventTime}:00Z`);
        
        const { data, error } = await supabase
            .from('EventTable')
            .insert([
                {
                    event_title: eventTitle,
                    description: eventSummary,
                    location: eventLocation,
                    date: eventDateTime,
                    create_by: authData.id, // Replace with actual user ID
                    created_at: new Date(),
                    updated_at: new Date(),
                    price: parseFloat(price.replace('$', ''))
                }
            ]);

        if (error) {
            console.error('Error inserting event:', error);
            alert('Failed to create event.');
        } else {
            alert('Event created successfully!');
            // Reset form fields
            setEventTitle('');
            setEventSummary('');
            setEventLocation('');
            setEventDate(new Date().toISOString().split('T')[0]);
            setPrice('');
            setIsOnline(false);
        }
    }

    const handleCircleClick = () => {
        fileInputRef.current.click();
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                // Update the header image with the new image
                setImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    }

    return (
        <div className="create-page-container">
            <div className="create-header-image-container">
                <img 
                    src={headerImage}
                    alt="eventBanner" 
                    className="create-header-image" 
                />
                <div className="create-circle" onClick={handleCircleClick}>
                    <input 
                        type="file" 
                        accept="image/*" 
                        ref={fileInputRef} 
                        style={{ display: 'none' }} 
                        onChange={handleFileChange} 
                    />
                    <span>+</span>
                </div>
            </div>

            <div className="create-event-box">
                <div className="create-event-name-header">
                    <h3>Event Title</h3>
                    <div className="create-underline"></div>
                    <input 
                        type="text" 
                        className="create-event-title-input" 
                        placeholder="Name" 
                        value={eventTitle} 
                        onChange={(e) => setEventTitle(e.target.value)} 
                    />
                </div>

                <div className="create-event-date-box">
                    <h3>Date and Time</h3>
                    <div className="create-underline"></div>
                    <input 
                        id="dateInput" 
                        type="date" 
                        value={eventDate} 
                        min={eventDate} 
                        onChange={handleDateChange} 
                        placeholder="Date" 
                    />

                    <input
                    id="timeInput"
                    type="time"
                    placeholder='Time'
                    onChange={(e) => setEventTime(e.target.value)} 
                    />
                </div>

                <div className='create-event-price-box'>
                    <h3>Ticket Price</h3>
                    <div className='create-underline'></div>
                    <input
                        id='priceInput'
                        type="text"
                        placeholder='Price'
                        value={price}
                        onChange={handlePriceChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />                   
                </div>

                <div className="create-event-location-box">
                    <h3>Location</h3>
                    <div className="create-underline"></div>
                    <div className="create-location-input-container">
                        <input 
                            type="text" 
                            placeholder="Event Location" 
                            value={eventLocation} 
                            onChange={(e) => setEventLocation(e.target.value)}
                            className="create-event-location-input"
                            disabled={isOnline}
                            style={{ backgroundColor: isOnline ? '#e0e0e0' : 'white' }}
                        />

                        <div className="create-online-checkbox">
                            <input 
                                type="checkbox" 
                                checked={isOnline} 
                                onChange={handleLocationChange} 
                            />
                            <label>Online?</label>
                        </div>
                    </div>
                </div>

                <div className='create-about-event-box'>
                    <h3>About Event</h3>
                    <div className="create-underline"></div>
                    <input 
                        type='text' 
                        className='create-event-about-input' 
                        placeholder='Description' 
                        value={eventSummary} 
                        onChange={(e) => setEventSummary(e.target.value)} 
                    />
                </div>

                <div className='create-button-box'>
                    <button className='create-button' onClick={handleSubmit}>Create</button>
                </div>
            </div>
        </div>
    );
}

export default Create;