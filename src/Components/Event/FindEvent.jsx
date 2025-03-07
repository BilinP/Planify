import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './FindEvent.css';
import BrazilianDance from '../../assets/braziliandance.png';
import GraduationCeremony from '../../assets/graduationceremony.png';
import Singing from '../../assets/sing.png';
import Rhythm from '../../assets/Rhythm.png';
import CountDownIMG from '../../assets/CountDown.png';
import BakingIMG from '../../assets/BakingIMG.png';
import FUNdraiser from '../../assets/FUNdraiser.png';

const events = [
    {
        id: 1,
        title: "Brazilian Dance Social: Forró & Samba",
        date: "Sat, Dec 7",
        time: "8:00 PM",
        venue: "Motivo LA",
        price: 20.00,
        image: BrazilianDance
    },
    {
        id: 2,
        title: "Graduation Ceremony",
        date: "Fri, Dec 20",
        time: "2:00 PM",
        venue: "CSUN",
        price: 5.00,
        image: GraduationCeremony
    },
    {
        id: 3,
        title: "Sing! - An 'L.A. Story' Live Music",
        date: "Wed, Dec 11",
        time: "6:00 PM",
        venue: "Hauser & Wirth West Hollywood",
        price: 0,
        image: Singing
    },
    {
        id: 4,
        title: "The RHYTHMS",
        date: "Saturday",
        time: "9:00 PM",
        venue: "The Melrose House",
        price: 0,
        image: Rhythm
    },
    {
        id: 5,
        title: "New Year Countdown",
        date: "Tues, Dec 31",
        time: "10:00 PM",
        venue: "Apartment ",
        price: 0.00,
        image: CountDownIMG
    },
    {
        id: 6,
        title: "Bake Better",
        date: "Mon, Jan 6",
        time: "2:00 PM",
        venue: "Baking class",
        price: 15.00,
        image: BakingIMG
    },
    {
        id: 7,
        title: "HOPE - LA 6th Annual FUNdraiser 70s Disco Party",
        date: "Sun, Dec 8",
        time: "4:00 PM",
        venue: "XO Banquet Hall",
        price: 50.00,
        image: FUNdraiser
    }
];

const EventCard = ({ event }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/Event/${event.id}`);
    };

    return (
        <div className="event-card" onClick={handleClick} style={{ cursor: 'pointer' }}>
            <img src={event.image} alt={event.title} className="event-image" />
            <div className="event-details">
                <div className="event-title">{event.title}</div>
                <div className="event-info">{event.date} • {event.time}</div>
                <div className="event-info">{event.venue}</div>
                <div className="event-info">From ${event.price.toFixed(2)}</div>
            </div>
        </div>
    );
};

const FindEvent = () => {
    const [filteredEvents, setFilteredEvents] = useState(events);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const location = useLocation();
    const [showMap, setShowMap] = useState(false);

    const categories = ['All', 'For you', 'Online', 'Today', 'This weekend', 'Free', 'Music', 'Food & Drink', 'Charity & Causes'];

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const search = params.get('search');
        if (search) {
            setSearchTerm(search);
        }
    }, [location.search]);

    useEffect(() => {
        const filtered = events.filter(event => 
            event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.venue.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredEvents(filtered);
    }, [searchTerm]);

    const handleCategoryClick = (category) => {
        setActiveCategory(category); 
        setFilteredEvents(events);
    };

    const handleShowMap = () => {
        setShowMap(true);
    };

    const handleCloseMap = () => {
        setShowMap(false);
    };

    return (
        <div className="container">
            <button onClick={handleShowMap} className="map-button">
                Show Map
            </button>

            {showMap && (
                <div className="map-modal">
                    <div className="map-content">
                        <h3>Event Locations</h3>
                        <div className="map-placeholder">Map</div>
                        <button onClick={handleCloseMap} className="close-button">Close</button>
                    </div>
                </div>
            )}

            <div className="header">
                <div className="location-selector">
                    <span className="location-text">Browsing events in </span>
                    <select className="location">
                        <option>Santa Clarita</option>
                    </select>
                </div>
            </div>
            <input 
                type="text" 
                className="search-bar" 
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="categories">
                {categories.map((category) => (
                    <button 
                        key={category}
                        className={`category ${activeCategory === category ? 'active' : ''}`}
                        onClick={() => handleCategoryClick(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>
            <h2 className="top-picks-heading">✦ Our top picks for you</h2>
            <div className="events-grid">
                {filteredEvents.map((event, index) => (
                    <EventCard key={index} event={event} />
                ))}
            </div>
        </div>
    );
};

export default FindEvent;
