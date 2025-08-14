import { Star } from "lucide-react";

const RatingsDisplay = ({ ratings }) => {
  // 1️⃣ Calculate average rating
  const avgRating =
    ratings?.length > 0
      ? ratings?.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;

  // 2️⃣ Create an array for stars
  const totalStars = 5;
  const stars = Array.from({ length: totalStars }, (_, i) => i + 1);

  return (
    <div className="flex">
      {stars.map((star) => (
        <Star
          key={star}
          className={`w-6 h-6 ${
            star <= Math.round(avgRating)
              ? "fill-yellow-500 text-yellow-500"
              : "text-gray-400"
          }`}
        />
      ))}
    </div>
  );
};

export default RatingsDisplay;
