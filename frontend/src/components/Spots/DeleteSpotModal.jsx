import { useDispatch } from 'react-redux';
import { deleteSpot } from '../../store/spots';
import { useModal } from '../../context/Modal';
import { useNavigate } from 'react-router-dom';
import './DeleteSpotModal.css'; // we’ll create simple css for this

function DeleteSpotModal({ spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const navigate = useNavigate();

  const handleDelete = async () => {
    await dispatch(deleteSpot(spotId));
    closeModal();
    navigate('/manage-spots');
  };

  return (
    <div className="delete-modal">
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to remove this spot from the listings?</p>

      <div className="delete-buttons">
        <button className="confirm" onClick={handleDelete}>Yes (Delete Spot)</button>
        <button className="cancel" onClick={closeModal}>No (Keep Spot)</button>
      </div>
    </div>
  );
}

export default DeleteSpotModal;
