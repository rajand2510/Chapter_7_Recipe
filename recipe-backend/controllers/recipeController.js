const Recipe = require('../models/Recipe');
const User = require('../models/User');

const getRecipes = async (req, res) => {
  try {
    const { search, cuisine, maxTime, page = 1, limit = 9 } = req.query;
    let filter = {};

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    if (cuisine && cuisine !== "all") {
      filter.cuisine = cuisine;
    }

    if (maxTime && maxTime !== "all") {
      filter.cookingTime = { $lte: Number(maxTime) };
    }

    // Calculate skip value for pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Fetch recipes with pagination and latest first
    const recipes = await Recipe.find(filter)
      .populate("author", "username")
      .sort({ createdAt: -1 }) // latest first
      .skip(skip)
      .limit(Number(limit));

    // Count total matching documents for frontend pagination UI
    const total = await Recipe.countDocuments(filter);

    res.json({
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      recipes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Get single recipe by id
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('author', 'username')
      .populate('ratings.user', 'username');

    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createRecipe = async (req, res) => {
  const { title, image, ingredients, steps, cuisine, cookingTime, servings } = req.body;

  try {
    // 1. Create new recipe
    const recipe = new Recipe({
      title,
      image,
      ingredients,
      steps,
      cuisine,
      cookingTime,
      servings,
      author: req.user._id,
    });

    const createdRecipe = await recipe.save();

    // 2. Add recipe ID to user's createdRecipes
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { createdRecipes: createdRecipe._id } },
      { new: true }
    ).populate({
      path: 'createdRecipes',
      populate: { path: 'author', select: 'username email' }
    });

    // 3. Send response: created recipe + full list of user's recipes
    res.status(201).json({
      createdRecipe,
      userRecipes: updatedUser.createdRecipes
    });

  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};



// Update recipe
// Update recipe
const updateRecipe = async (req, res) => {
  const { title, image, ingredients, steps, cuisine, cookingTime, servings } = req.body;

  try {
    const recipe = await Recipe.findById(req.params.id).populate('author', '_id');

    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    // Handle populated or non-populated author
    const authorId = recipe.author._id ? recipe.author._id.toString() : recipe.author.toString();

    if (authorId !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Update fields only if they are provided
    recipe.title = title ?? recipe.title;
    recipe.image = image ?? recipe.image;
    recipe.ingredients = ingredients ?? recipe.ingredients;
    recipe.steps = steps ?? recipe.steps;
    recipe.cuisine = cuisine ?? recipe.cuisine;
    recipe.cookingTime = cookingTime ?? recipe.cookingTime;
    recipe.servings = servings ?? recipe.servings;

    const updatedRecipe = await recipe.save();

    res.json(updatedRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Delete recipe
// Delete recipe
const deleteRecipe = async (req, res) => {
  try {
    // Find the recipe
    const recipe = await Recipe.findById(req.params.id).populate('author', '_id');

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const authorId = recipe.author._id ? recipe.author._id.toString() : recipe.author.toString();

    // Authorization check
    if (authorId !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Delete the recipe
    await Recipe.deleteOne({ _id: recipe._id });

    res.json({ message: 'Recipe removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Rate a recipe
const rateRecipe = async (req, res) => {
  const { rating } = req.body;

  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    // Check if user already rated
    const alreadyRated = recipe.ratings.find(r => r.user.toString() === req.user._id.toString());

    if (alreadyRated) {
      alreadyRated.rating = rating; // update rating
    } else {
      recipe.ratings.push({ user: req.user._id, rating });
    }

    await recipe.save();

    res.json({ message: 'Rating added/updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get all recipes by author ID
const getRecipesByAuthor = async (req, res) => {
  try {
    const { authorId } = req.params;

    const recipes = await Recipe.find({ author: authorId })
      .populate('author', 'username');

    if (!recipes || recipes.length === 0) {
      return res.status(404).json({ message: 'No recipes found for this author' });
    }

    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  rateRecipe,
  getRecipesByAuthor
};
