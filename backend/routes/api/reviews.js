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

  // check if reviews are empty for current user and return appropriate message
    if (reviews.length === 0) {
      return res.status(404).json({
        message: 'Current user do not have reviews'
      })
    }

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

  // Create the new review image
  const reviewImg = await ReviewImage.create({
    reviewId,
    url
  })

  // Finally respond with the newly created image
  res.status(201).json({
    id: reviewImg.id,
    url: reviewImg.url
  })

});

// Edit a review owned by the current logged in user

// Validation middleware to validate the reviews
const validateReview = [
  check('review')
    .notEmpty()
    .withMessage('Review text is required'),
  check('stars')
    .isInt({ min: 1, max: 5})
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
]

router.put('/:reviewId', requireAuth, validateReview, async (req, res) => {
  const { reviewId } = req.params;
  const { review, stars } = req.body;
  const { user } = req;

  // Find the review using the reviewId
  const existReview = await Review.findByPk(reviewId);

  if (!existReview) {
    return res.status(404).json({
      message: "Review couldn't be found"
    })
  }

  // Check if the current loggedin user owns the review
  if (existReview.userId !== user.id) {
    return res.status(403).json({
      message: "You are not authorized to edit this review"
    })
  }

  // Update the review
  existReview.review = review
  existReview.stars = stars
  await existReview.save();

  // Finally respond with the updated review
  res.status(200).json(existReview);
});

// Delete a review owned by the current logged in user

router.delete('/:reviewId', requireAuth, async (req, res) => {
  const { reviewId } = req.params;
  const { user } = req;

  // Find the review by its reviewId
  const review = await Review.findByPk(reviewId);

  // Check if the review exists, if not return error message with 404 status
  if (!review) {
    return res.status(404).json({
      message: "Review couldn't be found"
    })
  }

  // Check if the current logged in user owns the review
  if (review.userId !== user.id) {
    return res.status(403).json({
      message: "You are not authorized to delete this review"
    })
  }

  // If current logged in user owns the review, delete the review
  await review.destroy()

  // Finally respond with the success message
  res.status(200).json({
    message: "Sucessfully deleted"
  })
});

module.exports = router;
