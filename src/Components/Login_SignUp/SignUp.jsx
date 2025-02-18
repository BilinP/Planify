import { useState } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { initializeApp } from "firebase/app";
import "./Signup.css";
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

const SignupPopup = ({ isOpen, togglePopup }) => {
  const { signup } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSignup, setIsSignup] = useState(true);
  const [message, setMessage] = useState("");

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Google Signup Success:", user);
      setMessage(`Welcome, ${user.displayName}!`);
      togglePopup();
    } catch (error) {
      console.error("Google Signup Error:", error);
      setMessage("Google signup failed.");
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      setMessage("You must agree to the terms and conditions.");
      return;
    }
    // Add your signup logic here, for example, using Supabase or Firebase
    setMessage("Signup Successful!");
    togglePopup();
  };

  return (
    isOpen && (
      <div className="popup-overlay">
        <div className="popup">
          <button className="close-btn" onClick={togglePopup}>
            &times;
          </button>
          <h2>Sign Up</h2>

          <form className="signup-form" onSubmit={handleSignup}>
            <label>First Name:</label>
            <input
              type="text"
              placeholder="Enter first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />

            <label>Last Name:</label>
            <input
              type="text"
              placeholder="Enter last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />

            <label>Username:</label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <label>Phone Number:</label>
            <input
              type="text"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <label>Birthday:</label>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
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

            <div className="checkbox-container">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
              />
              <label>I agree to the terms and conditions</label>
            </div>

            <button type="submit" className="submit-btn">
              Sign Up
            </button>

            <button className="google-signin-btn" onClick={handleGoogleSignup}>
              Sign Up with Google
            </button>
          </form>

          {message && <p className="message">{message}</p>}

          <div className="switch-form-link">
            <p>
              Already have an account?{" "}
              <button type="button" onClick={() => setIsSignup(false)}>
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    )
  );
};

SignupPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  togglePopup: PropTypes.func.isRequired,
};

export default SignupPopup;
