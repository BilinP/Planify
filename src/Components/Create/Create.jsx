import React, { useState, useEffect, useRef } from 'react';
import './Create.css';
import headerImage from '../../assets/header-image.webp';

const Create = () => {
    const [eventDate, setEventDate] = useState('');
    const [eventTitle, setEventTitle] = useState('');
    const [eventSummary, setEventSummary] = useState('');
    const [price, setPrice] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [isOnline, setIsOnline] = useState(false);
    const fileInputRef = useRef(null);

    const handleLocationChange = (e) => {
        setIsOnline(e.target.checked);
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

    const handleSubmit = () => {
        // Add form submission logic here
        alert('Event created successfully!');
    }

    const handleCircleClick = () => {
        fileInputRef.current.click();
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    }

    return (
        <div className="create-container">
            <div className="header-image-container">
                <img 
                    src={headerImage}
                    alt="eventBanner" 
                    className="header-image" 
                />
                <div className="circle" onClick={handleCircleClick}>
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

            <div className="event-box">
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

                <div className="event-date-box">
                    <h3>Date and Time</h3>
                    <div className="underline"></div>
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
                    />
                </div>

                <div className='event-price-box'>
                    <h3>Ticket Price</h3>
                    <div className='underline'></div>
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

                <div className="event-location-box">
                    <h3>Location</h3>
                    <div className="underline"></div>
                    <div className="location-input-container">
                        <input 
                            type="text" 
                            placeholder="Event Location" 
                            value={eventLocation} 
                            onChange={(e) => setEventLocation(e.target.value)}
                            className="event-location-input"
                            disabled={isOnline}
                            style={{ backgroundColor: isOnline ? '#e0e0e0' : 'white' }}
                        />
                        <label className="online-checkbox">
                            <input 
                                type="checkbox" 
                                checked={isOnline} 
                                onChange={handleLocationChange} 
                            />
                            Online?
                        </label>
                    </div>
                </div>

                <div className='about-event-box'>
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

                <div className='create-button-box'>
                    <button className='create-button' onClick={handleSubmit}>Create</button>
                </div>
            </div>
        </div>
    );
}

export default Create;