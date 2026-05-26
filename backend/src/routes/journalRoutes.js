const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journalController');
const requireAuth = require('../middlewares/authMiddleware');

router.use(requireAuth);

router.post('/', journalController.create);           // C - Create
router.get('/', journalController.getAll);            // R - Read All
router.get('/:id', journalController.getById);        // R - Read Single
router.put('/:id', journalController.update);         // U - Update
router.delete('/:id', journalController.remove);      // D - Delete

module.exports = router;