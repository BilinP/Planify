import React, { useState } from "react";
import { FaTrash } from "react-icons/fa"; 
import "./Cart.css"; // Ensure your CSS file is linked
import VisaIcon from "./visa-svgrepo-com.png";
import MastercardIcon from "./mastercard-svgrepo-com.png";

const Cart = ({ closeCartPopup }) => {
  const [cart, setCart] = useState([
    { name: "VIP Tickets", price: 75, quantity: 2 },
    { name: "Concert Lightsticks", price: 25, quantity: 2 },
  ]);

  const [showManualAddress, setShowManualAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const maxQuantity = 4;

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

  // Update item quantity in the cart
  const updateQuantity = (index, quantity) => {
    if (quantity >= 1 && quantity <= maxQuantity) {
      const updatedCart = [...cart];
      updatedCart[index].quantity = quantity;
      setCart(updatedCart);
    }
  };

  // Remove item from the cart
  const removeItem = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
  };

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

export default Cart;