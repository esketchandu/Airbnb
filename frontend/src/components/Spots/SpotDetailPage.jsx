import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpotDetails } from "../../store/spots";
import './SpotDetailPage.css';
import { loadReviews } from "../../store/reviews";

function SpotDetailPage() {
  const { spotId } = useParams()
  const dispatch = useDispatch()
  const spot = useSelector(state => state.spots[spotId])
  const reviews = useSelector(state => state.reviews[spotId]) || [];

  useEffect(() => {
    dispatch(fetchSpotDetails(spotId));
    dispatch(loadReviews(spotId));
  }, [dispatch, spotId]);

// check if spot data has not loaded yet
  if (!spot || !spot.SpotImages) {
    return (
    <div>
      <p>Loading spot details...</p>
    </div>
    )
  }
  const previewImage = spot.SpotImages?.find(img => img.preview)?.url;
  const additionalImages = spot.SpotImages ? spot.SpotImages.filter(img => !img.preview).slice(0, 4) : [];

  return (
    <div className="spot-detail-page">
      <h1>{spot.name}</h1>
      <p className="spot-location">{spot.city}, {spot.state}, {spot.country}</p>

      <div className="spot-images">
        <img className="main-image" src={previewImage} alt="Preview" />
        <div className="small-images">
          {additionalImages.map((img, idx) => (
            <img key={idx} src={img.url} alt={`Spot image ${idx + 1}`} />
          ))}
        </div>
      </div>

      <div className="spot-detail-body">
        <div className="spot-description">
          <h2>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h2>
          <p>{spot.description}</p>
        </div>

        <div className="spot-callout-box">
          <p><strong>${spot.price}</strong> night</p>
          <button onClick={() => alert('Feature coming soon')}>Reserve</button>
        </div>
      </div>

      <div className="spot-reviews-section">
        <h2>Reviews</h2>
        {reviews.length === 0 ? (
          <p>Be the first to post a review!</p>
       ) : (
         reviews.map(review => (
            <div key={review.id} className="review-item">
              <p><strong>{review.User?.firstName}</strong></p>
              <p>{new Date(review.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
              <p>{review.review}</p>
      </div>
    ))
  )}
</div>
    </div>
  );
}

export default SpotDetailPage;
