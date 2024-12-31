const express = require('express');
const { Booking, User, Spot, SpotImage, sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { check, validationResult } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

// Get all of the bookings of the current logged in user

router.get('/current', requireAuth, async (req, res) => {
  const { user } = req;

  // Find all the bookings of the current user
  const bookings = await Booking.findAll({
    where: { userId: user.id },
    include: [
      {
        model: Spot,
        attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
        include: [
          {
            model: SpotImage,
            where: { preview: true},
            attributes: ['url'],
            required: false, // include evenif no preview image exisis
          },
        ],
      },
    ],

  });

  // Check if current user has any bookings
  if (bookings.length === 0) {
    return res.status(404).json({
        message: 'Current user do not have bookings'
    }
  )}

  // Format the response
  const formattedBookings = bookings.map((booking) => {
    const bookingJson = booking.toJSON()

    // Add the previewImage to the Spot object
    if (bookingJson.Spot && bookingJson.Spot.SpotImages && bookingJson.Spot.SpotImages[0]) {
      bookingJson.Spot.previewImage = bookingJson.Spot.SpotImages[0].url;
  } else {
    bookingJson.Spot.previewImage = null
  }
    // Remove the nested SpotImages array from the Spot object
    delete bookingJson.Spot.SpotImages;
    return bookingJson
  });

  // Finally respond with the user's bookings
  res.status(200).json({ Bookings: formattedBookings});
});

module.exports = router;
