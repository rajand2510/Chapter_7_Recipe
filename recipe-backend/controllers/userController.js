const User = require('../models/User');
const Recipe = require('../models/Recipe');

// Get user profile
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('favorites')
    .populate('createdRecipes');

  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json(user);
};

// Add recipe to favorites
const addFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const recipeId = req.params.id;

    if (!user.favorites.includes(recipeId)) {
      user.favorites.push(recipeId);
      await user.save();
    }

    res.json({ message: 'Recipe added to favorites' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove recipe from favorites
const removeFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const recipeId = req.params.id;

    user.favorites = user.favorites.filter(fav => fav.toString() !== recipeId);
    await user.save();

    res.json({ message: 'Recipe removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserProfile, addFavorite, removeFavorite };
