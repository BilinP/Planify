import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { initializeApp } from "firebase/app";
import "./SignUp.css";
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

const SignUpPopup = ({ closePopup }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSignup, setIsSignup] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await user.updateProfile({ displayName: name });

      setMessage("Account created successfully!");
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Error signing up:", error);
      setMessage("Failed to create an account.");
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Google Sign Up Success:", user);
      setMessage("Account created successfully with Google!");
    } catch (error) {
      console.error("Google Sign Up Error:", error);
      setMessage("Failed to create an account with Google.");
    }
  };

  return (
    <div className="signup-overlay">
      <div className="signup-popup">
        <button className="close-btn" onClick={closePopup}>&times;</button>
        <h2>{isSignup ? "Sign Up" : "Login"}</h2>
        {isSignup ? (
          <form onSubmit={handleSubmit} className="signup-form">
            {/* Name Input Field */}
            <label htmlFor="name">Name:</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />

            {/* Email Input Field */}
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />

            {/* Password Input Field */}
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />

            <button type="submit" className="submit-btn">Create Account</button>
          </form>
        ) : (
          <form className="signup-form">
            {/* Login form content */}
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <button type="submit" className="submit-btn">Login</button>
          </form>
        )}
        <div className="google-btn">
          <button onClick={handleGoogleSignUp} className="submit-btn">
            {isSignup ? "Sign Up with Google" : "Login with Google"}
          </button>
        </div>
        {message && <p className="message">{message}</p>}
        <div className="switch-form-link">
          {isSignup ? (
            <p>
              Already have an account?{" "}
              <button type="button" onClick={() => setIsSignup(false)}>Login</button>
            </p>
          ) : (
            <p>
              Don&apos;t have an account?{" "}
              <button type="button" onClick={() => setIsSignup(true)}>Sign Up</button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
SignUpPopup.propTypes = {
  closePopup: PropTypes.func.isRequired,
};

export default SignUpPopup;
