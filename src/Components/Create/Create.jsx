import React, { useState, useRef, useEffect } from 'react';
import StepOne from './CreateP1.jsx';
import StepTwo from './CreateP2.jsx';
import StepThree from './CreateP3.jsx';
import { supabase } from '../../../backend/supabaseClient';
import { useAuth } from '../Login_SignUp/Auth.jsx';

const Create = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        eventTitle: '',
        eventDate: '',
        eventTime: '',
        eventSummary: '',
        price: '',
        eventLocation: '',
        isOnline: false
    });

    const { authData } = useAuth();

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleChange = (input) => (e) => {
        setFormData({ ...formData, [input]: e.target.value });
    };

    const handleLocationChange = (e) => {
        setFormData({
            ...formData,
            eventLocation: "Online",
            isOnline: e.target.checked
        });
    };

    const handleSubmit = async () => {
        const eventDateTime = new Date(`${formData.eventDate}T${formData.eventTime}:00Z`);
        
        const { data, error } = await supabase
            .from('EventTable')
            .insert([
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
            ]);

        if (error) {
            console.error('Error inserting event:', error);
            alert('Failed to create event.');
        } else {
            alert('Event created successfully!');
            // Reset form fields
            setFormData({
                eventTitle: '',
                eventSummary: '',
                eventLocation: '',
                eventDate: new Date().toISOString().split('T')[0],
                price: '',
                isOnline: false
            });
            setStep(1);
        }
    };

    switch (step) {
        case 1:
            return <StepOne nextStep={nextStep} handleChange={handleChange} formData={formData} />;
        case 2:
            return <StepTwo nextStep={nextStep} prevStep={prevStep} handleChange={handleChange} handleLocationChange={handleLocationChange} formData={formData} />;
        case 3:
            return <StepThree prevStep={prevStep} formData={formData} handleSubmit={handleSubmit} />;
        default:
            return null;
    }
};

export default Create;
