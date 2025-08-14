import React from 'react';

const CardEditSkeleton = () => {
  return (
    <div className="bg-white border-2 rounded-lg overflow-hidden animate-pulse h-[400px]">
      {/* Image placeholder */}
      <div className="w-full h-2/3 bg-neutral-200"></div>

      {/* Content */}
      <div className="px-5 pt-3 flex flex-col h-1/3">
        {/* Title + time */}
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 w-2/3 bg-neutral-200 rounded"></div>
          <div className="flex gap-2 items-center">
            <div className="h-4 w-4 bg-neutral-200 rounded-full"></div>
            <div className="h-4 w-10 bg-neutral-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardEditSkeleton;
