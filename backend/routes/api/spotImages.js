const express = require('express');
const { Spot, SpotImage} = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

// Delete a Spot Image; delete an existing image for a Spot

router.delete('/:imageId', requireAuth, async (req, res) => {
  const { imageId } = req.params;
  const { user } = req;

  // Find the spotimage by using imageId and include the associated spot
  // Include the ownerId to check the authorization
  const spotImage = await SpotImage.findByPk(imageId, {
    include: {
      model: Spot,
      attributes: ['ownerId'],
    }
  })

  // Check if the spotImage exists, if it doesn't exist, return 404 error
  if (!spotImage) {
    return res.status(404).json({
      message: "Spot Image couldn't be found"
    })
  }

  // Check if the current logged in user owns the spot
  if (spotImage.Spot.ownerId !== user.id) {
    return res.status(403).json({
      message: "You are not authorized to delete this image"
    })
  }

  // Delete the spot image
  await spotImage.destroy();

  // Finally respond with the success message
  return res.status(200).json({
    message: "Successfully deleted"
  })
});

module.exports = router;
