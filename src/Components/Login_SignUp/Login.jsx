import  { useState } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { initializeApp } from "firebase/app";
import ForgotPasswordPopup from "./ForgotPassword"; 
import "./Login.css";
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
const provider = new GoogleAuthProvider();

const LoginPopup = ({ isOpen, togglePopup }) => {
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false); // State for showing forgot password popup
  const [isSignup, setIsSignup] = useState(false); // State to toggle between login and signup forms

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Google Login Success:", user);
      alert(`Welcome, ${user.displayName}!`);
      togglePopup(); // Close the popup
    } catch (error) {
      console.error("Google Login Error:", error);
      alert("Google login failed.");
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in with:", email, password, rememberMe);
    togglePopup(); // Close the popup after login
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true); // Show the forgot password popup
  };

  const handleSignUpClick = () => {
    setIsSignup(true); // Switch to the sign-up form
  };

  const handleBackToLogin = () => {
    setIsSignup(false); // Switch back to the login form
  };

  const closeForgotPasswordPopup = () => {
    setShowForgotPassword(false); // Close the forgot password popup
  };

  return (
    isOpen && (
      <div className="popup-overlay">
        <div className="popup">
          <button className="close-btn" onClick={togglePopup}>
            &times;
          </button>
          <h2>{isSignup ? "Sign Up" : "Login"}</h2>
          {!isSignup ? (
            <form className="login-form" onSubmit={handleLogin}>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <label>
                Password:
                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
              <div className="checkbox-forgot-container">
                <div className="remember-me-container">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <span>Remember me</span>
                </div>
                <button
                  type="button"
                  className="forgot-password-btn"
                  onClick={handleForgotPassword}
                >
                  Forgot Password?
                </button>
              </div>
              <button type="submit" className="submit-btn">Login</button>
            </form>
          ) : (
            <form className="login-form">
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <label>
                Password:
                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
              <button type="submit" className="submit-btn">Sign Up</button>
            </form>
          )}
          <div className="google-btn">
            <button className="submit-btn" onClick={handleGoogleLogin}>
              Login with Google
            </button>
          </div>
          <div className="switch-form-link">
            {isSignup ? (
              <p>
                Already have an account?{" "}
                <button type="button" onClick={handleBackToLogin}>
                  Login
                </button>
              </p>
            ) : (
              <p>
                Don&apos;t have an account?{" "}
                <button type="button" onClick={handleSignUpClick}>
                  Sign Up
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Conditionally render ForgotPasswordPopup */}
        {showForgotPassword && <ForgotPasswordPopup closePopup={closeForgotPasswordPopup} />}
      </div>
    )
  );
};
LoginPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  togglePopup: PropTypes.func.isRequired,
  setShowSignUpPopup: PropTypes.func.isRequired,
};

export default LoginPopup;
