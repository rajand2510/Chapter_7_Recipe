// routes/recommendations.js
const express = require('express');
const { getRecommendedRecipes } = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getRecommendedRecipes);

module.exports = router;
