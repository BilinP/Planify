import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import { AuthProvider } from './Components/Login_SignUp/Auth.jsx';

import Footer from "./Components/Footer/Footer.jsx";
import Navbar from "./Components/Navbar/Navbar.jsx";
import Create from "./Components/Create/Create.jsx";
import NotFoundPage from "./Components/404/NotFoundPage.jsx";
import Account from "./Components/Account/Account.jsx";
import OrderHistory from "./Components/Account/OrderHistory.jsx";
import Cart from "./Components/Cart/Cart.jsx";
import Contact from "./Components/Contact/Contact.jsx";
import FindEvent from "./Components/Event/FindEvent.jsx";
import ForgotPasswordPopup from "./Components/Login_SignUp/ForgotPassword.jsx";
import LoginPopup from "./Components/Login_SignUp/Login.jsx";
import SignUpPopup from "./Components/Login_SignUp/SignUp.jsx";
import About from "./Components/About/About.jsx";
import Home from "./Components/Home/Home.jsx";
import EventPage from './Components/Event/EventPage';
import DeveloperDashboard from "./Components/DeveloperDashboard/DeveloperDashboard";



function App() {
  // States
  const [cartItems, setCartItems] = useState(1); // Cart item counter
  const [isLoginVisible, setIsLoginVisible] = useState(false); // Login popup visibility
  const [isSignUpVisible, setIsSignUpVisible] = useState(false); // Sign Up popup visibility
  const [isForgotPasswordVisible, setIsForgotPasswordVisible] = useState(false); // Forgot Password popup
  const [isCartOpen, setIsCartOpen] = useState(false); // Cart popup visibility

  const openCartPopup = () => {
    setIsCartOpen(true);
  };

  const closeCartPopup = () => {
    setIsCartOpen(false);
  };

  // Popup Handlers
  const openLoginPopup = () => {
    setIsLoginVisible(true);
    setIsSignUpVisible(false);
    setIsForgotPasswordVisible(false);
  };

  const closeAllPopups = () => {
    setIsLoginVisible(false);
    setIsSignUpVisible(false);
    setIsForgotPasswordVisible(false);
  };

  const location = useLocation();
  const validPaths = [
    "/",
    "/Home",
    "/Host",
    "/Event",
    "/About",
    "/Account",
    "/OrderHistory",
    "/Contact",
  ];
  const showNavbarAndFooter = validPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  useEffect(() => {
    let lastScrollTop = 0;
    const navbar = document.querySelector('nav');

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > lastScrollTop) {
        // Scroll down
        navbar.style.top = '-100px'; // Adjust this value based on your navbar height
      } else {
        // Scroll up
        navbar.style.top = '0';
      }

      lastScrollTop = scrollTop;
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <AuthProvider>
      {showNavbarAndFooter && (
        <>
          <Navbar openLoginPopup={openLoginPopup} openCartPopup={openCartPopup} cartItems={cartItems} />
          {isCartOpen && <Cart closeCartPopup={closeCartPopup} />}
        </>
      )}

<Routes>
  <Route path="/" element={<Navigate to="/Home" />} />
  <Route path="/Home" element={<Home />} />
  <Route path="/Host" element={<Create />} />
  <Route path="/Event/*" element={<FindEvent />} />
  <Route path="/Event/:id" element={<EventPage />} />
  <Route path="/About" element={<About />} />
  <Route path="/Account" element={<Account />} />
  <Route path="/OrderHistory" element={<OrderHistory />} />
  <Route path="/Contact" element={<Contact />} />
  
  <Route path="/dev-dashboard/*" element={<DeveloperDashboard />} /> {/* This should be used */}

  <Route path="*" element={<NotFoundPage />} />
</Routes>


      {/* Popups */}
      {isLoginVisible && (
        <LoginPopup
          isOpen={isLoginVisible}
          togglePopup={closeAllPopups}
        />
      )}

      {isSignUpVisible && <SignUpPopup closePopup={closeAllPopups} />}
      {isForgotPasswordVisible && <ForgotPasswordPopup closePopup={setIsForgotPasswordVisible} />}

      {showNavbarAndFooter && <Footer />}
    </AuthProvider>
  );
}

export default App;