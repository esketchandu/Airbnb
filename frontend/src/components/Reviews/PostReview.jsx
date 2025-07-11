import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { createReviewThunk } from "../../store/reviews";
import './PostReview.css';


function PostReview({ spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal()
  // These are local state for review text, star rating, error messages and hover state
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(0);
  const [errors, setErrors] = useState([]);
  const [hoveredStar, setHoveredStar] = useState(0);

  // Reset form when modal opens
  useEffect(() => {
    setReview("");        // Clear review text
    setStars(0);          // Clear star rating
    setErrors([]);        // Clear any errors
    setHoveredStar(0);    // Clear hover state
  }, []);

  // Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    // input validation before dispatching
    if (review.length < 10 || stars === 0) {
      setErrors(["Review must be at least 10 characters and include a star rating."]);
      return;
    }

    try {
      await dispatch(createReviewThunk(spotId, { review, stars })); // disptach thunk to post the review
      closeModal() // Close modal after successful submission
      } catch (data) {
      // check for error and if there is error parse and display the error
      if (data?.errors) setErrors(data.errors);
      else setErrors(["Something went wrong. Please try again."]);
    }
  };

return (
    <div className="post-review-modal">
      <h2>How was your stay?</h2>

      {/* Error display section */}
      {errors.length > 0 && (
        <ul className="errors">
          {errors.map((err, idx) => <li key={idx}>{err}</li>)}
        </ul>
      )}

      {/* Review Form */}
      <form onSubmit={handleSubmit}>
        {/* This is for the textarea input for review comment */}
        <textarea
          placeholder="Leave your review here..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />

        {/* Star rating input */}
        <div className="star-input">
          {[1, 2, 3, 4, 5].map((num) => (
            <span
              key={num}
              className={num <= (hoveredStar || stars) ? "filled" : "empty"}
              onClick={() => setStars(num)}
              onMouseEnter={() => setHoveredStar(num)}
              onMouseLeave={() => setHoveredStar(0)}
            >★</span>
          ))}
          <span> Stars</span>
        </div>

        {/* Submit button is disabled if requirements are not met */}
        <button
          type="submit"
          disabled={review.length < 10 || stars === 0}
        >
          Submit Your Review
        </button>
      </form>
    </div>
  );

}

export default PostReview;
