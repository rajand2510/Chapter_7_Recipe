import { Clock, Heart, Share2 } from "lucide-react";
import RatingsDisplay from "./RatingsDisplay";
import { useFavorite } from "../Context/useFavorite";
import { useState } from "react";
import toast from "react-hot-toast";

const RecipeCard = ({ recipe, onOpen }) => {
  const { isFavorite, toggleFavorite } = useFavorite();
  const favorite = isFavorite(recipe._id);

  const [animating, setAnimating] = useState(false);

  const handleFavoriteClick = () => {
    setAnimating(true);
    toggleFavorite(recipe._id);
    setTimeout(() => setAnimating(false), 300);
  };

  const handleShare = async () => {
    const shareData = {
      title: recipe?.title || "Check out this recipe!",
      text: `Check out this recipe: ${recipe?.title}`,
      url: `${window.location.origin}/?recipe=${recipe?._id}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast.success("Recipe link copied to clipboard! 📋", {
          style: {
            borderRadius: "10px",
            background: "#fff",
            color: "#000",
            fontWeight: "bold",
            border: "2px solid black",
          },
        });
      }
    } catch (err) {
      console.error("Share failed:", err);
      toast.error("Failed to share recipe", {
        style: {
          borderRadius: "10px",
          background: "#fff",
          color: "#000",
          fontWeight: "bold",
          border: "2px solid black",
        },
      });
    }
  };

  return (
    <div className="border-2 bg-[#f5f5f5] rounded-lg h-[436px] overflow-hidden">
      {/* Image Section */}
      <div className="h-1/2 cursor-pointer" onClick={onOpen}>
        <img
          className="h-full w-full object-cover"
          src={recipe?.image}
          alt="Recipe"
        />
      </div>

      {/* Info Section */}
      <div className="h-1/2 px-5 py-3 flex flex-col">
        <div className="flex justify-between">
          <h3 className="px-3 rounded-lg font-semibold font-archivo py-0.5 h-full bg-[#F472B6]">
            {recipe?.cuisine}
          </h3>
          <div className="flex gap-2 text-gray-600 text-[16px]">
            <Clock className="mt-1" size={18} />
            <span className="font-inter">{recipe?.cookingTime}m</span>
          </div>
        </div>

        <div className="border-b-2">
          <h3 className="pt-3 pb-2 font-archivo font-extrabold text-2xl">
            {recipe?.title}
          </h3>
          <h4 className="font-inter pt-2 pb-3 text-gray-600">
            by {recipe?.author?.username}
          </h4>
        </div>

        {/* Ratings + Actions */}
        <div className="flex justify-between my-auto items-center">
          <RatingsDisplay ratings={recipe?.ratings} />
          <div className="flex gap-2">
            {/* Favorite Button */}
            <button
              onClick={handleFavoriteClick}
              className="p-2 border-2 rounded-lg flex items-center justify-center hover:bg-black hover:text-white"
            >
              <Heart
                className={`w-5 h-5 transition-all duration-200 ${
                  favorite ? "fill-pink-500 text-pink-500" : ""
                } ${animating ? "scale-125" : "scale-100"}`}
              />
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="p-2 border-2 rounded-lg flex items-center justify-center hover:bg-black hover:text-white group"
            >
              <Share2 className="w-5 h-5 fill-current group-hover:fill-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
