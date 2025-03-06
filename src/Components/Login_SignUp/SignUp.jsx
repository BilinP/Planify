import { useState } from "react";
import PropTypes from "prop-types";
import { useAuth } from "./Auth.jsx";
import "./SignUp.css";

const SignUp = ({ togglePopup }) => {
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthday, setBirthday] = useState("");
  const [message, setMessage] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    const displayName = `${firstName} ${lastName}`;
    const success = await signUp(email, password, {
      displayName,
      phoneNumber,
      birthday,
    });
    if (success) {
      setMessage(`Welcome, ${email}!`);
      togglePopup();
    } else {
      setMessage("Sign up failed. Please check your details.");
    }
  };

  return (
    <form className="signup-form" onSubmit={handleSignUp}>
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


      <label>Phone Number:</label>
      <input
        type="text"
        placeholder="Enter phone number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
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

      <div className="checkbox-container styled-checkbox">
        <input type="checkbox" required />
        <label>I agree to the terms and conditions</label>
      </div>

      <button type="submit" className="submit-btn">
        Sign Up
      </button>

      {message && <p className="message">{message}</p>}
    </form>
  );
};

SignUp.propTypes = {
  togglePopup: PropTypes.func.isRequired,
};

export default SignUp;
