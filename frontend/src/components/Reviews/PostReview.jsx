import { useState } from "react";
import { useDispatch } from "react-redux";
import { createReviewThunk } from "../store/reviews";


function PostReview({ spotId, onClose }) {
  const dispatch = useDispatch();
  // These are local state for review text, star rating, error messages and hover state
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(0);
  const [errors, setErrors] = useState([]);
  const [hoveredStar, setHoveredStar] = useState(0);

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
      if (onClose) onClose(); // Close modal after successful submission
    } catch (res) {
      // check for error and if there is error parse and display the error
      const data = await res.json();
      if (data?.errors) setErrors(data.errors);
      else setErrors(["Something went wrong. Please try again."]);
    }
  };

}

export default PostReview;
