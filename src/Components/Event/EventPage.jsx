import React, { useState } from 'react';
import './EventPage.css';
import headerImage from '../../assets/header-image.webp';

const EventPage = () => {
    const eventTitle = 'Sample Event Title';
    const eventDate = '2024-01-01';
    const eventLocation = 'Sample Location';
    const eventSummary = 'This is a sample event summary.';
    const isOnline = false;
    const ticketPrice = 50; // Example ticket price
    const [reviews, setReviews] = useState([
        { id: 1, text: 'Great event! Fun and engaging.' },
        { id: 2, text: 'Well organized and informative.' },
    ]);
    const [newReview, setNewReview] = useState('');

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

    return (
        <div className="event-page-container">
            <div className="event-header-image-container">
                <img 
                    src={headerImage}
                    alt="eventBanner" 
                    className="event-header-image" 
                />
            </div>

            <div className="event-content-container">
                <div className="event-page-box">
                    <div className="event-name-header">
                        <h3>Event Title</h3>
                        <div className="event-underline"></div>
                        <p>{eventTitle}</p>
                    </div>

                    <div className="event-date-box">
                        <h3>Date and Time</h3>
                        <div className="event-underline"></div>
                        <p>{eventDate}</p>
                    </div>

                    <div className="event-location-box">
                        <h3>Location</h3>
                        <div className="event-underline"></div>
                        <p>{isOnline ? 'Online' : eventLocation}</p>
                    </div>

                    <div className='event-about-box'>
                        <h3>About Event</h3>
                        <div className="event-underline"></div>
                        <p>{eventSummary}</p>
                    </div>
                </div>

                <div className="event-ticket-box">
                    <h3>Price</h3>
                    <div className="event-underline"></div>
                    <p>${ticketPrice}</p>
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