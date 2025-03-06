import React from 'react';
import './CreateP1.css';

const CreateP2 = ({ nextStep, prevStep, handleChange, handleLocationChange, formData }) => {
    return (
        <div className="step-two-container">
            <h2>Event Location</h2>
            <input 
                type="text" 
                placeholder="Event Location" 
                value={formData.eventLocation} 
                onChange={handleChange('eventLocation')}
                className="create-event-location-input"
                disabled={formData.isOnline}
                style={{ backgroundColor: formData.isOnline ? '#e0e0e0' : 'white' }}
            />

            <div className="create-online-checkbox">
                <input 
                    type="checkbox" 
                    checked={formData.isOnline} 
                    onChange={handleLocationChange} 
                />
                <label>Online?</label>
            </div>
            
            <button onClick={prevStep}>Back</button>
            <button onClick={nextStep}>Next</button>
        </div>
    );
};

export default CreateP2;