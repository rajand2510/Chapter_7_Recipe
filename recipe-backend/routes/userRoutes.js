const express = require('express');
const router = express.Router();
const { getUserProfile, addFavorite, removeFavorite } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/profile', protect, getUserProfile);
router.post('/favorites/:id', protect, addFavorite);
router.delete('/favorites/:id', protect, removeFavorite);

module.exports = router;
