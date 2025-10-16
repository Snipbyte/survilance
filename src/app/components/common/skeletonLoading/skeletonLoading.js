// LoadingSkeleton.js
import React from "react";

const LoadingSkeleton = ({ numberOfCards }) => {
  return (
    <div className=" w-full flex flex-wrap items-center justify-center gap-4 p-5">
      {[...Array(numberOfCards)].map((_, index) => (
        <div
          key={index}
          className="bg-slateColor animate-pulse rounded-lg shadow-md p-4 w-64 h-40 flex flex-col justify-between"
        >
          <div className="h-12 bg-paraColor rounded w-3/4 mb-2"></div>
          <div className="h-8 bg-paraColor rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-paraColor rounded w-1/4"></div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
