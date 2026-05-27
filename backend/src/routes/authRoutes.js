const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const requireAuth = require('../middlewares/authMiddleware');

// Public routes (no auth required)
router.post('/signup', authController.register);
router.post('/signin', authController.login);
router.get('/google', authController.googleLogin);
router.get('/callback', authController.callback);
router.post('/forgot-password', authController.forgotPasswordRequest);

// Protected routes (auth required)
router.post('/reset-password', requireAuth, authController.forgotPasswordReset);

module.exports = router;