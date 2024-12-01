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
            <div className="header-image-container">
                <img 
                    src={headerImage}
                    alt="eventBanner" 
                    className="header-image" 
                />
            </div>

            <div className="content-container">
                <div className="event-box">
                    <div className="event-name-header">
                        <h3>Event Title</h3>
                        <div className="underline"></div>
                        <p>{eventTitle}</p>
                    </div>

                    <div className="event-date-box">
                        <h3>Date and Time</h3>
                        <div className="underline"></div>
                        <p>{eventDate}</p>
                    </div>

                    <div className="event-location-box">
                        <h3>Location</h3>
                        <div className="underline"></div>
                        <p>{isOnline ? 'Online' : eventLocation}</p>
                    </div>

                    <div className='about-event-box'>
                        <h3>About Event</h3>
                        <div className="underline"></div>
                        <p>{eventSummary}</p>
                    </div>
                </div>

                <div className="ticket-box">
                    <h3>Price</h3>
                    <div className="underline"></div>
                    <p>${ticketPrice}</p>
                    <button className="buy-button" onClick={handleBuyTickets}>Buy Ticket</button>
                </div>
            </div>

            <div className='review-section'>
                <h3>Reviews</h3>
                <div className="underline"></div>
                {reviews.map(review => (
                    <div key={review.id} className="review">
                        <p>{review.text}</p>
                    </div>
                ))}
                <form onSubmit={handleReviewSubmit} className="review-form">
                    <input 
                        type="text" 
                        value={newReview} 
                        onChange={handleReviewChange} 
                        placeholder="Write a review..." 
                        className="review-input"
                    />
                    <button type="submit" className="review-submit-button">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default EventPage;