
import { useState } from 'react';
import  supabase  from './utils/supabase.js'
import './App.css';

import Footer from './Components/Footer/Footer';
import Navbar from './Components/Navbar/Navbar.jsx';

function App() {
  const [cartItems, setCartItems] = useState(1);    
  const toggleCartItem = () => {
    setCartItems(cartItems => (cartItems === 0 ? 1 : 0)); 
  };
  return (
    < Navbar cartItems={cartItems} toggleCartItem={toggleCartItem}/>
  );
}
  export default App;