import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
        title: "Brazilian Dance Social: Forró & Samba",
        date: "Sat, Dec 7",
        time: "8:00 PM",
        venue: "Motivo LA",
        price: 20.00,
        image: BrazilianDance
    },
    {
        title: "Graduation Ceremony",
        date: "Fri, Dec 20",
        time: "2:00 PM",
        venue: "CSUN",
        price: 5.00,
        image: GraduationCeremony
    },
    {
        title: "Sing! - An 'L.A. Story' Live Music",
        date: "Wed, Dec 11",
        time: "6:00 PM",
        venue: "Hauser & Wirth West Hollywood",
        price: 0,
        image: Singing
    },
    {
        title: "The RHYTHMS",
        date: "Saturday",
        time: "9:00 PM",
        venue: "The Melrose House",
        price: 0,
        image: Rhythm
    },
    {
        title: "New Year Countdown",
        date: "Tues, Dec 31",
        time: "10:00 PM",
        venue: "Apartment ",
        price: 0.00,
        image: CountDownIMG
    },
    {
        title: "Bake Better",
        date: "Mon, Jan 6",
        time: "2:00 PM",
        venue: "Baking class",
        price: 15.00,
        image: BakingIMG
    },
    {
        title: "HOPE - LA 6th Annual FUNdraiser 70s Disco Party",
        date: "Sun, Dec 8",
        time: "4:00 PM",
        venue: "XO Banquet Hall",
        price: 50.00,
        image: FUNdraiser
    }
];

const EventCard = ({ event }) => (
    <div className="event-card">
        <img src={event.image} alt={event.title} className="event-image" />
        <div className="event-details">
            <div className="event-title">{event.title}</div>
            <div className="event-info">{event.date} • {event.time}</div>
            <div className="event-info">{event.venue}</div>
            <div className="event-info">From ${event.price.toFixed(2)}</div>
        </div>
    </div>
);

const FindEvent = () => {
    const [filteredEvents, setFilteredEvents] = useState(events);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const location = useLocation();

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

    return (
        <div className="container">
            <div className="header">
                <div className="location-selector">
                <span className="location-text">Browsing events in </span>
                    <select id="location">
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
