import React, { useState, createContext, useContext, useEffect } from "react";
import axios from "axios";
import { Star, Heart, Share2, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext"; // ✅ Your auth context
import { useFavorite } from "../Context/useFavorite";
import toast from "react-hot-toast";
export const RecipeModalContext = createContext();

const RecipeModal = ({ data: initialData, recipeId, onClose, children }) => {
  const [data, setData] = useState(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [currentServings, setCurrentServings] = useState(initialData?.servings || 1);
  const [comments, setComments] = useState(initialData?.comments || []);
  const [userComment, setUserComment] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [error, setError] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  // Fetch recipe details if no data provided
  useEffect(() => {
    if (!initialData && recipeId) {
      setLoading(true);
      axios
        .get(`http://localhost:5000/api/recipes/${recipeId}`)
        .then((res) => {
          setData(res.data);
          setCurrentServings(res.data.servings || 1);
        })
        .catch((err) => {
          console.error("Failed to fetch recipe", err);
        })
        .finally(() => setLoading(false));
    }
  }, [initialData, recipeId]);

  // Fetch comments only when needed
  useEffect(() => {
    if (showComments && recipeId) {
      setLoadingComments(true);
      axios
        .get(`http://localhost:5000/api/recipes/${recipeId}/comments`)
        .then((res) => setComments(res.data))
        .catch((err) => console.error("Failed to fetch comments", err))
        .finally(() => setLoadingComments(false));
    }
  }, [showComments, recipeId]);

  const adjustQuantity = (quantity) => {
    if (!quantity) return "";
    const baseServings = data.servings || 1;
    const numericValue = parseFloat(quantity);
    if (isNaN(numericValue)) return quantity;
    return ((numericValue * currentServings) / baseServings).toFixed(2);
  };

  const handleIncrease = () => setCurrentServings((prev) => prev + 1);
  const handleDecrease = () => setCurrentServings((prev) => (prev > 1 ? prev - 1 : 1));

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!userComment.trim() || userRating === 0) {
      setError("Please add both a rating and a comment.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to comment.");
      return;
    }

    try {
      // Post comment
      const commentRes = await axios.post(
        `http://localhost:5000/api/recipes/${recipeId}/comments`,
        { content: userComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Post rating
      await axios.post(
        `http://localhost:5000/api/recipes/${recipeId}/rate`,
        { rating: userRating },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments((prev) => [commentRes.data, ...prev]);
      setUserComment("");
      setUserRating(0);
      setHoverRating(0);
      setError("");
    } catch (err) {
      console.error("Error adding comment/rating:", err);
      setError("Failed to add comment or rating. Please try again.");
    }
  };

  if (loading) return <p className="p-6">Loading recipe...</p>;
  if (!data) return <p className="p-6 text-red-500">Recipe not found.</p>;

  return (
    <RecipeModalContext.Provider
      value={{
        data,
        onClose,
        currentServings,
        handleIncrease,
        handleDecrease,
        adjustQuantity,
        comments,
        setComments,
        userComment,
        setUserComment,
        userRating,
        setUserRating,
        hoverRating,
        setHoverRating,
        error,
        setError,
        showComments,
        setShowComments,
        handleSubmitComment,
        loadingComments,
        setLoadingComments,
        recipeId,
      }}
    >
      <div className="p-6 md:p-8 max-h-[90vh] overflow-y-auto w-full max-w-full">
        {children}
      </div>
    </RecipeModalContext.Provider>
  );
};

// ================== Subcomponents ==================

RecipeModal.Image = function RecipeModalImage() {
  const { data } = useContext(RecipeModalContext);
  return (
    <div className="lg:sticky top-0 w-full">
      <img
        src={data.image}
        alt={data.title}
        className="w-full h-[600px] object-cover rounded-lg border-2 border-neutral-900"
      />
    </div>
  );
};

RecipeModal.Header = function RecipeModalHeader() {
  const { data, onClose } = useContext(RecipeModalContext);
  const avgRating =
    data?.ratings.length > 0
      ? (data?.ratings.reduce((sum, r) => sum + r.rating, 0) / data?.ratings.length).toFixed(1)
      : 0;

  return (
    <div className="flex justify-between items-start mb-4">
      <div>
        <div className="flex gap-5 items-center">
          {/* Cuisine tag */}
          <span className="bg-pink-400 text-neutral-900 text-xs font-bold uppercase py-1 px-3 rounded-md">
            {data.cuisine}
          </span>

          {/* Rating badge */}
          <span className="flex items-center border-2 border-transparent rounded-lg px-2 bg-black text-white text-xs font-bold">
            <span>{avgRating}</span>
            <Star className="w-3 ml-2 fill-amber-400 text-amber-400" />
          </span>
        </div>

        <h2 className="font-archivo text-4xl font-bold mt-2">{data.title}</h2>
      </div>
      <button
        onClick={onClose}
        className="text-neutral-500 hover:text-neutral-900 text-3xl font-bold"
        aria-label="Close modal"
      >
        &times;
      </button>
    </div>
  );
};


RecipeModal.Actions = function RecipeModalActions() {
  const { recipeId, data } = useContext(RecipeModalContext);
  const { isFavorite, toggleFavorite } = useFavorite();
  const favorite = isFavorite(recipeId);
  const [animating, setAnimating] = useState(false);
  const { user } = useAuth();

  const handleFavoriteClick = () => {
    setAnimating(true);
    toggleFavorite(recipeId);
    setTimeout(() => setAnimating(false), 400);
    
  };

  const handleShareClick = async () => {
    const shareData = {
      title: data?.title || "Check out this recipe!",
      text: `I found this recipe and thought you might like it!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      
      } catch (err) {
        console.error("Share failed:", err);
  
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
  
      } catch (err) {
        console.error("Clipboard copy failed:", err);
        toast.error("Failed to copy link.");
      }
    }
  };

 const handleEmailClick = async () => {
  if (!user?.email) {
    toast.error("You must be logged in to share recipes via email.", {
      style: {
        borderRadius: '10px',
        background: '#ffffff',
        color: '#000',
        fontWeight: 'bold',
        border: '2px solid black',
      },
    });
    return;
  }

  // Create a single toast instance
  const toastId = toast.loading("Sending recipe via email...", {
    style: {
      borderRadius: '10px',
      background: '#ffffff',
      color: '#000',
      fontWeight: 'bold',
      border: '2px solid black',
    },
  });

  try {
    await axios.post("http://localhost:5000/api/email/send", {
      recipientEmail: user.email,
      recipe: data,
    });

    toast.success(`Recipe sent successfully to ${user.email}!`, {
      id: toastId,
      style: {
        borderRadius: '10px',
        background: '#ffffff',
        color: '#000',
        fontWeight: 'bold',
        border: '2px solid black',
      },
    });
  } catch (err) {
    console.error(err);
    toast.error("Failed to send recipe via email.", {
      id: toastId,
      style: {
        borderRadius: '10px',
        background: '#ffffff',
        color: '#000',
        fontWeight: 'bold',
        border: '2px solid black',
      },
    });
  }
};

  return (
    <div className="flex items-center gap-4 border-b-2 border-t-2 border-neutral-900 py-3 mb-4">
      {/* Favorite button */}
      <button onClick={handleFavoriteClick} className="flex items-center gap-2 relative">
        <Heart
          className={`w-6 h-6 transition-all duration-300 transform ${
            favorite ? "fill-pink-500 text-pink-500" : "text-neutral-600"
          } ${animating ? "scale-125 animate-pulse" : ""}`}
        />
      </button>

      {/* Share button */}
      <button
        onClick={handleShareClick}
        className="flex items-center gap-2 text-neutral-600 hover:text-pink-500 transition-colors"
      >
        <Share2 className="w-5 h-5" />
      </button>

      {/* Email button */}
      <button
        onClick={handleEmailClick}
        className="flex items-center gap-2 text-neutral-600 hover:text-pink-500 transition-colors"
      >
        <Mail className="w-5 h-5" />
      </button>
    </div>
  );
};

RecipeModal.Ingredients = function RecipeModalIngredients() {
  const { data, currentServings, handleIncrease, handleDecrease, adjustQuantity } =
    useContext(RecipeModalContext);
  return (
    <div className="mb-6">
      <h3 className="font-archivo font-bold text-xl mb-4 uppercase">Ingredients</h3>
      <div className="flex items-center gap-4 mb-4">
        <span className="font-bold">Servings:</span>
        <div className="flex items-center gap-2">
          <button onClick={handleDecrease} className="w-8 h-8 border-2 rounded-md font-bold">
            -
          </button>
          <span className="font-bold text-lg w-8 text-center">{currentServings}</span>
          <button onClick={handleIncrease} className="w-8 h-8 border-2 rounded-md font-bold">
            +
          </button>
        </div>
      </div>
      <ul className="space-y-2">
        {data.ingredients.map((ingredient) => (
          <li key={ingredient._id}>
            {ingredient.name}: {adjustQuantity(ingredient.quantity)} {ingredient.unit}
          </li>
        ))}
      </ul>
    </div>
  );
};

RecipeModal.Steps = function RecipeModalSteps() {
  const { data } = useContext(RecipeModalContext);
  return (
    <div className="flex-grow">
      <h3 className="font-archivo font-bold text-xl mb-4 uppercase">Instructions</h3>
      <ol className="list-decimal list-inside space-y-3">
        {data.steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
    </div>
  );
};

RecipeModal.CommentForm = function RecipeModalCommentForm() {
  const {
    userComment,
    setUserComment,
    userRating,
    setUserRating,
    hoverRating,
    setHoverRating,
    error,
    handleSubmitComment,
  } = useContext(RecipeModalContext);

  const { user } = useAuth(); // ✅ get logged-in user from AuthContext

  const renderStar = (index, value, onClick, onMouseEnter, onMouseLeave) => {
    const filled = index < value;
    return (
      <Star
        key={index}
        size={24}
        color={filled ? "#f59e0b" : "#9ca3af"}
        fill={filled ? "#f59e0b" : "none"}
        style={{ cursor: "pointer" }}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
    );
  };

  if (!user) {
    return (
      <p className="text-center mt-4 text-sm text-gray-600">
        Please{" "}
        <a href="/login" className="text-pink-500 underline">
          log in
        </a>{" "}
        to rate or comment.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmitComment} className="w-full flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <h4 className="font-archivo font-bold text-lg mb-2 uppercase">Rate this recipe</h4>
        <div className="flex">
          {[...Array(5)].map((_, i) => {
            const starValue = i + 1;
            return renderStar(
              i,
              hoverRating || userRating,
              () => setUserRating(starValue),
              () => setHoverRating(starValue),
              () => setHoverRating(0)
            );
          })}
        </div>
      </div>
      <div className="flex flex-row w-full gap-4">
        <input
          placeholder="Write a comment..."
          value={userComment}
          onChange={(e) => setUserComment(e.target.value)}
          className="flex-grow py-2 px-4 border-2 rounded-lg"
        />
        <button
          type="submit"
          className="flex-shrink-0 bg-neutral-900 text-white hover:bg-neutral-700 font-bold py-1 px-4 rounded-lg"
        >
          Comment
        </button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
};

export default RecipeModal;
