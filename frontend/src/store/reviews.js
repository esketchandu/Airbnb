export const loadReviews = (spotId) => async (dispatch) => {
  const res = await fetch(`/api/spots/${spotId}/reviews`);
  if (res.ok) {
    const data = await res.json();
    dispatch(setReviews(data.Reviews));
  }
};

const set_reviews = 'reviews/setReviews';

const setReviews = (reviews) => ({
  type: set_reviews,
  reviews
});

// Initial state and reducer
const initialState = {};

export default function reviewsReducer(state = initialState, action) {
  switch (action.type) {
    case set_reviews: {
      const reviewsState = {};
      action.reviews.forEach(review => {
        reviewsState[review.id] = review;
      });
      return reviewsState;
    }
    default:
      return state;
  }
}
