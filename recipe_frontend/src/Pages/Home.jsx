import React, { useEffect, useState, Suspense, useRef, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import Hero from "../Components/Hero";
import RecipeCard from "../Components/RecipeCard";
import SkeletonCard from "../Components/SkeletonCard";
import Modal from "../Modal";
import RecipeModal from "../Modal/RecipeModal";
import RecipeModalComments from "../Modal/RecipeModalComments";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useSearch } from "../context/SearchContext";
import { useAuth } from "../Context/AuthContext";

// Filter options
const cuisines = ["All Cuisines", "Indian", "Italian", "Chinese", "Mexican", "French"];
const times = ["Any Time", "Under 15 min", "Under 30 min", "Under 1 hour"];

const Home = () => {
  const { searchText, setSearchText, debouncedSearch } = useSearch();

  const [recipes, setRecipes] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const [selectedCuisine, setSelectedCuisine] = useState("all");
  const [maxTime, setMaxTime] = useState("all");

  const [isCuisineOpen, setIsCuisineOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const recipeIdFromUrl = searchParams.get("recipe");
const {darkMode} = useAuth();
  // Fetch recipes (latest first + no duplicates)
  const fetchRecipes = useCallback(
    async (pageNum = 1, append = false) => {
      try {
        if (pageNum === 1) {
          setLoading(true);
          setRecipes([]);
        } else {
          setLoadingMore(true);
        }

        const params = new URLSearchParams();
        params.append("page", pageNum);
        params.append("limit", 9);
        params.append("sort", "latest");

        if (debouncedSearch) params.append("search", debouncedSearch);
        if (selectedCuisine !== "all") params.append("cuisine", selectedCuisine);
        if (maxTime !== "all") params.append("maxTime", maxTime);

        const res = await fetch(`https://chapter-7-recipe.onrender.com/api/recipes?${params.toString()}`);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();

        setRecipes((prev) => {
          const combined = append ? [...prev, ...data.recipes] : data.recipes;
          const unique = combined.filter(
            (r, index, self) => index === self.findIndex((t) => t._id === r._id)
          );
          return unique.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        });

        setHasMore(pageNum < data.totalPages);
        setLoading(false);
        setLoadingMore(false);
      } catch (err) {
        setError(err.message || "Failed to load recipes.");
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [debouncedSearch, selectedCuisine, maxTime]
  );

  // Fetch recommended recipes
  const fetchRecommendations = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return; // Only fetch if logged in

      const res = await fetch(`https://chapter-7-recipe.onrender.com/api/recommendations`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setRecommended(data);
    } catch (err) {
      console.error("Failed to load recommendations", err);
    }
  };

  // Reload recipes when filters/search change
  useEffect(() => {
    setPage(1);
    fetchRecipes(1, false);
  }, [fetchRecipes]);

  // Load recommendations on mount
  useEffect(() => {
    fetchRecommendations();
  }, []);

  // Fetch recipe for modal
  useEffect(() => {
    if (recipeIdFromUrl) {
      axios
        .get(`https://chapter-7-recipe.onrender.com/api/recipes/${recipeIdFromUrl}`)
        .then((res) => setSelectedRecipe(res.data))
        .catch((err) => {
          console.error("Failed to fetch recipe", err);
          setSelectedRecipe(null);
        });
    } else {
      setSelectedRecipe(null);
    }
  }, [recipeIdFromUrl]);

  // Intersection Observer for infinite scroll
  const lastRecipeRef = useCallback(
    (node) => {
      if (loadingMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => {
            const nextPage = prev + 1;
            fetchRecipes(nextPage, true);
            return nextPage;
          });
        }
      });

      if (node) observer.current.observe(node);
    },
    [loadingMore, hasMore, fetchRecipes]
  );

  const openModal = (recipeId) => navigate(`/?recipe=${recipeId}`, { replace: true });
  const closeModal = () => navigate("/", { replace: true });

  const resetFilters = () => {
    setSearchText("");
    setSelectedCuisine("all");
    setMaxTime("all");
  };

  return (
    <div className="mt-18">
      <Hero />

      {/* Recommended Section */}
      {recommended.length > 0 && (
        <div className="-mb-8">

          <h3  style={{color: darkMode ? '#f5f5f5' : '#111827'  }} className="font-archivo font-[900] text-4xl mb-8  flex justify-center ">
            RECOMMENDED FOR YOU
          </h3>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-8 px-18">
            {recommended.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                recipe={recipe}
                onOpen={() => openModal(recipe._id)}
              />
            ))}
          </div>
        </div>
      )}
      <h3 style={{color: darkMode ? '#f5f5f5' : '#111827'  }} className="font-archivo mt-18 font-[900] text-4xl  flex justify-center items-center">
        LATEST RECIPES
      </h3>

      {/* Filters */}
      <div className="max-w-3xl mx-4 lg:mx-auto mt-5 mb-12 p-4 bg-white border-2 border-neutral-900 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-3">
            <div className="relative">
              <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"></i>
              <input
                type="text"
                placeholder="Search by recipe name..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full h-12 pl-12 pr-4 text-md border-2 bg-neutral-100 border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
          </div>

          {/* Cuisine */}
          <div className="relative">
            <label className="font-bold text-sm mb-1 block">Cuisine</label>
            <div
              onClick={() => setIsCuisineOpen(!isCuisineOpen)}
              className="flex justify-between items-center px-4 py-3 border-2 border-neutral-300 rounded-lg cursor-pointer bg-neutral-100"
            >
              <span>
                {cuisines.find(
                  (c) =>
                    (selectedCuisine === "all" && c === "All Cuisines") ||
                    selectedCuisine === c
                )}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform ${isCuisineOpen ? "rotate-180" : ""
                  }`}
              />
            </div>
            {isCuisineOpen && (
              <ul className="absolute mt-1 w-full border-2 rounded-lg bg-white shadow-lg z-10">
                {cuisines.map((c) => (
                  <li
                    key={c}
                    onClick={() => {
                      setSelectedCuisine(c === "All Cuisines" ? "all" : c);
                      setIsCuisineOpen(false);
                    }}
                    className="px-4 py-2 rounded-lg hover:bg-pink-100 cursor-pointer"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Max Time */}
          <div className="relative">
            <label className="font-bold text-sm mb-1 block">Max Time</label>
            <div
              onClick={() => setIsTimeOpen(!isTimeOpen)}
              className="flex justify-between items-center px-4 py-3 border-2 border-neutral-300 rounded-lg cursor-pointer bg-neutral-100"
            >
              <span>
                {times.find(
                  (t) =>
                    (maxTime === "all" && t === "Any Time") ||
                    (maxTime === "15" && t === "Under 15 min") ||
                    (maxTime === "30" && t === "Under 30 min") ||
                    (maxTime === "60" && t === "Under 1 hour")
                )}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform ${isTimeOpen ? "rotate-180" : ""
                  }`}
              />
            </div>
            {isTimeOpen && (
              <ul className="absolute mt-1 w-full border-2 rounded-lg bg-white shadow-lg z-10">
                {times.map((t) => (
                  <li
                    key={t}
                    onClick={() => {
                      if (t === "Any Time") setMaxTime("all");
                      else if (t.includes("15")) setMaxTime("15");
                      else if (t.includes("30")) setMaxTime("30");
                      else if (t.includes("1 hour")) setMaxTime("60");
                      setIsTimeOpen(false);
                    }}
                    className="px-4 py-2 rounded-lg hover:bg-pink-100 cursor-pointer"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Reset */}
          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="w-full h-12 bg-neutral-900 hover:bg-neutral-700 text-white font-bold rounded-lg transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Latest Recipes */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-8 px-18 mt-12">
        {loading && Array(6).fill(null).map((_, idx) => <SkeletonCard key={idx} />)}

        {!loading && error && (
          <>
            {Array(3).fill(null).map((_, idx) => <SkeletonCard key={idx} />)}
            <div className="col-span-full text-center text-red-600 font-semibold mt-4">
              {error}
            </div>
          </>
        )}

        {!loading &&
          !error &&
          recipes.map((recipe, idx) => {
            if (recipes.length === idx + 1) {
              return (
                <div ref={lastRecipeRef} key={recipe._id}>
                  <RecipeCard recipe={recipe} onOpen={() => openModal(recipe._id)} />
                </div>
              );
            } else {
              return (
                <RecipeCard key={recipe._id} recipe={recipe} onOpen={() => openModal(recipe._id)} />
              );
            }
          })}
      </div>

      {loadingMore && <p className="text-center mt-4">Loading more...</p>}



      {/* Modal */}
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

export default Home;
