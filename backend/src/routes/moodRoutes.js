const express = require('express');
const router = express.Router();
const moodController = require('../controllers/moodController');
const requireAuth = require('../middlewares/authMiddleware');

router.get('/today', requireAuth, moodController.checkTodayStatus);
router.post('/', requireAuth, moodController.logMoodToday);
router.get('/', requireAuth, moodController.getHistory);
router.get('/all', requireAuth, moodController.getAll);
router.delete('/today', requireAuth, moodController.deleteToday);

module.exports = router;