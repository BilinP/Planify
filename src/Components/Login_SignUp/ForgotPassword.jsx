import React, { useState } from "react";
import "./ForgotPassword.css";
import PropTypes from "prop-types";
import { supabase } from "../../../backend/supabaseClient";

const ForgotPasswordPopup = ({ closePopup, isResetMode = false }) => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isResetMode) {
      // Forgot Password: send the reset link email.
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin 
      });
      if (!error) {
        setMessage("Password reset email sent via Supabase!");
        setEmail("");
      } else {
        console.error("Error sending reset email:", error);
        setMessage("Error sending reset email.");
      }
    } else {
      // Reset Password: update the user's password.
      if (newPassword !== confirmPassword) {
        setMessage("Passwords do not match!");
        return;
      }
      const { data, error } = await supabase.auth.updateUser({ password: newPassword });
      if (!error) {
        setMessage("Password updated successfully!");
      } else {
        setMessage("Error updating password.");
      }
    }
  };

  return (
    <div className="forgot-password-overlay" onClick={closePopup}>
      <div className="forgot-password-popup" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={closePopup}>
          &times;
        </button>
        <h2>{isResetMode ? "Reset Password" : "Forgot Password"}</h2>
        <form onSubmit={handleSubmit} className="forgot-password-form">
          {!isResetMode ? (
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
          ) : (
            <>
              <label>
                New Password:
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
              </label>
              <label>
                Confirm Password:
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
              </label>
            </>
          )}
          <button type="submit" className="submit-btn">
            {isResetMode ? "Update Password" : "Send Reset Link"}
          </button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

ForgotPasswordPopup.propTypes = {
  closePopup: PropTypes.func.isRequired,
  isResetMode: PropTypes.bool
};

export default ForgotPasswordPopup;