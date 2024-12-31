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
            required: false, // Includes the spot even if no preview image exists
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
      reviewJSON.Spot.previewImage = null; // if no preview image exists, set previewImage to null
    }

    // Remove the nested SpotImages array from the Spot object
    delete reviewJSON.Spot.SpotImages;

    // Convert lat, lng, and price to numeric values for proper display in Render
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

// Add an image to a review based on the review's id

router.post('/:reviewId/images', requireAuth, async (req, res) => {
  const { reviewId } = req.params;
  const { url } = req.body;
  const { user } = req;

  // Check if the review exists
  const review = await Review.findByPk(reviewId)

  if (!review) {
    return res.status(404).json({
      message: "Review couldn't be found"
    })
  }

  // Check if the current loggedin user owns the review
  if (review.userId !== user.id) {
    return res.status(403).json({
      message: "You are not authorized to add images to this review"
    })
  }

  // Check if maximum number of images for the review was reached
  const imgCount = await ReviewImage.count({
    where: { reviewId }
  })

  if ( imgCount >=10 ) {
    return res.status(403).json({
      message: "Maximum number of images for this resource was reached"
    })
  }

  // create the new review image
  const reviewImg = await ReviewImage.create({
    reviewId,
    url
  })

  // Finally respond with the newly created image
  res.status(201).json({
    id: reviewImg.id,
    url: reviewImg.url
  })

})

module.exports = router;
