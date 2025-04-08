import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript, Marker, Autocomplete } from "@react-google-maps/api";
import "./CreateP1.css";

const MAPS_API_KEY = "AIzaSyCYfvhB48e0BxMfAdZNgs739UOm6qkDgzI"; // Replace with your API key

const mapContainerStyle = {
    width: "100%",
    height: "300px",
};

const center = { lat: 34.2407, lng: 118.5300 }; 

const CreateP2 = ({ nextStep, prevStep, handleChange, handleLocationChange, formData }) => {
    const [map, setMap] = useState(null);
    const [location, setLocation] = useState(center);
    const autocompleteRef = useRef(null);

    useEffect(() => {
        if (formData.eventLocation) {
            geocodeAddress(formData.eventLocation);
        }
    }, [formData.eventLocation]);

    // Function to get lat/lng from address
    const geocodeAddress = (address) => {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address }, (results, status) => {
            if (status === "OK" && results[0]) {
                const newLocation = results[0].geometry.location;
                setLocation({ lat: newLocation.lat(), lng: newLocation.lng() });
            }
        });
    };

    // Handle place selection from Google Autocomplete
    const handlePlaceSelect = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (place.geometry) {
                const newLocation = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                };
                setLocation(newLocation);
                handleChange("eventLocation")({ target: { value: place.formatted_address } });
            }
        }
    };

    return (
        <div className="step-two-container">
            <h2>Location</h2>

            <LoadScript googleMapsApiKey={MAPS_API_KEY} libraries={["places"]}>
                <Autocomplete
                    onLoad={(autoC) => (autocompleteRef.current = autoC)}
                    onPlaceChanged={handlePlaceSelect}
                >
                    <input
                        type="text"
                        placeholder="Event Location"
                        value={formData.eventLocation}
                        onChange={handleChange("eventLocation")}
                        className="create-event-location-input"
                        disabled={formData.isOnline}
                        style={{ backgroundColor: formData.isOnline ? "#e0e0e0" : "white" }}
                    />
                </Autocomplete>

                {!formData.isOnline && (
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={location}
                        zoom={14}
                        onLoad={(map) => setMap(map)}
                    >
                        <Marker position={location} />
                    </GoogleMap>
                )}
            </LoadScript>

            <div className="create-online-checkbox">
                <input type="checkbox" checked={formData.isOnline} onChange={handleLocationChange} />
                <label>Online?</label>
            </div>

            <button onClick={prevStep}>Back</button>
            <button onClick={nextStep}>Next</button>
        </div>
    );
};

export default CreateP2;
