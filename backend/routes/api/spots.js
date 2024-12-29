const express = require('express');
const { Spot, User, SpotImage, Review, sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check, validationResult } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

//Get all spots

router.get('/', async (req, res) => {
  const spots = await Spot.findAll({
    attributes: {
      include: [
        // Calculate the average rating using a subquery
        [
          sequelize.literal(`(
            SELECT AVG("stars")
            FROM "Reviews"
            WHERE "Reviews"."spotId" = "Spot"."id"
          )`),
          'avgRating'
        ],
        // Include the preview image URL using a subquery
        [
          sequelize.literal(`(
            SELECT "url"
            FROM "SpotImages"
            WHERE "SpotImages"."spotId" = "Spot"."id" AND "SpotImages"."preview" = true
            LIMIT 1
          )`),
          'previewImage'
        ]
      ]
    }
  });

  res.status(200).json({ Spots: spots });
});

// Get all Spots owned by the current user

router.get('/current', requireAuth, async (req, res) => {

    const { user } = req; // Get the current user's ID

    // Query spots owned by the current user
    const spots = await Spot.findAll({
      where: { ownerId: user.id },
      attributes: {
        include: [
          // Calculate avgRating using a subquery
          [
            sequelize.literal(`(
              SELECT AVG("stars")
              FROM "Reviews"
              WHERE "Reviews"."spotId" = "Spot"."id"
            )`),
            'avgRating'
          ],
          // Fetch the preview image URL using a subquery
          [
            sequelize.literal(`(
              SELECT "url"
              FROM "SpotImages"
              WHERE "SpotImages"."spotId" = "Spot"."id" AND "SpotImages"."preview" = true
              LIMIT 1
            )`),
            'previewImage'
          ]
        ]
      }
    });

    // check if spots are empty for current user and return appropriate message
    if (spots.length === 0) {
      return res.status(404).json({
        message: 'Current user do not own spots'
      })

    }

    // Respond with the spots
    res.status(200).json({ Spots: spots });
});

// Get details of a Spot from an id

router.get('/:spotId', async (req, res) => {
  const { spotId } = req.params;

  // Fetch the spot details
  const spot = await Spot.findOne({
    where: { id: spotId },
    attributes: {
      include: [
        // Calculate avgStarRating using a subquery
        [
          sequelize.literal(`(
            SELECT AVG("stars")
            FROM "Reviews"
            WHERE "Reviews"."spotId" = "Spot"."id"
          )`),
          'avgStarRating'
        ],
        // Calculate numReviews using a subquery
        [
          sequelize.literal(`(
            SELECT COUNT("id")
            FROM "Reviews"
            WHERE "Reviews"."spotId" = "Spot"."id"
          )`),
          'numReviews'
        ]
      ]
    },
    include: [
      {
        model: SpotImage,
        attributes: ['id', 'url', 'preview']
      },
      {
        model: User,
        as: 'Owner',
        attributes: ['id', 'firstName', 'lastName']
      }
    ]
  });

  // If spot doesn't exist, return 404 error
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found"
    });
  }

  const formattedSpot = {
    ...spot.toJSON(), // Includes all regular attributes and associations
    lat: parseFloat(spot.lat),
    lng: parseFloat(spot.lng),
    price: parseFloat(spot.price),
    avgStarRating: spot.get('avgStarRating') ? parseFloat(spot.get('avgStarRating')) : 0, // Use get() to retrieve subquery values
    numReviews: spot.get('numReviews') ? parseInt(spot.get('numReviews'), 10) : 0 // Use get() to retrieve subquery values
  };

  // Respond with spot details
  res.status(200).json(formattedSpot);
});


// Create a spot for authorized and logged in user

// Validation middleware
const validateSpot = [
  check('address')
    .notEmpty().withMessage('Street address is required'),
  check('city')
    .notEmpty().withMessage('City is required'),
  check('state')
    .notEmpty().withMessage('State is required'),
  check('country')
    .notEmpty().withMessage('Country is required'),
  check('lat')
    .notEmpty().withMessage('Latitude is required')
    .bail() // Prevent further validation if this fails
    .isFloat({ min: -90, max: 90 }).withMessage('Latitude must be within -90 and 90'),
  check('lng')
    .notEmpty().withMessage('Longitude is required')
    .bail()
    .isFloat({ min: -180, max: 180 }).withMessage('Longitude must be within -180 and 180'),
  check('name')
    .notEmpty().withMessage('Name is required')
    .bail()
    .isLength({ max: 50 }).withMessage('Name must be less than 50 characters'),
  check('description')
    .notEmpty().withMessage('Description is required'),
  check('price')
    .notEmpty().withMessage('Price is required')
    .bail()
    .isFloat({ gt: 0 }).withMessage('Price per day must be a positive number'),
    handleValidationErrors
];

// Create a Spot for validated input, authorized and logged in user

router.post('/', requireAuth, validateSpot, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  const { user } = req;

  // Validate the request body
  const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // Transform errors into the desired format
      const formattedErrors = {};
      errors.array().forEach((error) => {
        formattedErrors[error.param] = error.msg;
      });

    return res.status(400).json({
      message: 'Bad Request',
      errors: errorsFormatted,
    });
  }

  // Create the spot
  const newSpot = await Spot.create({
    ownerId: user.id,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });

  // Respond with the newly created spot
  res.status(201).json(newSpot);
});

// Create and return a new image for a spot specified by id

router.post('/:spotId/images', requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const { url, preview } = req.body;
  const { user } = req;

  // Find the spot by id
  const spot = await Spot.findByPk(spotId);

  // If spot doesn't exist, return 404 error
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  // Check if the current user owns the spot
  if (spot.ownerId !== user.id) {
    return res.status(403).json({
      message: "You are not authorized to add an image to this spot",
    });
  }

  // Create the spot image
  const newImage = await SpotImage.create({
    spotId: spot.id,
    url,
    preview,
  });

  // Respond with the newly created image
  res.status(201).json({
    id: newImage.id,
    url: newImage.url,
    preview: newImage.preview,
  });
});

// Edit a Spot; this updates and returns an existing spot

router.put('/:spotId', requireAuth, validateSpot, async (req, res) => {
  const { spotId } = req.params;
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  const { user } = req;

  // First Validate the request body
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorsFormatted = {};
    errors.array().forEach((error) => {
      errorsFormatted[error.param] = error.msg;
    });

    return res.status(400).json({
      message: 'Bad Request',
      errors: errorsFormatted,
    });
  }

  // Find the spot to be edited using the spotId
  const spot = await Spot.findByPk(spotId);

  // If the spot with the given spotId doesn't exist, return 404 error
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  // Check if the current loggedin user owns the spot
  if (spot.ownerId !== user.id) {
    return res.status(403).json({
      message: "You are not authorized to edit this spot",
    });
  }

  // Update the spot
  await spot.update({
    address: spot.address,
    city: spot.city,
    state: spot.state,
    country: spot.country,
    lat: spot.lat,
    lng: spot.lng,
    name: spot.name,
    description: spot.description,
    price: spot.price
  });

  // Finally respond with the updated spot
  res.status(200).json(spot)
})

module.exports = router;
