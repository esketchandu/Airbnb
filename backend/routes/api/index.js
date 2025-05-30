// backend/routes/api/index.js
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js');
const reviewsRouter = require('./reviews');
const bookingsRouter = require('./bookings');
const spotImagesRouter = require('./spotImages');
const reviewImagesRouter = require('./reviewImages');

const { restoreUser } = require("../../utils/auth.js");

// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null

// Restore user session
router.use(restoreUser);

// Define routes
router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/spots', spotsRouter);

router.use('/reviews', reviewsRouter);

router.use('/bookings', bookingsRouter);

router.use('/spot-images', spotImagesRouter);

router.use('/review-images', reviewImagesRouter);

// Keep this route to test frontend setup in Mod 5
router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;
