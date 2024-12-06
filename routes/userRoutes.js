const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');
const authController = require('../controllers/authControllers');
const authMiddleware = require('../middleware/authMiddleware');



router.get('/availability', userController.getSeatAvailability);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/book',  authMiddleware, userController.bookSeat);
router.get('/get-all-booking-details', authMiddleware, userController.getBookingDetails);


module.exports = router;

