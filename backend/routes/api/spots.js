const express = require('express');
const { Spot, User, SpotImage, Review } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

// Get all spots
router.get('/', async (req, res) => {
  const spots = await Spot.findAll({
    include: [
      {
        model: User,
        as: 'Owner',
        attributes: ['id', 'firstName', 'lastName']
      },
      {
        model: SpotImage,
        where: { preview: true },
        required: false, // Join only if a preview image exists
        attributes: ['url']
      }
    ]
  });
  res.json({ Spots: spots });
});
