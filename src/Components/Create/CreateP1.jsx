import React from 'react';
import './CreateP1.css';

const CreateP1 = ({ nextStep, handleChange, formData }) => {
    return (
        <div className="step-one-container">
            <h2>Details</h2>
            <input
                type="text"
                placeholder="Event Title"
                value={formData.eventTitle}
                onChange={handleChange('eventTitle')}
            />
            <input
                type="date"
                value={formData.eventDate}
                onChange={handleChange('eventDate')}
                min={new Date().toISOString().split('T')[0]}
            />
            <input
                type="time"
                value={formData.eventTime}
                onChange={handleChange('eventTime')}
            />
            <input
                type="text"
                placeholder="Event Summary"
                value={formData.eventSummary}
                onChange={handleChange('eventSummary')}
            />
            <input
                type="text"
                placeholder="Ticket Price"
                value={formData.price}
                onChange={handleChange('price')}
            />
            <button onClick={nextStep}>Next</button>
        </div>
    );
};

export default CreateP1;
