// pages/Favorite.jsx
import React, { useEffect, useState, Suspense } from "react";

import RecipeCard from "../Components/RecipeCard";
import SkeletonCard from "../Components/SkeletonCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal";
import RecipeModal from "../Modal/RecipeModal";
import RecipeModalComments from "../Modal/RecipeModalComments";
import { useFavorite } from "../Context/useFavorite";

const Favorite = () => {
  const { favorites, loading } = useFavorite();
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const navigate = useNavigate();

  // Fetch full recipe details for favorites
  useEffect(() => {
    const fetchFavoriteRecipes = async () => {
      if (!favorites.length) {
        setFavoriteRecipes([]);
        return;
      }
      try {
        const recipeRequests = favorites.map((fav) =>
          axios.get(`https://chapter-7-recipe.onrender.com/api/recipes/${fav._id}`)
        );
        const responses = await Promise.all(recipeRequests);
        setFavoriteRecipes(responses.map((res) => res.data));
      } catch (err) {
        console.error("Failed to load favorite recipes:", err);
      }
    };

    fetchFavoriteRecipes();
  }, [favorites]);

  const openModal = (recipeId) => {
    const recipe = favoriteRecipes.find((r) => r._id === recipeId);
    setSelectedRecipe(recipe);
  };

  const closeModal = () => setSelectedRecipe(null);

  return (
    <div className="mt-26 px-6">
      {/* Centered Title like LATEST RECIPES */}
      <h3 className="font-archivo font-[900] text-4xl -mt-4 flex justify-center items-center">
        MY FAVORITE
      </h3>

      {loading && (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8 mt-8">
          {Array(6)
            .fill(null)
            .map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
        </div>
      )}

      {!loading && favoriteRecipes.length === 0 && (
        <p className="text-gray-600 text-lg text-center mt-8">
          You haven't added any favorites yet.
        </p>
      )}

      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-8 mt-8">
        {favoriteRecipes.map((recipe) => (
          <RecipeCard
            key={recipe._id}
            recipe={recipe}
            onOpen={() => openModal(recipe._id)}
          />
        ))}
      </div>

      {/* Modal for recipe details */}
      <Modal isOpen={!!selectedRecipe} onClose={closeModal} position="center">
        {selectedRecipe && (
          <RecipeModal
            data={selectedRecipe}
            recipeId={selectedRecipe._id}
            onClose={closeModal}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
              <RecipeModal.Image />
              <div className="flex flex-col w-full">
                <RecipeModal.Header />
                <RecipeModal.Actions />
                <RecipeModal.Ingredients />
                <RecipeModal.Steps />
              </div>
            </div>

            <RecipeModal.CommentForm />
            <Suspense fallback={<div>Loading comments...</div>}>
              <RecipeModalComments />
            </Suspense>
          </RecipeModal>
        )}
      </Modal>
    </div>
  );
};

export default Favorite;
