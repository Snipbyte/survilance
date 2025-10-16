
import React, { useState } from "react";

const Pagination = ({ pageCount, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage); // Update the active page
    onPageChange({ selected: selectedPage }); // Call the parent handler
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 0; i < pageCount; i++) {
      pages.push(
        <li
          key={i}
          className={`px-3 py-2 mx-1 text-sm font-medium border border-slateColor rounded-lg cursor-pointer ${
            currentPage === i
              ? "bg-blueColor text-white"
              : "bg-whiteColor text-darkCard hover:bg-lightCard"
          }`}
          onClick={() => handlePageClick(i)}
        >
          {i + 1}
        </li>
      );
    }
    return pages;
  };

  return (
    <ul className="flex items-center justify-center my-4">
      <li
        className="px-3 py-2 mx-1 text-sm font-medium text-darkCard bg-white border border-slateColor rounded-lg cursor-pointer hover:bg-lightCard"
        onClick={() => handlePageClick(0)}
      >
        Previous
      </li>
      {renderPageNumbers()}
      <li
        className="px-3 py-2 mx-1 text-sm font-medium text-darkCard bg-white border border-slateColor rounded-lg cursor-pointer hover:bg-lightCard"
        onClick={() => handlePageClick(pageCount - 1)}
      >
        Next
      </li>
    </ul>
  );
};

export default Pagination;
