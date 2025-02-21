import { useState } from "react";
import ForgotPasswordPopup from "./ForgotPassword";
import SignUp from "./SignUp";
import "./Login.css";
import PropTypes from "prop-types";
import { useAuth } from "./Auth.jsx";

const LoginPopup = ({ isOpen, togglePopup }) => {
  const { login, loginWithGoogle } = useAuth();
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false); // Manage toggle between login and signup
  const [message, setMessage] = useState("");

  const handleGoogleLogin = async () => {
    const success = await loginWithGoogle();
    if (success) {
      setMessage("Welcome!");
      togglePopup();
    } else {
      setMessage("Google login failed.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login(email, password, rememberMe);
    if (success) {
      setMessage(`Welcome, ${email}!`);
      togglePopup();
    } else {
      setMessage("Login failed. Please check your credentials.");
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

          {isSignup ? (
            <SignUp togglePopup={togglePopup} />
          ) : (
            <form className="login-form" onSubmit={handleLogin}>
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

              <button type="submit" className="submit-btn">
                Login
              </button>

              <button
                type="button"
                className="google-signin-btn"
                onClick={handleGoogleLogin}
              >
                Login with Google
              </button>
            </form>
          )}

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

          {showForgotPassword && (
            <ForgotPasswordPopup
              closePopup={() => setShowForgotPassword(false)}
            />
          )}
        </div>
      </div>
    )
  );
};

LoginPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  togglePopup: PropTypes.func.isRequired,
};

export default LoginPopup;