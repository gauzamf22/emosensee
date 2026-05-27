const express = require('express');
const router = express.Router();
const insightController = require('../controllers/insightController');
const requireAuth = require('../middlewares/authMiddleware');

router.use(requireAuth);

router.get('/daily', insightController.getTodayInsight);
router.post('/generate', insightController.generateInsight);

module.exports = router;
