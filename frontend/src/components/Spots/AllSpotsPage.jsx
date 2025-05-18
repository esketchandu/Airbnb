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

  //
  // if (!spotsArray.length) {
  //   return <p>Loading spots...</p>;
  // }

  return(
    <div className="spots-page">
      <h1>Explore Spots</h1>
      <div className="spots-grid">
        {spotsArray.map(spot => (
          <Link to={`/spots/${spot.id}`} className="spot-card" key={spot.id} title={spot.name}>
            <img
              className="spot-image"
              src={spot.previewImage}
              alt={spot.name}
              style={{ width: '300px', height: '200px', objectFit: 'cover' }}
            />
            <div className="spot-info">
              <div className="spot-location-rating">
                <span className="spot-location">{spot.city}, {spot.state}</span>
                <span className="spot-rating">★ {spot.avgRating ? spot.avgRating.toFixed(1) : 'New'}</span>
              </div>
              <p className="spot-price"><strong>${spot.price}</strong> night</p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}

export default AllSpotsPage;
