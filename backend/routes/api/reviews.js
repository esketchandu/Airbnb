const express = require('express');
const { Review, ReviewImage, User, Spot, SpotImage, sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check, validationResult } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

// Get all the reviews of the current loggedin user

router.get('/current', requireAuth, async (req, res) => {
  const { user } = req;

  // Find all the reviews written by the current user
  const reviews = await Review.findAll({
    where: { userId: user.id },
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName'],
      },
      {
        model: Spot,
        attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
        include: [
          {
            model: SpotImage,
            where: { preview: true },
            attributes: ['url'],
            required: false, // Include even if no preview image exists
          },
        ],
      },
      {
        model: ReviewImage,
        attributes: ['id', 'url'],
      },
    ],
  });

  // Format the response
  const formattedReviews = reviews.map((review) => {
    const reviewJSON = review.toJSON();

    // Add the previewImage to the Spot object
    if (reviewJSON.Spot && reviewJSON.Spot.SpotImages && reviewJSON.Spot.SpotImages[0]) {
      reviewJSON.Spot.previewImage = reviewJSON.Spot.SpotImages[0].url;
    } else {
      reviewJSON.Spot.previewImage = null;
    }

    // Remove the nested SpotImages array from the Spot object
    delete reviewJSON.Spot.SpotImages;

    // Convert lat, lng, and price to numeric values
    if (reviewJSON.Spot) {
      reviewJSON.Spot.lat = parseFloat(reviewJSON.Spot.lat);
      reviewJSON.Spot.lng = parseFloat(reviewJSON.Spot.lng);
      reviewJSON.Spot.price = parseFloat(reviewJSON.Spot.price);
    }

    return reviewJSON;
  });

   // Respond with the reviews
  res.status(200).json({ Reviews: formattedReviews });
});

module.exports = router;
