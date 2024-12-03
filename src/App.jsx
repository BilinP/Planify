import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";

import Footer from "./Components/Footer/Footer.jsx";
import Navbar from "./Components/Navbar/Navbar.jsx";
import Create from "./Components/Create/Create.jsx";
import NotFoundPage from "./Components/404/NotFoundPage.jsx";
import Account from "./Components/Account/Account.jsx";
import OrderHistory from "./Components/Account/OrderHistory.jsx";
import Cart from "./Components/Cart/Cart.jsx";
import Contact from "./Components/Contact/Contact.jsx";
import FindEvent from "./Components/Event/EventPage.jsx";
import ForgotPasswordPopup from "./Components/Login_SignUp/ForgotPassword.jsx";
import LoginPopup from "./Components/Login_SignUp/Login.jsx";
import SignUpPopup from "./Components/Login_SignUp/SignUp.jsx";
import About from "./Components/About/About.jsx";
import Home from "./Components/Home/Home.jsx";
import EventPage from './Components/Event/EventPage';



function App() {
  // States
  const [cartItems, setCartItems] = useState(1); // Cart item counter
  const [isLoginVisible, setIsLoginVisible] = useState(false); // Login popup visibility
  const [isSignUpVisible, setIsSignUpVisible] = useState(false); // Sign Up popup visibility
  const [isForgotPasswordVisible, setIsForgotPasswordVisible] = useState(false); // Forgot Password popup

  // Popup Handlers
  const openLoginPopup = () => {
    setIsLoginVisible(true);
    setIsSignUpVisible(false);
    setIsForgotPasswordVisible(false);
  };

  const openSignUpPopup = () => {
    setIsLoginVisible(false);
    setIsSignUpVisible(true); 
    setIsForgotPasswordVisible(false);
  };

  const openForgotPasswordPopup = () => {
    setIsLoginVisible(false);
    setIsSignUpVisible(false);
    setIsForgotPasswordVisible(true);
  };

  const closeAllPopups = () => {
    setIsLoginVisible(false);
    setIsSignUpVisible(false);
    setIsForgotPasswordVisible(false);
  };



  const events = [
    {
      id: 1,
      image: 'path-to-image.jpg', // Use the image file path
      title: 'Work, Bitch',
      price: 12.51,
      date: 'Saturday, January 25 • 7:00 PM',
      host: 'Elissa Marcus',
      description: 'Join us for a spectacular collection of spooky, hilarious sketches...',
      reviews: 'Great event! Fun and spooky.',
    }
  ];

  const location = useLocation();
  const validPaths = [
    "/",
    "/Home",
    "/Host",
    "/Event",
    "/About",
    "/Account",
    "/Cart",
    "/OrderHistory",
    "/Contact",
  ];
  const showNavbarAndFooter = validPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  // Debugging: Logging state changes
  useEffect(() => {
    console.log("isSignUpVisible state changed:", isSignUpVisible);
  }, [isSignUpVisible]);

  return (
    <>
      {showNavbarAndFooter && (
        <Navbar cartItems={cartItems} />
      )}

      <Routes>
        <Route path="/" element={<Navigate to="/Home" />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Host" element={<Create />} />
        <Route path="/Event/*" element={<FindEvent />} />
        <Route path="/About" element={<EventPage />} />
        <Route path="/Account" element={<Account />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/OrderHistory" element={<OrderHistory />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* Popups */}
      {isLoginVisible && (
        <LoginPopup
          isOpen={isLoginVisible}
          togglePopup={closeAllPopups}
          openSignUp={openSignUpPopup}
          openForgotPassword={openForgotPasswordPopup}
        />
      )}
      {isSignUpVisible && <SignUpPopup closePopup={closeAllPopups} />}
      {isForgotPasswordVisible && <ForgotPasswordPopup closePopup={closeAllPopups} />}

      {showNavbarAndFooter && <Footer />}
    </>
  );
}

export default App;