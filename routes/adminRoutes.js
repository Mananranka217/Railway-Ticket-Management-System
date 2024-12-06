const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminControllers');
const apiKeyMiddleware = require('../middleware/apiKeyMiddleware');


router.post('/add-new-train', apiKeyMiddleware.verifyApiKey, adminController.addNewTrain);
module.exports = router;
