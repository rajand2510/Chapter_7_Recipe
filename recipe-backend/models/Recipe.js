const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: String,
  quantity: String,
  unit: String, // e.g., grams, cups, tbsp
});

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: String,
  ingredients: [ingredientSchema],
  steps: [String],
  cuisine: String,
  cookingTime: Number, // in minutes
  servings: Number,
  ratings: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: Number
  }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // reference to User
}, { timestamps: true });

// Auto populate author with _id and username on all finds
function autoPopulateAuthor(next) {
  this.populate('author', '_id username');
  next();
}

recipeSchema
  .pre('find', autoPopulateAuthor)
  .pre('findOne', autoPopulateAuthor)
  .pre('findById', autoPopulateAuthor)
  .pre('findOneAndUpdate', autoPopulateAuthor); // Also works for updates

module.exports = mongoose.model('Recipe', recipeSchema);
