import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import supabase from './utils/supabase.js';
import './App.css'

import Footer from './Components/Footer/Footer.jsx';
import Navbar from './Components/Navbar/Navbar.jsx';
import Create from './Components/Create/Create.jsx';
import NotFoundPage from './Components/404/NotFoundPage.jsx';
import Account from './Components/Account/Account.jsx';
import OrderHistory from './Components/Account/OrderHistory.jsx';
import Cart from './Components/Cart/Cart.jsx';
import Contact from './Components/Contact/Contact.jsx';
import FindEvent from './Components/FindEvent/FindEvent.jsx';
import ForgotPassword from './Components/Login_SignUp/ForgotPassword.jsx';
import Login from './Components/Login_SignUp/Login.jsx';
import SignUp from './Components/Login_SignUp/SignUp.jsx';
import About from './Components/About/About.jsx';
import Home from './Components/Home/Home.jsx';

function App() {
  const [cartItems, setCartItems] = useState(1);
  const toggleCartItem = () => {
    setCartItems(cartItems => (cartItems === 0 ? 1 : 0));
  };

  const location = useLocation();
  const validPaths = [
    '/',
    '/Home',
    '/Host',
    '/Event',
    '/About',
    '/Account',
    '/Cart',
    '/OrderHistory',
    '/Contact',
    '/ForgotPassword',
    '/Login',
    '/SignUp'
  ];
  const showNavbarAndFooter = validPaths.some(path => location.pathname.startsWith(path));

  return (
    <>
      {showNavbarAndFooter && <Navbar cartItems={cartItems} toggleCartItem={toggleCartItem} />}
      <Routes>
        <Route path="/" element={<Navigate to="/Home" />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Host" element={<Create />} />
        <Route path="/Event/*" element={<FindEvent />} />
        <Route path="/About" element={<About />} />
        <Route path="/Account" element={<Account />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/OrderHistory" element={<OrderHistory />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {showNavbarAndFooter && <Footer />}
    </>
  );
}

export default App;