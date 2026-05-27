const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const requireAuth = require('../middlewares/authMiddleware');

// POST /api/ai/chat - Send message to AI counselor
router.post('/chat', requireAuth, aiController.chat);

module.exports = router;
