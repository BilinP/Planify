import { useState } from 'react';
import PropTypes from 'prop-types';
import Placeholder_PFP from '../../assets/Placeholder_PFP.png';

const ReviewItem = ({
  review,
  level,
  childrenMarkup,
  authData,
  replyText,
  onReplyTextChange,
  onReplySubmit
}) => {
  const [isReplyOpen, setIsReplyOpen] = useState(false);

  return (
    <div className="event-review-item" style={{ marginLeft: level * 20 }}>
      <div className="event-review-container">
        <div className="event-review-profile">
          <img 
            src={authData?.profile_picture_url || Placeholder_PFP}
            alt="Profile" 
          />
        </div>
        <div className="event-review-content">
          <p>{review.review_txt}</p>
          {review.rating !== null && (
            <div className="star-rating-display">
              {[1, 2, 3, 4, 5].map(star => (
                <span key={star} className={star <= review.rating ? 'star filled' : 'star'}>
                  ★
                </span>
              ))}
            </div>
          )}
          <span 
            className="event-reply-button"
            onClick={(e) => {
              e.stopPropagation();
              setIsReplyOpen(!isReplyOpen);
            }}
          >
            Reply
          </span>
          {isReplyOpen && (
            <form onSubmit={(e) => onReplySubmit(review.id, e)}>
              <input 
                type="text" 
                value={replyText || ''} 
                onChange={(e) => onReplyTextChange(review.id, e.target.value)}
                placeholder="Write a reply..." 
                className="event-reply-input"
              />
              <button 
                type="submit" 
                className="event-review-submit-button" 
                style={{ marginTop: '5px' }}
              >
                Submit
              </button>
            </form>
          )}
        </div>
      </div>
      {childrenMarkup}
      {review.replies && review.replies.length > 0 && (
        <div className="nested-reviews">
          {review.replies.map(reply => (
            <ReviewItem 
              key={reply.id}
              review={reply}
              level={level + 1}
              authData={authData}
              replyText={replyText}
              onReplyTextChange={onReplyTextChange}
              onReplySubmit={onReplySubmit}
            />
          ))}
        </div>
      )}
    </div>
  );
};

ReviewItem.propTypes = {
  review: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    review_txt: PropTypes.string.isRequired,
    rating: PropTypes.number,
    parent_review_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    replies: PropTypes.arrayOf(PropTypes.object)
  }).isRequired,
  level: PropTypes.number,
  childrenMarkup: PropTypes.node,
  authData: PropTypes.shape({
    profile_picture_url: PropTypes.string
  }),
  replyText: PropTypes.string,
  onReplyTextChange: PropTypes.func.isRequired,
  onReplySubmit: PropTypes.func.isRequired
};

ReviewItem.defaultProps = {
  level: 0,
  childrenMarkup: null,
  authData: {},
  replyText: ''
};

export default ReviewItem;