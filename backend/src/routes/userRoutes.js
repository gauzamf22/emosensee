const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const requireAuth = require('../middlewares/authMiddleware');

router.put('/profile', requireAuth, userController.updateProfile);
router.put('/settings', requireAuth, userController.updatePreferences);

module.exports = router;