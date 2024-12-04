import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './EventPage.css';
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
        image: BrazilianDance,
        summary: "Join us for a night of Brazilian dance and music!"
    },
    {
        id: 2,
        title: "Graduation Ceremony",
        date: "Fri, Dec 20",
        time: "2:00 PM",
        venue: "CSUN",
        price: 5.00,
        image: GraduationCeremony,
        summary: "Celebrate the achievements of our graduates."
    },
    {
        id: 3,
        title: "Sing! - An 'L.A. Story' Live Music",
        date: "Wed, Dec 11",
        time: "6:00 PM",
        venue: "Hauser & Wirth West Hollywood",
        price: 0,
        image: Singing,
        summary: "Enjoy live music performances in L.A."
    },
    {
        id: 4,
        title: "The RHYTHMS",
        date: "Saturday",
        time: "9:00 PM",
        venue: "The Melrose House",
        price: 0,
        image: Rhythm,
        summary: "Experience the rhythms of the night."
    },
    {
        id: 5,
        title: "New Year Countdown",
        date: "Tues, Dec 31",
        time: "10:00 PM",
        venue: "Apartment ",
        price: 0.00,
        image: CountDownIMG,
        summary: "Countdown to the new year with us!"
    },
    {
        id: 6,
        title: "Bake Better",
        date: "Mon, Jan 6",
        time: "2:00 PM",
        venue: "Baking class",
        price: 15.00,
        image: BakingIMG,
        summary: "Learn to bake better with our expert tips."
    },
    {
        id: 7,
        title: "HOPE - LA 6th Annual FUNdraiser 70s Disco Party",
        date: "Sun, Dec 8",
        time: "4:00 PM",
        venue: "XO Banquet Hall",
        price: 50.00,
        image: FUNdraiser,
        summary: "Join us for a 70s disco party fundraiser."
    }
];

const EventPage = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [reviews, setReviews] = useState([
        { id: 1, text: 'Great event! Fun and engaging.' },
        { id: 2, text: 'Well organized and informative.' },
    ]);
    const [newReview, setNewReview] = useState('');

    useEffect(() => {
        const event = events.find(event => event.id === parseInt(id));
        setEvent(event);
    }, [id]);

    const handleReviewChange = (e) => {
        setNewReview(e.target.value);
    };

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if (newReview.trim()) {
            setReviews([...reviews, { id: reviews.length + 1, text: newReview }]);
            setNewReview('');
        }
    };

    const handleBuyTickets = () => {
        alert('Purchased tickets.');
    };

    if (!event) {
        return <div>Loading...</div>;
    }

    return (
        <div className="event-page-container">
            <div className="event-header-image-container">
                <img 
                    src={event.image}
                    alt="eventBanner" 
                    className="event-header-image" 
                />
            </div>

            <div className="event-content-container">
                <div className="event-page-box">
                    <div className="event-name-header">
                        <h3>Event Title</h3>
                        <div className="event-underline"></div>
                        <p style={{ marginBottom: '20px' }}>{event.title}</p>
                    </div>

                    <div className="event-date-box">
                        <h3>Date and Time</h3>
                        <div className="event-underline"></div>
                        <p style={{ marginBottom: '20px' }}>{event.date}</p>
                    </div>

                    <div className="event-location-box">
                        <h3>Location</h3>
                        <div className="event-underline"></div>
                        <p style={{ marginBottom: '20px' }}>{event.venue}</p>
                    </div>

                    <div className='event-about-box'>
                        <h3>About Event</h3>
                        <div className="event-underline"></div>
                        <p style={{ marginBottom: '20px' }}>{event.summary}</p>
                    </div>
                </div>

                <div className="event-ticket-box">
                    <h3>Price</h3>
                    <div className="event-underline"></div>
                    <p>${event.price}</p>
                    <button className="event-buy-button" onClick={handleBuyTickets}>Buy Ticket</button>
                </div>
            </div>

            <div className='event-review-section'>
                <h3>Reviews</h3>
                <div className="event-underline"></div>
                {reviews.map(review => (
                    <div key={review.id} className="event-review">
                        <p>{review.text}</p>
                    </div>
                ))}
                <form onSubmit={handleReviewSubmit} className="event-review-form">
                    <input 
                        type="text" 
                        value={newReview} 
                        onChange={handleReviewChange} 
                        placeholder="Write a review..." 
                        className="event-review-input"
                    />
                    <button type="submit" className="event-review-submit-button">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default EventPage;