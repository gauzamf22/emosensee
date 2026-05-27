const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const requireAuth = require('../middlewares/authMiddleware');

router.use(requireAuth);

router.post('/chat', aiController.chatWithAI);
router.post('/analyze', aiController.analyzeUserText);
router.get('/insight', aiController.generateAIInsight)

module.exports = router;