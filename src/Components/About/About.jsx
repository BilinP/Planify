import React from 'react';
import './About.css';

const About = () => {
    const wrapWordsWithSpan = (text) => {
        return text.split(' ').map((word, index) => (
            <span key={index} className="hover-word">
                {word}
            </span>
        ));
    };

    return (
        <div className="about-container">
            <div className="about-box">
                <h1 className="about-title">About Planify</h1>
                <p className="about-description">
                    {wrapWordsWithSpan(
                        'Planify is your ultimate event planning and ticketing platform. Whether you\'re hosting an event or looking for exciting experiences, Planify makes it easy to connect, plan, and enjoy.'
                    )}
                </p>
                <div className="about-features">
                    <h2>Our Features</h2>
                    <ul>
                        <li>Discover and book events near you.</li>
                        <li>Host your own events with ease.</li>
                        <li>Secure and seamless ticketing system.</li>
                        <li>Personalized recommendations for events.</li>
                    </ul>
                </div>
                <div className="about-mission">
                    <h2>Our Mission</h2>
                    <p>
                        {wrapWordsWithSpan(
                            'At Planify, our mission is to bring people together through unforgettable experiences. We aim to simplify event planning and make it accessible to everyone.'
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;