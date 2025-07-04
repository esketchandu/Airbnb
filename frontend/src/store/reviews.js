import { csrfFetch } from "./csrf";

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

// Action type
// const add_review = 'reviews/add_review'
const delete_review = 'reviews/delete_review'

// These are Action creator for review
// const addReview = (review) => ({
//   type: add_review,
//   review
// });

const deleteReview = (reviewId) => ({
  type: delete_review,
  reviewId
});

// Thunk to create a review
export const createReviewThunk = (spotId, reviewData) => async(dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    //credentials: 'include',
    body: JSON.stringify(reviewData)
  });

  if(!res.ok){
    const errorData = await res.json()
    throw errorData
  }

  // Next is to dispatch to redux so the new review for the spot is added
  const newReview = await res.json()
  //dispatch(addReview(newReview))
  dispatch(loadReviews(spotId))
  return newReview
}

// Thunk to delete a review
export const deleteReviewThunk = (reviewId) => async(dispatch) => {
  const res = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: 'DELETE',
    //credentials: 'include'
  });

  if(res.ok){
    dispatch(deleteReview(reviewId))
  } else {
    const errorData = await res.json()
    throw errorData
  }
};

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
    // case add_review: {
    //   return{
    //     ...state,
    //     [action.review.id]: action.review
    //   };
    // }
    case delete_review: {
      const newState = { ...state };
      delete newState[action.reviewId];
      return newState;
    }
    default:
      return state;
  }
}
