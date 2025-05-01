import React, { useState } from "react";
import "./ForgotPassword.css";
import PropTypes from 'prop-types';
import { supabase } from '../../../backend/supabaseClient';



const ForgotPasswordPopup = ({ closePopup }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin, 
    });

    if (!error) {
      setMessage("Password reset email sent via Supabase!");
      setEmail(""); 
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
