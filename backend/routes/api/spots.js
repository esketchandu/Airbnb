const express = require('express');
const { Spot, User, SpotImage, Review, sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

// Get all spots
// router.get('/', async (req, res) => {
//   const spots = await Spot.findAll({
//     include: [
//       {
//         model: User,
//         //as: 'Owner',
//         attributes: ['id', 'firstName', 'lastName']
//       },
//       {
//         model: SpotImage,
//         where: { preview: true },
//         required: false, // Join only if a preview image exists
//         attributes: ['url']
//       }
//     ]
//   });
//   res.json({ Spots: spots });
// });

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
    ...spot.toJSON(),
    lat: parseFloat(spot.lat),
    lng: parseFloat(spot.lng),
    price: parseFloat(spot.price),
    avgStarRating: parseFloat(spot.avgStarRating),
    numReviews: parseInt(spot.numReviews, 10)
  };

  // Respond with spot details
  res.status(200).json(formattedSpot);
});



module.exports = router;
