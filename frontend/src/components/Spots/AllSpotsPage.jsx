import { useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { fetchAllSpots } from "../../store/spots";
import {Link} from 'react-router-dom';
import './AllSpotsPage.css'

function AllSpotsPage() {
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spots || {});
  const spotsArray = Object.values(spots);

  useEffect(() => {
    dispatch(fetchAllSpots());
  }, [dispatch]);

  // helper function to get star rating display as per AirBnB MVP requirement
  const getStarRating = (spot) => {
    if (!spot.avgRating || spot.numReviews === 0) {
      return "New";
    }
    return spot.avgRating.toFixed(1);
  };

  return(
    <div className="spots-page">

      <div className="spots-grid">
        {spotsArray.map(spot => (
          <Link to={`/spots/${spot.id}`} className="spot-card" key={spot.id} title={spot.name}>
            <div className="spot-image-container">
            <img
              className="spot-image"
              src={spot.previewImage}
              alt={spot.name}
            />
            </div>
            <div className="spot-info">
              <div className="spot-location-rating">
                <span className="spot-location">{spot.city}, {spot.state}</span>
                <span className="spot-rating">
                  <span className="star-icon">★</span>
                  <span className="rating-text">{getStarRating(spot)}</span>
                </span>
              </div>
              <div className="spot-price">
                <span className="price-amount">${spot.price}</span>
                <span className="price-label">  night</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default AllSpotsPage;
