const express = require('express');
const { Booking, User, Spot, SpotImage, sequelize, Sequelize } = require('../../db/models');
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

// Edit a Booking; Update and return an existing booking

router.put('/:bookingId', requireAuth, async (req, res) => {
  const { bookingId } = req.params;
  const { startDate, endDate } = req.body;
  const { user } = req;

  // Get today's date in the format of YYYY-MM-DD format
  const todaysDate = new Date().toISOString().split('T')[0];

  // Find the booking using the bookingId
  const booking = await Booking.findByPk(bookingId)

  // check if the booking exists or not
  if (!booking) {
    return res.status(404).json({
      message: "Booking couldn't be found"
    })
  }

  // Check if the booking belongs to the current logged in user
  if (booking.userId !== user.id) {
    return res.status(403).json({
      message: "You are not authorized to edit this booking"
    })
  }

  // Check the booking hasn't passed its end date
  if (new Date(booking.endDate) < new Date(todaysDate)) {
    return res.status(403).json({
      message: "Past bookings can't be modified"
    })
  }

  // Next validate startDate and endDate
  const errors = {}
  if (new Date(startDate) < new Date(todaysDate)) {
    errors.startDate = 'startDate cannot be in the past'
  }
  if (new Date(startDate) >= new Date(endDate)) {
    errors.endDate = 'endDate cannot be on or before startDate'
  }

  if(Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: 'Bad Request',
      errors
    })
  }

  // Check if there are booking conflicts
  const conditions = {
    spotId: booking.spotId,
    id: { [sequelize.Op.ne]: bookingId }, // This is to exclude the current booking
    [sequelize.Op.or]: [
      {
        startDate: {
          [sequelize.Op.between]: [startDate, endDate],
        },
      },
      {
        endDate: {
          [sequelize.Op.between]: [startDate, endDate],
        },
      },
      {
        [sequelize.Op.and]: [
          {
            startDate: {
              [sequelize.Op.lte]: startDate,
            },
          },
          {
            endDate: {
              [sequelize.Op.gte]: endDate,
            },
          },
        ],
      },
    ],
  };

  const exisingBookings = await Booking.findAll({
    where: conditions,
  });

  if (exisingBookings.length > 0) {
    return res.status(403).json({
      message: 'Sorry, this spot is already booked for the specified dates',
      errors: {
        startDate: 'Start date conflicts with an existing booking',
        endDate: 'End date conflicts with an existing booking'
      }
    })
  }

  // Update the booking
  await booking.update({startDate, endDate});

  // Finally return the updated booking
  res.status(200).json(booking)
})

module.exports = router;
