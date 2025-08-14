const User = require('../models/User');
const Recipe = require('../models/Recipe');

const getRecommendedRecipes = async (req, res) => {
  try {
    // Get user and populate favorites
    const user = await User.findById(req.user._id).populate('favorites');
    if (!user || !user.favorites.length) return res.json([]);

    // Collect cuisines from favorites
    const favoriteCuisines = user.favorites
      .map(recipe => recipe.cuisine)
      .filter(Boolean);

    // Collect top ingredients from favorites
    const favoriteIngredients = [];
    user.favorites.forEach(recipe => {
      recipe.ingredients.forEach(ing => {
        if (!favoriteIngredients.includes(ing.name)) favoriteIngredients.push(ing.name);
      });
    });

    // Find recipes not in favorites but with similar cuisine OR at least 1 matching ingredient
    const recommendations = await Recipe.find({
      _id: { $nin: user.favorites.map(f => f._id) },
      $or: [
        { cuisine: { $in: favoriteCuisines } },
        { 'ingredients.name': { $in: favoriteIngredients } }
      ]
    })
    .sort({ createdAt: -1 }) // latest first
    .limit(3);

    res.json(recommendations);

  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRecommendedRecipes };
