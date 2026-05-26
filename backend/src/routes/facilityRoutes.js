const express = require('express');
const router = express.Router();
const facilityController = require('../controllers/facilityController');
const requireAuth = require('../middlewares/authMiddleware');

router.use(requireAuth); 

router.get('/nearby', facilityController.getNearby);

module.exports = router;