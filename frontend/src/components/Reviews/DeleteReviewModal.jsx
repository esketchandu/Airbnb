import { useDispatch } from "react-redux";
import { deleteReviewThunk } from "../../store/reviews";
import { useModal } from "../../context/Modal";
import "./DeleteReviewModal.css";

function DeleteReviewModal({ reviewId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async () => {
    await dispatch(deleteReviewThunk(reviewId));
    closeModal();
  };

  return (
    <div className="delete-review-modal">
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to delete this review?</p>
      <button className="confirm-delete" onClick={handleDelete}>Yes (Delete Review)</button>
      <button className="cancel-delete" onClick={closeModal}>No (Keep Review)</button>
    </div>
  );
}

export default DeleteReviewModal;
