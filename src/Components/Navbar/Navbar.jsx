import {useState} from "react";
import {Link} from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import "./Navbar.css"

export const Navbar = ({ cartItems }) => {

    const [menuOpen,setMenuOpen]=useState(false)

    return (
        <nav>
            <Link to="/" className="title"> PLANIFY </Link>
            <ul className={menuOpen ? "open":""}>
                <li>
                    <Link to="/Event">Find Events</Link>
                </li>
                <li>
                    <Link to="/Host">Host</Link>
                </li>
                <li>
                    <Link to="/About">About</Link>
                </li>
                <li>
                    <Link to="/Contact">Contact</Link>
                </li>
            </ul>
            <div className="nav-actions">
                <button className="login-button">Login/Sign Up</button>
                <Link to ="/cart">
                <FontAwesomeIcon 
                icon={faCartShopping} 
                className="cart-icon"
                style={{ color: cartItems == 0 ? "red" : "white" }} />
                </Link>
            </div>
            <div className="menu" onClick={()=> {
                setMenuOpen(!menuOpen);
            }}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </nav>
    );
};

export default Navbar;
