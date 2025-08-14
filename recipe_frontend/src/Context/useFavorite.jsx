// hooks/useFavorite.js
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const useFavorite = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  const toastStyle = {
    borderRadius: "10px",
    background: "#ffffff",
    color: "#000",
    fontWeight: "bold",
    border: "2px solid black",
  };

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(res.data?.favorites || []);
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const isFavorite = useCallback(
    (recipeId) => favorites.some((fav) => fav._id === recipeId),
    [favorites]
  );

  const addFavorite = async (recipeId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to add favorites 🔑", { style: toastStyle });
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/users/favorites/${recipeId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFavorites((prev) => [...prev, { _id: recipeId }]);
     
    } catch (err) {
      console.error("Failed to add favorite:", err);
      toast.error("Failed to add favorite ❌", { style: toastStyle });
    }
  };

  const removeFavorite = async (recipeId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to remove favorites 🔑", { style: toastStyle });
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/users/favorites/${recipeId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFavorites((prev) => prev.filter((fav) => fav._id !== recipeId));

    } catch (err) {
      console.error("Failed to remove favorite:", err);
      toast.error("Failed to remove favorite ❌", { style: toastStyle });
    }
  };

  const toggleFavorite = (recipeId) => {
    if (isFavorite(recipeId)) {
      removeFavorite(recipeId);
    } else {
      addFavorite(recipeId);
    }
  };

  return {
    favorites,
    loading,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    refetch: fetchFavorites,
  };
};
