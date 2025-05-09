import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../../backend/supabaseClient';
import { useAuth } from '../Login_SignUp/Auth';
import Placeholder_PFP from '../../assets/Placeholder_PFP.png';
import './EventPage.css';
import ReviewItem from './ReviewItem';

const bucketBaseUrl = 'https://gliujspizqdmlzvnkyfb.supabase.co/storage/v1/object/public/Planify/Event/';

const EventPage = () => {
  const { id } = useParams(); 
  const { authData } = useAuth(); 
  const [event, setEvent] = useState(null);
  const [eventImageUrl, setEventImageUrl] = useState(Placeholder_PFP);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [reviewRating, setReviewRating] = useState(0); 
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [selectedTicketType, setSelectedTicketType] = useState(null);
  const [replyTexts, setReplyTexts] = useState({});
  const [openReplyForm, setOpenReplyForm] = useState(null);

  useEffect(() => {
    fetchEvent();
    fetchReviews();
    fetchTicketTypes(); 
  }, [id]);

  useEffect(() => {
    if (event) {
      const fetchImage = async () => {
        const fileName = await getEventImageFileName(event.event_id);
        if (fileName) {
          setEventImageUrl(`${bucketBaseUrl}${fileName}?width=1000&height=500&quality=100`);
        } else {
          setEventImageUrl(Placeholder_PFP);
        }
      };
      fetchImage();
    }
  }, [event]);

  const fetchEvent = async () => {
    const { data, error } = await supabase
      .from('EventTable')
      .select('*')
      .eq('event_id', id)
      .single();

    if (error) {
      console.error('Error fetching event:', error);
    } else {
      setEvent(data);
    }
  };

  const getEventImageFileName = async (eventId) => {
    const { data, error } = await supabase
      .storage
      .from('Planify')
      .list('Event', { limit: 100 });
    if (error) {
      console.error('Error listing Event images:', error);
      return null;
    }
    const file = data.find(f => f.name.startsWith(`event_${eventId}.`));
    return file ? file.name : null;
  };

  const fetchTicketTypes = async () => {
    const { data, error } = await supabase
      .from('ticket_types')
      .select("id, price, name")
      .eq("event_id", id);
    if (error) {
      console.error("Error fetching ticket types:", error);
    } else {
      console.log('Fetched ticket types:', data);
      setTicketTypes(data);
      if (data && data.length > 0) {
        setSelectedTicketType(data[0]);
      }
    }
  };

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('Review')
      .select('*')
      .eq('event_id', id);
    if (error) {
      console.error('Error fetching reviews:', error);
    } else {
      console.log('Fetched reviews:', data);
      setReviews(data);
    }
  };

  const handleReviewChange = (e) => {
    setNewReview(e.target.value);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!authData) {
      setShowLoginPopup(true);
      return;
    }

    if (newReview.trim()) {
      const reviewPayload = {
        event_id: id,
        created_at: new Date().toISOString(),
        user_id: authData.id,
        review_txt: newReview,
        parent_review_id: null,
        rating: reviewRating,
      };

      const { data, error } = await supabase
        .from('Review')
        .insert([reviewPayload])
        .select();

      if (error) {
        console.error('Error saving review:', error);
      } else {
        console.log('Review saved:', data);
        setReviews([...reviews, ...data]);
        setNewReview('');
        setReviewRating(0);
      }
    }
  };

  const handleTicketTypeChange = (e) => {
    const typeId = parseInt(e.target.value, 10);
    const selectedType = ticketTypes.find(tt => tt.id === typeId);
    console.log('Selected ticket type:', selectedType);
    setSelectedTicketType(selectedType);
  };

  const handleBuyTickets = async () => {
    const ticket = {
      ticket_type_id: selectedTicketType.id,
      event_title: event.event_title,
      price: event.price,
    };

    if (authData) {
      try {
        const { data: existingCartItems, error } = await supabase
          .from("cart")
          .select("*")
          .eq("ticket_type_id", ticket.ticket_type_id)
          .eq("user_id", authData.id);
    
        if (error) throw error;
        if (existingCartItems?.length > 0) {
          const newQuantity = existingCartItems[0].quantity + 1;
          const { error } = await supabase
            .from("cart")
            .update({ quantity: newQuantity })
            .eq("id", existingCartItems[0].id);
          if (error) throw error;
          alert("Ticket added in your cart.");
        } else {
          const { error } = await supabase
            .from("cart")
            .insert([
              {
                user_id: authData.id,
                ticket_type_id: ticket.ticket_type_id,
                quantity: 1,
              },
            ]);
          if (error) throw error;
          alert("Ticket added in your cart.");
        }
      } catch (error) {
        console.error("Error processing ticket addition:", error);
        alert("There was an error processing your request. Please try again later.");
      }
    } else {
      let cachedCart = JSON.parse(localStorage.getItem("cart")) || [];
      const index = cachedCart.findIndex(
        (item) => item.ticket_type_id === ticket.ticket_type_id
      );
      if (index !== -1) {
        cachedCart[index].quantity += 1;
      } else {
        cachedCart.push({
          ticket_type_id: ticket.ticket_type_id,
          name: ticket.event_title,
          price: ticket.price,
          quantity: 1,
        });
      }
      localStorage.setItem("cart", JSON.stringify(cachedCart));
      alert("Ticket added in your cart.");
    }
  };

  const handleReplyChange = (reviewId, text) => {
    setReplyTexts({
      ...replyTexts,
      [reviewId]: text,
    });
  };

  const handleReplySubmit = async (parentReviewId, e) => {
    e.preventDefault();

    if (!authData) {
      setShowLoginPopup(true);
      return;
    }

    const replyText = replyTexts[parentReviewId];
    if (replyText && replyText.trim()) {
      const replyPayload = {
        event_id: id,
        created_at: new Date().toISOString(),
        user_id: authData.id,
        review_txt: replyText,
        parent_review_id: parentReviewId,
        rating: null, 
      };

      const { data, error } = await supabase
        .from('Review')
        .insert([replyPayload])
        .select();

      if (error) {
        console.error('Error saving reply:', error);
      } else {
        console.log('Reply saved:', data);
        setReviews([...reviews, ...data]);
        setReplyTexts({ ...replyTexts, [parentReviewId]: '' });
        setOpenReplyForm(null);
      }
    }
  };

  const renderReviews = (parentId = null, level = 0, visited = new Set()) => {
    return reviews
      .filter(review => review.parent_review_id === parentId)
      .map(review => {
        if (visited.has(review.id)) return null;
        const newVisited = new Set(visited);
        newVisited.add(review.id);

        const nestedReplies = renderReviews(review.id, level + 1, newVisited);

        return (
          <ReviewItem
            key={review.id}
            review={review}
            level={level}
            authData={authData}
            replyText={replyTexts[review.id]}
            onReplyTextChange={handleReplyChange}
            onReplySubmit={handleReplySubmit}
            childrenMarkup={nestedReplies}
          />
        );
      });
  };

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <div className="event-page-container">
      <div className="event-header-image-container">
        <img 
          src={eventImageUrl}
          alt="eventBanner" 
          className="event-header-image" 
        />
      </div>

      <div className="event-content-container">
        <div className="event-page-box">
          <div className="event-name-header">
            <h3>Event Title</h3>
            <div className="event-underline"></div>
            <p style={{ marginBottom: '20px' }}>{event.event_title}</p>
          </div>

          <div className="event-date-box">
            <h3>Date and Time</h3>
            <div className="event-underline"></div>
            <p style={{ marginBottom: '20px' }}>
              {new Date(event.date).toISOString().slice(0, 10).replace("T", " ")}
            </p>
          </div>

          <div className="event-location-box">
            <h3>Location</h3>
            <div className="event-underline"></div>
            <p style={{ marginBottom: '20px' }}>
              {event.location ? event.location : "ONLINE"}
            </p>
          </div>

          <div className="event-about-box">
            <h3>About Event</h3>
            <div className="event-underline"></div>
            <p style={{ marginBottom: '20px' }}>{event.description}</p>
          </div>
        </div>

        <div className="event-ticket-box">
          <h3>Ticket Type</h3>
          <div className="event-underline"></div>
          <p style={{ fontSize: '20px' }}>
            {selectedTicketType?.name || 'No Ticket Selected'} -{" "}
            {(selectedTicketType?.price === 0 || selectedTicketType?.price === null)
              ? "FREE"
              : `$${selectedTicketType?.price}`}
          </p>
          {ticketTypes.length > 0 && (
            <select
              className="ticket-type-dropdown"
              onChange={handleTicketTypeChange}
              value={selectedTicketType?.id || ''}
            >
              {ticketTypes.map(tt => (
                <option key={tt.id} value={tt.id}>
                  {tt.name} - {(tt.price === 0 || tt.price === null) ? "FREE" : `$${tt.price}`}
                </option>
              ))}
            </select>
          )}
          <button className="event-buy-button" onClick={handleBuyTickets}>
            Buy Ticket
          </button>
        </div>
      </div>

      <div className="event-review-section">
        <h3>Reviews</h3>
        <div className="event-underline"></div>
        {renderReviews(null)}
        <form onSubmit={handleReviewSubmit} className="event-review-form">
          <div className="review-input-container">
            <div className="profile-pic-container">
              <img
                src={authData?.profile_picture_url || Placeholder_PFP}
                alt="Profile"
                className="review-input-profile-pic"
              />
            </div>
            <div className="review-input-content">
              <div className="star-rating-input">
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    className={`star ${star <= reviewRating ? 'filled' : ''}`}
                    onClick={() => setReviewRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
              <input 
                type="text" 
                value={newReview} 
                onChange={handleReviewChange} 
                placeholder="Write a review..." 
                className="event-review-input"
              />
            </div>
          </div>
          <button type="submit" className="event-review-submit-button">
            Submit
          </button>
        </form>
      </div>

      {showLoginPopup && (
        <div className="login-popup">
          <div className="login-popup-content">
            <p>You must be logged in to submit a review.</p>
            <button onClick={() => setShowLoginPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventPage;
