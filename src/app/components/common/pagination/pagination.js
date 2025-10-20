import React, { useState } from "react";

const Pagination = ({ pageCount, onPageChange, totalResults, resultsPerPage, currentPage }) => {
  // Use the currentPage prop instead of local state to sync with parent
  const handlePageClick = (selectedPage) => {
    if (selectedPage < 0 || selectedPage >= pageCount) return; // Prevent invalid pages
    onPageChange(selectedPage);
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 0; i < pageCount; i++) {
      pages.push(
        <li
          key={i}
          onClick={() => handlePageClick(i)}
          className={`px-3 py-1 cursor-pointer text-sm font-medium border rounded-md transition-colors duration-200
            ${currentPage === i
              ? "bg-blue-600 text-white border-blue-600"
              : "text-gray-700 bg-white border-gray-300 hover:bg-lightCard"
            }`}
        >
          {i + 1}
        </li>
      );
    }
    return pages;
  };

  const startResult = currentPage * resultsPerPage + 1;
  const endResult = Math.min((currentPage + 1) * resultsPerPage, totalResults);

  return (
    <div className="flex items-center justify-between mt-6">
      {/* Left side text */}
      <p className="text-sm text-paraColor">
        Showing <span className="font-medium">{startResult}</span> to{" "}
        <span className="font-medium">{endResult}</span> of{" "}
        <span className="font-medium">{totalResults}</span> results
      </p>

      {/* Pagination controls */}
      <ul className="flex items-center space-x-1">
        <li
          onClick={() => handlePageClick(currentPage - 1)}
          className={`px-3 py-1 cu text-sm font-medium border rounded-md transition-colors duration-200
            ${currentPage === 0
              ? "text-gray-400 border-gray-200 bg-gray-100 cursor-not-allowed"
              : "text-gray-700 bg-white border-gray-300 hover:bg-lightCard cursor-pointer"
            }`}
        >
          Previous
        </li>

        {renderPageNumbers()}

        <li
          onClick={() => handlePageClick(currentPage + 1)}
          className={`px-3 py-1 cursor-pointer text-sm font-medium border rounded-md transition-colors duration-200
            ${currentPage === pageCount - 1
              ? "text-gray-400 border-gray-200 bg-gray-100 cursor-not-allowed"
              : "text-gray-700 bg-white border-gray-300 hover:bg-lightCard cursor-pointer"
            }`}
        >
          Next
        </li>
      </ul>
    </div>
  );
};

export default Pagination;