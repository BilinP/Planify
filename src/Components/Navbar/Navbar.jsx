import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from '../Login_SignUp/Auth';
import "../../Components/Navbar/Navbar.css"; 
import Contact from "../../Components/Contact/Contact"; // Ensure this path is correct
import { MdAccountCircle } from "react-icons/md"; 

export const Navbar = ({ cartItems, openLoginPopup, openCartPopup }) => {
    const { authData, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [profilePopupOpen, setProfilePopupOpen] = useState(false);
    const popupRef = useRef(null); // Ref to the popup content

    // Function to close the popup
    const closePopup = () => {
        setProfilePopupOpen(false);
    };

    // Event listener to detect clicks outside the popup
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                closePopup();
            }
        };

        // Add event listener to detect click outside
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup the event listener when the component unmounts
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout();
    };

    return (
        <>
            <nav>
                <Link to="/" className="title">PLANIFY</Link>
                <ul className={menuOpen ? "open" : ""}>
                    <li><Link to="/Event">Find Events</Link></li>
                    <li><Link to="/Host">Host</Link></li>
                    <li><Link to="/About">About</Link></li>
                </ul>
                <div className="nav-actions">
                    {!authData ? (
                        <button className="login-button" onClick={openLoginPopup}>
                            Login/Sign Up
                        </button>
                    ) : (
                        <>
                            <button className="login-button" onClick={handleLogout}>
                                Sign Out
                            </button>
                            {/* Profile Icon to open the popup */}
                            <MdAccountCircle
                                size={40}
                                className="profile-icon"
                                onClick={() => setProfilePopupOpen(true)}
                            />
                        </>
                    )}

                    <FontAwesomeIcon
                        icon={faCartShopping}
                        onClick={openCartPopup}
                        className="cart-icon"
                        style={{ color: cartItems === 0 ? "red" : "white" }}
                    />
                </div>
                <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </nav>
            
            {/* Profile Popup - Shows Contact Page */}
            {profilePopupOpen && (
                <div className="popup-overlay">
                    <div className="popup-content" ref={popupRef}>
                        <h2></h2>
                        <Contact closePopup={closePopup} /> {/* Renders Contact.jsx inside popup */}
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;