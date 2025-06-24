import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {fetchUserSpots} from '../../store/spots';
import {Link, useNavigate} from 'react-router-dom';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import DeleteSpotModal from './DeleteSpotModal';
import './ManageSpotsPage.css'

function ManageSpotsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const spots = useSelector(state => Object.values(state.spots));

  useEffect(() => {
    dispatch(fetchUserSpots());
  }, [dispatch]);

  // Helper function for star rating display
  const getStarRating = (spot) => {
    if (!spot.avgRating || spot.numReviews === 0 || isNaN(spot.avgRating)) {
      return "New";
    }
    return Number(spot.avgRating).toFixed(1);
  };

  if (!spots.length) {
    return (
      <div className="manage-spots-page">
        <h1>Manage Spots</h1>
        <div className="empty-state">
        <p>You haven&apos;t created any spots yet.</p>
        <Link to="/spots/new" className="create-spot-link">Create a New Spot</Link>
      </div>
    </div>
    );
  }

  return (
    <div className="manage-spots-page">
      <h1>Manage Spots</h1>
      <div className="spot-tiles">
        {spots.map(spot => (
          <div key={spot.id} className="spot-tile">
            <div className="tile-content" onClick={() => navigate(`/spots/${spot.id}`)}>
              <div className="spot-image-container">
                <img src={spot.previewImage} alt={spot.name} />
              </div>
              <div className="spot-info">
              {/* Location and rating in same row */}
              <div className="location-rating">
                <span className="location">{spot.city}, {spot.state}</span>
                <span className="rating">
                  <span className="star-icon">★</span>
                  <span className="rating-text">{getStarRating(spot)}</span>
                </span>
              </div>

              <div className="price">
                <span className="price-amount">${spot.price}</span>
                <span className="price-label">&nbsp;night</span>
            </div>
            </div>
            </div>

            {/* Update and Delete buttons below the spot info */}
            <div className="spot-actions">
              <button
                className="update-button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/spots/${spot.id}/edit`)
                }}
              >
                Update
              </button>
              <OpenModalButton
                buttonText="Delete"
                modalComponent={<DeleteSpotModal spotId={spot.id} />}
                onButtonClick={(e) => e.stopPropagation()} // Prevent tile click
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageSpotsPage;
