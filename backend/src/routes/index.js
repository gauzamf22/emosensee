const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');
const moodRoutes = require('./moodRoutes');
const journalRoutes = require('./journalRoutes');
const facilityRoutes = require('./facilityRoutes');

// Daftar route
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/moods', moodRoutes);
router.use('/journals', journalRoutes);
router.use('/facilities', facilityRoutes);

module.exports = router;