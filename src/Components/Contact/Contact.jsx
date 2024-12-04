import { useEffect, useState } from 'react';
import { useAuth } from '../Login_SignUp/Auth.jsx';
import { supabase } from '../../../backend/supabaseClient.js';
import './Contact.css';

const Contact = () => {
    const { authData } = useAuth();
    const [userData, setUserData] = useState(null);
    const [image, setImage] = useState(null);
  
    useEffect(() => {
      const fetchUserData = async () => {
        if (authData) {
          const { data, error } = await supabase
            .from('profile') 
            .select('*')
            .eq('user_id', authData.id)
            .single();
  
          if (error) {
            console.error('Error fetching user data:', error);
          } else {
            setUserData(data);
          }
        }
      };
  
      fetchUserData();
    }, [authData]);

    // Handler for file input change
    const handleImageUpload = (e) => {
        const file = e.target.files[0]; // Get the selected file
        if (file) {
            // Create a URL for the image to display it
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl); // Update the state with the image URL
        }
    };

    // Handler to remove the profile picture
    const removeProfilePicture = () => {
        setImage(null); // Set image state back to null to remove the profile picture
    };

    if (!userData) {
        return <div>Loading...</div>;
      }

    return (
        <div className="contact-container">
            {/* Background box behind the grid */}
            <div className="background-box"></div>

            {/* Heading and Description */}
            <div className="info-header">
                <h2 className="info-title">Personal Information</h2>
                <p className="info-description">
                    Manage your personal information, including phone numbers and email addresses where you can be connected.
                </p>
            </div>

            {/* Profile Circle */}
            <div className="profile-circle">
                {/* If there's an image, show it, otherwise show a default empty circle */}
                {image ? (
                    <img src={image} alt="Profile" className="profile-img" />
                ) : (
                    <span className="profile-placeholder">+</span>
                )}
            </div>

            {/* User Info: Name and Email Display under the Profile Circle */}
            <div className="user-info">
                <h2 className="user-name">{userData.name}</h2>
                <p className="user-email">{userData.email}</p>
            </div>

            {/* File Input for Image Upload */}
            <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="file-input"
            />

            {/* Button to Remove Profile Picture */}
            {image && (
                <button className="btn remove-btn" onClick={removeProfilePicture}>
                    Remove Profile Picture
                </button>
            )}

            {/* 2x2 grid of boxes */}
            <div className="container">
                <div className="box">
                    <p className="box-label">Name:</p>
                    <p className="box-value">{userData.name}</p>
                </div>
                <div className="box">
                    <p className="box-label">Date of Birth:</p>
                    <p className="box-value">{userData.dob}</p>
                </div>
                <div className="box">
                    <p className="box-label">Country:</p>
                    <p className="box-value">{userData.country}</p>
                </div>
                <div className="box">
                    <p className="box-label">Language:</p>
                    <p className="box-value">{userData.language}</p>
                </div>
                <div className="box">
                    <p className="box-label">Email:</p>
                    <p className="box-value">{userData.email}</p>
                </div>
            </div>

            {/* Buttons for Personal Information, Billing, Order History */}
            <div className="button-container">
                <button className="btn">Personal Information</button>
                <button className="btn">Billing</button>
                <button className="btn">Order History</button>
            </div>
        </div>
    );
};

export default Contact;
