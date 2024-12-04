import  { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from '../Login_SignUp/Auth';
import "./Navbar.css";


export const Navbar = ({ cartItems, openLoginPopup }) => {
    const { authData, logout } = useAuth(); // Use the authData and logout function from the context
    const [menuOpen, setMenuOpen] = useState(false);

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
                    <li><Link to="/Contact">Contact</Link></li>
                </ul>
                <div className="nav-actions">
                    {!authData ? (
                        <button
                            className="login-button"
                            onClick={openLoginPopup} 
                        >
                            Login/Sign Up
                        </button>
                    ) : (
                        <button
                            className="login-button"
                            onClick={handleLogout} 
                        >
                            Sign Out
                        </button>
                    )}
                    <Link to="/Cart">
                        <FontAwesomeIcon
                            icon={faCartShopping}
                            className="cart-icon"
                            style={{ color: cartItems === 0 ? "red" : "white" }}
                        />
                    </Link>
                </div>
                <div
                    className="menu"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
