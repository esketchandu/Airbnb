const express = require('express');
const { Review, ReviewImage} = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

// Delete a Review Image; delete an existing image for a Review

router.delete('/review-images/:imageId', requireAuth, async (req, res) => {
  const { imageId } = req.params;
  const { user } = req;

  // Find the reviewimage by using imageId and include the asscoaited review
  // Include the userId to check the authorization
  const reviewImage = await ReviewImage.findByPk(imageId, {
    include: {
      model: Review,
      attributes: ['userId'],
    }
  });

  // Check if the reviewImage exists, if it doesn't exist, return 404 error
  if (!reviewImage) {
    return res.status(404).json({
      message: "Review Image couldn't be found"
    })
  }

  // Check if the current logged in user owns the review
  if (reviewImage.Review.userId !== user.id) {
    return res.status(403).json({
      message: "You are not authorized to delete this image"
    })
  }

  // Delete the review image
  await reviewImage.destroy();

  // Finally respond with the success message
  return res.status(200).json({
    message: "Successfully deleted"
  })
});

module.exports = router;
