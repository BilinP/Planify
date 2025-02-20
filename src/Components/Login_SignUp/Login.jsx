import { useState } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { initializeApp } from "firebase/app";
import ForgotPasswordPopup from "./ForgotPassword";
import { supabase } from "../../../backend/supabaseClient.js";
import "./Login.css";
import PropTypes from "prop-types";
import { useAuth } from "./Auth.jsx";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const LoginPopup = ({ isOpen, togglePopup }) => {
  const { login } = useAuth();
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false); // Manage toggle between login and signup
  const [message, setMessage] = useState("");

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Google Login Success:", user);
      setMessage(`Welcome, ${user.displayName}!`);
      togglePopup();
    } catch (error) {
      console.error("Google Login Error:", error);
      setMessage("Google login failed.");
    }
  };

  const handleSwitchToSignup = () => {
    setIsSignup(true); // Switch to signup form
  };

  const handleSwitchToLogin = () => {
    setIsSignup(false); // Switch back to login form
  };

  return (
    isOpen && (
      <div className="popup-overlay">
        <div className="popup">
          <button className="close-btn" onClick={togglePopup}>
            &times;
          </button>
          <h2>{isSignup ? "Sign Up" : "Login"}</h2>

          <form className="login-form">
            {/* Render login form if isSignup is false */}
            {!isSignup && (
              <>
                <label>Email:</label>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <label>Password:</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <div className="checkbox-forgot-container">
                  <div className="remember-me-container">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                    />
                    <label>Remember me</label>
                  </div>
                  <button
                    type="button"
                    className="forgot-password-btn"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot Password?
                  </button>
                </div>
              </>
            )}

            {/* Render signup form if isSignup is true */}
            {isSignup && (
              <>
                <label>First Name:</label>
                <input
                  type="text"
                  placeholder="Enter first name"
                  required
                />

                <label>Last Name:</label>
                <input
                  type="text"
                  placeholder="Enter last name"
                  required
                />

                <label>Username:</label>
                <input
                  type="text"
                  placeholder="Enter username"
                  required
                />

                <label>Phone Number:</label>
                <input
                  type="text"
                  placeholder="Enter phone number"
                  required
                />

                <label>Birthday:</label>
                <input
                  type="date"
                  required
                />

                <label>Email:</label>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <label>Password:</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <div className="checkbox-forgot-container">
                  <div className="remember-me-container">
                    <input
                      type="checkbox"
                    />
                    <label>I agree to the terms and conditions</label>
                  </div>
                </div>
              </>
            )}

            <button type="submit" className="submit-btn">
              {isSignup ? "Sign Up" : "Login"}
            </button>

            <button className="google-signin-btn" onClick={handleGoogleLogin}>
              {isSignup ? "Sign Up with Google" : "Login with Google"}
            </button>
          </form>

          {message && <p className="message">{message}</p>}

          <div className="switch-form-link">
            <p>
              {isSignup ? (
                <>
                  Already have an account?{" "}
                  <button type="button" onClick={handleSwitchToLogin}>
                    Login
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{" "}
                  <button type="button" onClick={handleSwitchToSignup}>
                    Sign Up
                  </button>
                </>
              )}
            </p>
          </div>
        </div>

        {showForgotPassword && (
          <ForgotPasswordPopup closePopup={() => setShowForgotPassword(false)} />
        )}
      </div>
    )
  );
};

LoginPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  togglePopup: PropTypes.func.isRequired,
};

export default LoginPopup;
