import React from 'react';
import './CreateP1.css';


const CreateP3 = ({ prevStep, formData, handleSubmit }) => {
    return (
        <div className="step-three-container">
            <h2>Review and Confirm</h2>
            <ul>
                <li><strong>Event Title:</strong> {formData.eventTitle}</li>
                <li><strong>Date:</strong> {formData.eventDate}</li>
                <li><strong>Time:</strong> {formData.eventTime}</li>
                <li><strong>Summary:</strong> {formData.eventSummary}</li>
                <li><strong>Price:</strong> {formData.price}</li>
                <li><strong>Location:</strong> {formData.isOnline ? "Online" : formData.eventLocation}</li>
            </ul>
            <button onClick={prevStep}>Back</button>
            <button onClick={handleSubmit}>Create Event</button>
        </div>
    );
};

export default CreateP3;
