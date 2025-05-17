import { useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { fetchAllSpots } from "../../store/spots";
import {Link} from 'react-router-dom';

function AllSpotsPage() {
  const dispatch = useDispatch();

  const spots = useSelector((state) => state.spots);

  const spotsArray = object.values(spots);

  useEffect(() => {
    dispatch(fetchAllSpots());
  }, [dispatch]);

  return(
    <div>
      <h1>Explore Spots</h1>
      <div className="spots-grid">
        {spotsArray.map(spot => (
          <div key={spot.id} className="spot-card">
            <Link to={`/spots/${spot.id}`}>
            <img src={spot.previewImage} alt={spot.name} style={{width: '300px', height: '200px', objectFit: 'cover'}} />
            <h3>{spot.name}</h3>
            <p>{spot.city}, {spot.state}</p>
            <p>Price: ${spot.price} per night</p>
            <p>Rating: {spot.avgRating ? spot.avgRating.toFixed(1) : 'New'}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllSpotsPage;
