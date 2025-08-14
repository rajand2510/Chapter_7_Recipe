const Comment = require('../models/Comment');
const Recipe = require('../models/Recipe');

// Add comment to recipe
const addComment = async (req, res) => {
  const { content } = req.body;
  const recipeId = req.params.id;

  try {
    const comment = new Comment({
      user: req.user._id,
      recipe: recipeId,
      content,
    });

    await comment.save();

    // Optional: ensure the recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// Get comments for a recipe
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ recipe: req.params.id })
      .populate('user', 'username')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addComment, getComments };
