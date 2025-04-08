import { useEffect, useState } from 'react';
import { FaTrash } from "react-icons/fa"; 
import { supabase } from "../../../backend/supabaseClient"; 
import "./Cart.css";
import VisaIcon from "./visa-svgrepo-com.png";
import PropTypes from "prop-types";
import MastercardIcon from "./mastercard-svgrepo-com.png";
import { useAuth } from '../Login_SignUp/Auth';

const Cart = ({ closeCartPopup }) => {
  const [cart, setCart] = useState([]);
  const [showManualAddress, setShowManualAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const { authData } = useAuth(); // Get user authentication data
  const maxQuantity = 4;

  // Load cart from local storage or database on component mount
  useEffect(() => {
    const loadCart = async () => {
      if (authData) {
        const { data, error } = await supabase
          .from("cart")
          .select(`
            id,
            quantity,
            ticket_type_id,
            ticket_types (
              name,
              price
            )
          `)
          .eq("user_id", authData.id);
    
        if (error) {
          console.error("Error fetching cart:", error);
        } else {
          const formattedCart = data.map((item) => ({
            id: item.id,
            ticket_type_id: item.ticket_type_id,
            name: item.ticket_types.name,
            price: item.ticket_types.price,
            quantity: item.quantity
          }));
    
          setCart(formattedCart);
          console.log("Fetched cart from DB:", formattedCart);
        }
      } else {
        const cachedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(cachedCart);
      }
    };

    loadCart();
  }, [authData]);

  // Save cart to database or local storage
  const saveCart = async (updatedCart) => {
    setCart(updatedCart);
  
    if (authData) {
      const { error } = await supabase
        .from("cart")
        .upsert(
          updatedCart.map((item) => ({
            id: item.id, // keep existing ID if present
            user_id: authData.id,
            ticket_type_id: item.ticket_type_id,
            quantity: item.quantity,
          })),
          { onConflict: ['id'] }
        );
  
      if (error) {
        console.error("Error saving cart:", error);
      }
    } else {
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  // Add an item to the cart
  const addToCart = (item) => {
    if (authData) {
      // ideally handled on ticket detail page or with a DB insert
      console.warn("Logged-in cart items should be added via the backend.");
    } else {
      const existingItemIndex = cart.findIndex((cartItem) => cartItem.ticket_type_id === item.ticket_type_id);
      if (existingItemIndex !== -1) {
        const updatedCart = [...cart];
        updatedCart[existingItemIndex].quantity += item.quantity;
        saveCart(updatedCart);
      } else {
        const updatedCart = [...cart, item];
        saveCart(updatedCart);
      }
    }
  };

  // Update item quantity in the cart
  const updateQuantity = async (index, quantity) => {
    if (quantity >= 1 && quantity <= maxQuantity) {
      const updatedCart = [...cart];
      updatedCart[index].quantity = quantity;
      await saveCart(updatedCart);
    }
  };
  
  const removeItem = async (index) => {
    const cartItem = cart[index];
  
    if (authData) {
      const { error } = await supabase
        .from("cart")
        .delete()
        .eq("id", cartItem.id);
  
      if (error) {
        console.error("Error removing item:", error);
      }
    }
  
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
  };

  // Calculate subtotal
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // Calculate shipping dynamically
  const calculateShipping = (subtotal) => {
    if (subtotal >= 100) return 0; // Free shipping for orders $100 or above
    if (subtotal > 50) return 5; // $5 shipping for orders $50 to $99.99
    return 10; // $10 shipping for orders below $50
  };

  const shippingCost = calculateShipping(subtotal);
  const total = subtotal + shippingCost;

  // Fetch address suggestions from the Nominatim API
  const fetchSuggestions = async (query) => {
    if (query.length > 2) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            query
          )}&format=json&addressdetails=1&countrycodes=US&limit=5`
        );
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Error fetching address suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="cart-overlay" onClick={closeCartPopup}>
      <div className="cart-popup" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={closeCartPopup}>&times;</button>
        <div className="checkout-container">
          {/* Left Section */}
          <div className="checkout-left">
            <h2 className="store-name">Planify</h2>
            <div className="order-summary">
              {cart.map((item, index) => (
                <div key={index} className="order-item">
                  <div>{item.name}</div>
                  <div className="quantity-price">
                    <button onClick={() => updateQuantity(index, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(index, item.quantity + 1)} disabled={item.quantity >= maxQuantity}>+</button>
                    <button onClick={() => removeItem(index)}><FaTrash /></button> 
                    <span className="price">${(item.price * item.quantity).toFixed(2)}</span> 
                  </div>
                </div>
              ))}
            </div>
            <div className="order-summary-bottom">
              <div className="order-subtotal">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="order-shipping">
                <span>Shipping:</span>
                <span>${shippingCost.toFixed(2)}</span>
              </div>
              <div className="order-total">
                <span>Total Due:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <p className="powered-by">Powered by Stripe</p>
            </div>
          </div>

          {/* Right Section */}
          <div className="checkout-right">
            <button className="apple-pay"></button>
            <p className="or-divider">Or pay with card</p>

            <form className="checkout-form" autoComplete="off">
              {/* Email Input */}
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="Enter email" required />
              </div>

              {/* Address Autocomplete */}
              <div className="form-group autocomplete-wrapper">
                <label htmlFor="address">Shipping Address</label>
                <select id="country" required>
                  <option value="US">United States</option>
                </select>
                <input
                  type="text"
                  id="address"
                  placeholder="Type your address"
                  className="autocomplete-input"
                  autoComplete="new-password"
                  value={selectedAddress}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedAddress(value);
                    fetchSuggestions(value); // Call the API for suggestions
                  }}
                  required
                />
                {/* Address Suggestions */}
                {suggestions.length > 0 && (
                  <ul className="suggestions-list">
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className="suggestion-item"
                        onClick={() => {
                          setSelectedAddress(suggestion.display_name);
                          setSuggestions([]); // Clear suggestions after selecting
                        }}
                      >
                        {suggestion.display_name}
                      </li>
                    ))}
                  </ul>
                )}
                <p
                  className="manual-address"
                  onClick={() => setShowManualAddress(!showManualAddress)}
                >
                  Enter address manually
                </p>

                {/* Manual Address Section */}
                {showManualAddress && (
                  <div className="manual-address-section">
                    <input type="text" placeholder="Street Address" required />
                    <input type="text" placeholder="City" required />
                    <input type="text" placeholder="State/Province" required />
                    <input type="text" placeholder="Postal Code" required />
                  </div>
                )}
              </div>

              {/* Payment Details */}
              <div className="form-group">
                <label htmlFor="card">Payment Details</label>
                <div className="card-input">
                  <div className="card-icons">
                    <img src={VisaIcon} alt="Visa" />
                    <img src={MastercardIcon} alt="MasterCard" />
                  </div>
                  <input type="text" id="card" placeholder="Card Number" required />
                </div>
                <div className="card-extra">
                  <input type="text" placeholder="MM / YY" required />
                  <input type="text" placeholder="CVC" required />
                </div>
              </div>

              {/* Billing Checkbox */}
              <div className="billing">
                <input type="checkbox" id="billing" />
                <label htmlFor="billing">
                  Billing address is same as shipping
                </label>
              </div>

              {/* Submit Button */}
              <button type="submit" className="checkout-btn">
                Pay ${total.toFixed(2)}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
Cart.propTypes = {
  closeCartPopup: PropTypes.func.isRequired,
  authData: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
};

export default Cart;