import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {fetchUserSpots} from '../../store/spots';
import {Link, useNavigate} from 'react-router-dom';
import './ManageSpotsPage.css'

function ManageSpotsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const spots = useSelector(state => Object.values(state.spots));

  useEffect(() => {
    dispatch(fetchUserSpots());
  }, [dispatch]);

  if (!spots.length) {
    return (
      <div className="manage-spots-page">
        <h1>Manage Spots</h1>
        <p>You haven&apos;t created any spots yet.</p>
        <Link to="/spots/new">Create a New Spot</Link>
      </div>
    );
  }

  return (
    <div className="manage-spots-page">
      <h1>Manage Spots</h1>
      <div className="spot-tiles">
        {spots.map(spot => (
          <div key={spot.id} className="spot-tile" onClick={() => navigate(`/spots/${spot.id}`)}>
            <img src={spot.previewImage} alt={spot.name} />
            <div>{spot.city}, {spot.state}</div>
            <div>★ {spot.avgRating ? spot.avgRating.toFixed(1) : 'New'}</div>
            <div>${spot.price} per night</div>

            <div className="spot-actions">
              <button onClick={(e) => { e.stopPropagation(); navigate(`/spots/${spot.id}/edit`) }}>Update</button>
              <button onClick={(e) => { e.stopPropagation(); alert('Delete functionality coming soon') }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageSpotsPage;
