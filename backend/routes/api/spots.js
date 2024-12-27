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

module.exports = router;
