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
import { FaShare, FaCalendar, FaTimes, FaTwitter, FaFacebook, FaLinkedin, FaWhatsapp, FaEnvelope } from 'react-icons/fa';

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

const ShareModal = ({ event, onClose }) => {
    const shareUrl = window.location.href;
    const shareText = `Check out this event: ${event.title} at ${event.venue} on ${event.date}`;
    
    const handleClose = (e) => {
        e.stopPropagation();
        onClose();
    };

    const shareLinks = [
        {
            name: 'Twitter',
            icon: <FaTwitter />,
            url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
            color: '#1DA1F2'
        },
        {
            name: 'Facebook',
            icon: <FaFacebook />,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            color: '#4267B2'
        },
        {
            name: 'LinkedIn',
            icon: <FaLinkedin />,
            url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(event.title)}`,
            color: '#0077B5'
        },
        {
            name: 'WhatsApp',
            icon: <FaWhatsapp />,
            url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
            color: '#25D366'
        },
        {
            name: 'Email',
            icon: <FaEnvelope />,
            url: `mailto:?subject=${encodeURIComponent(event.title)}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`,
            color: '#EA4335'
        }
    ];

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="share-modal" onClick={(e) => e.stopPropagation()}>
                <div className="share-modal-header">
                    <h2>Share Event</h2>
                    <button className="close-modal-button" onClick={handleClose}>
                        <FaTimes />
                    </button>
                </div>
                <div className="share-modal-content">
                    <div className="share-preview">
                        <img src={event.image} alt={event.title} className="share-preview-image" />
                        <div className="share-preview-info">
                            <h3>{event.title}</h3>
                            <p>{event.date} • {event.time}</p>
                            <p>{event.venue}</p>
                        </div>
                    </div>
                    <div className="share-buttons">
                        {shareLinks.map((link, index) => (
                            <a
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="share-button"
                                style={{ backgroundColor: link.color }}
                            >
                                {link.icon}
                                <span>{link.name}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const EventCard = ({ event }) => {
    const navigate = useNavigate();
    const [showShareModal, setShowShareModal] = useState(false);

    const handleClick = () => {
        navigate(`/Event/${event.id}`);
    };

    const handleShare = (e) => {
        e.stopPropagation();
        setShowShareModal(true);
    };

    const handleAddToCalendar = (e) => {
        e.stopPropagation();
        // Create event date string in ISO format
        const eventDate = new Date(event.date);
        const eventTime = event.time.split(':');
        eventDate.setHours(parseInt(eventTime[0]), parseInt(eventTime[1]));

        // Create calendar event data
        const calendarEvent = {
            text: event.title,
            dates: eventDate.toISOString(),
            details: `Location: ${event.venue}\nPrice: $${event.price}`,
            location: event.venue
        };

        // Create calendar URLs
        const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(calendarEvent.text)}&dates=${calendarEvent.dates.replace(/[-:]/g, '').split('.')[0]}Z/${calendarEvent.dates.replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(calendarEvent.details)}&location=${encodeURIComponent(calendarEvent.location)}`;
        const outlookCalendarUrl = `https://outlook.live.com/calendar/0/addsubject?subject=${encodeURIComponent(calendarEvent.text)}&body=${encodeURIComponent(calendarEvent.details)}&startdt=${calendarEvent.dates}&enddt=${calendarEvent.dates}&location=${encodeURIComponent(calendarEvent.location)}`;
        const appleCalendarUrl = `data:text/calendar;charset=utf-8,BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${calendarEvent.dates}\nDTEND:${calendarEvent.dates}\nSUMMARY:${calendarEvent.text}\nDESCRIPTION:${calendarEvent.details}\nLOCATION:${calendarEvent.location}\nEND:VEVENT\nEND:VCALENDAR`;

        // Open calendar dialog
        const calendarWindow = window.open('', '_blank', 'width=600,height=400');
        calendarWindow.document.write(`
            <html>
                <head>
                    <title>Add to Calendar</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        .calendar-button { 
                            display: block; 
                            width: 100%; 
                            padding: 10px; 
                            margin: 10px 0; 
                            text-align: center; 
                            text-decoration: none; 
                            color: white; 
                            border-radius: 5px;
                        }
                        .google { background-color: #DB4437; }
                        .outlook { background-color: #0078D4; }
                        .apple { background-color: #000000; }
                    </style>
                </head>
                <body>
                    <h2>Add to Calendar</h2>
                    <a href="${googleCalendarUrl}" class="calendar-button google" target="_blank">Add to Google Calendar</a>
                    <a href="${outlookCalendarUrl}" class="calendar-button outlook" target="_blank">Add to Outlook Calendar</a>
                    <a href="${appleCalendarUrl}" class="calendar-button apple" download="event.ics">Add to Apple Calendar</a>
                </body>
            </html>
        `);
    };

    return (
        <div className="event-card" onClick={handleClick} style={{ cursor: 'pointer' }}>
            <img src={event.image} alt={event.title} className="event-image" />
            <div className="event-details">
                <div className="event-title">{event.title}</div>
                <div className="event-info">{event.date} • {event.time}</div>
                <div className="event-info">{event.venue}</div>
                <div className="event-info">From ${event.price.toFixed(2)}</div>
                <div className="event-actions">
                    <button className="event-action-button" onClick={handleShare}>
                        <FaShare /> Share
                    </button>
                    <button className="event-action-button" onClick={handleAddToCalendar}>
                        <FaCalendar /> Add to Calendar
                    </button>
                </div>
            </div>
            {showShareModal && (
                <ShareModal 
                    event={event} 
                    onClose={() => setShowShareModal(false)} 
                />
            )}
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
