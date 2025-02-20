import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { initializeApp } from "firebase/app";
import "./ForgotPassword.css";
import PropTypes from 'prop-types';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const ForgotPasswordPopup = ({ closePopup }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent!");
      setEmail(""); // Clear the email field
      closePopup();
    } catch (error) {
      console.error("Error sending password reset email:", error);
      setMessage("Failed to send password reset email.");
    }
  };

  return (
    <div className="forgot-password-overlay" onClick={closePopup}>
      <div className="forgot-password-popup" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={closePopup}>&times;</button>
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit} className="forgot-password-form">
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
            />
          </label>
          <button type="submit" className="submit-btn">Send Reset Link</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};
ForgotPasswordPopup.propTypes = {
  closePopup: PropTypes.func.isRequired,
};

export default ForgotPasswordPopup;
