import React, { useContext, useState } from "react";
import axios from "axios";
import { RecipeModalContext } from "./RecipeModal";

export default function RecipeModalComments() {
  const {
    comments,
    setComments,
    showComments,
    setShowComments,
    recipeId,
  } = useContext(RecipeModalContext);

  const [loadingComments, setLoadingComments] = useState(false); // 🆕 loading state

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const res = await axios.get(`http://localhost:5000/api/recipes/${recipeId}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error("Failed to load comments:", err);
    } finally {
      setLoadingComments(false);
    }
  };

  const toggleComments = () => {
    if (!showComments) {
      fetchComments(); // Load comments only when opening
    }
    setShowComments((prev) => !prev);
  };

  return (
    <div className="mt-8 pt-6 border-t-2 border-neutral-900 w-full">
      <div className="mt-6">
        <button
          onClick={toggleComments}
          className="bg-neutral-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-neutral-700 transition"
        >
          {showComments ? "Hide Comments" : "Show Comments"}
        </button>
      </div>

      {showComments && (
        <div className="mt-4 space-y-4">
          {loadingComments ? (
            <p className="text-center italic text-neutral-600">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="text-center italic text-neutral-600">No comments yet.</p>
          ) : (
            comments.map((comment, i) => (
              <div
                key={i}
                className="bg-white border-2 border-neutral-900 p-4 rounded-lg"
              >
                <div className="flex justify-between items-center mb-1">
                  <p className="font-bold">{comment?.user?.username}</p>
                </div>
                <p>{comment.content}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
