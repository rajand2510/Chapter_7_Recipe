import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-white border-2  rounded-lg overflow-hidden animate-pulse">
      <div className="w-full h-56 bg-neutral-200"></div>
      <div className="p-5">
        <div className="h-5 w-1/4 bg-neutral-200 rounded mb-4"></div>
        <div className="h-7 w-3/4 bg-neutral-200 rounded mb-2"></div>
        <div className="h-4 w-1/2 bg-neutral-200 rounded mb-6"></div>
        <div className="border-t-2  pt-4 flex justify-between items-center">
          <div className="h-7 w-1/3 bg-neutral-200 rounded"></div>
          <div className="flex gap-2">
            <div className="w-10 h-10 bg-neutral-200 border-2 rounded-lg"></div>
            <div className="w-10 h-10 bg-neutral-200 border-2 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
