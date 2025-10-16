"use client";
import React, { useState } from "react";
import Pagination from "../pagination/pagination";
import Input from "../input/input";
import { FaSearch } from "react-icons/fa";
import Button from "../button/button";
import CustomModal from "../modal/modal";

const Table = ({
  data = [],
  columns = [],
  className = "",
  isRecent,
  isSuperAdmin,
  addBtn,
  icon,
  modalComponent: ModalComponent,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState(""); // For search filter
  const [isModalOpen, setIsModalOpen] = useState(false);
  const rowsPerPage = 10;

  // Filter rows based on search query
  const filteredData = data.filter((row) =>
    columns.some((column) =>
      String(row[column.key]).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Calculate the rows for the current page
  const startIndex = currentPage * rowsPerPage;
  const currentRows = filteredData.slice(startIndex, startIndex + rowsPerPage);

  // Handle page change
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Handle CSV download
  const downloadCSV = () => {
    const csvHeader = columns.map((col) => col.header).join(",");
    const csvRows = data.map((row) =>
      columns.map((col) => `"${row[col.key]}"`).join(",")
    );
    const csvContent = [csvHeader, ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "table_data.csv";
    link.click();
  };

  return (
    <div className={` ${className}`}>
      {/* Search bar and download button */}
      {/* {!isRecent && (
        <div className="lg:flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 px-2 border w-full lg:w-[400px]">
            <FaSearch />
            <Input
              type="search"
              placeholder="Search..."
              className="border-none mt-3 lg:w-[360px] w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="md:flex items-center gap-5">
            {isSuperAdmin && (
              <Button
                className="lg:w-48 w-full rounded my-2 lg:my-0"
                onClick={() => setIsModalOpen(true)}
              >
                {icon} {addBtn}
              </Button>
            )}
            <Button
              className="lg:w-44 w-full px-4 py-2 rounded my-2 lg:my-0"
              onClick={downloadCSV}
            >
              Download CSV
            </Button>
          </div>
        </div>
      )} */}
      {/* Table */}
      <div className="overflow-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-200">
            <tr className="bg-blueColor text-white whitespace-nowrap">
              {columns.map((column, index) => (
                <th key={index} className="py-2 px-4 text-left">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentRows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`${rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
              >
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-4 py-2 text-headingColor">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!isRecent && data.length > 10 && (
        <div className="mt-4">
          <Pagination
            pageCount={Math.ceil(filteredData.length / rowsPerPage)}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Modal */}
      <CustomModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        title={addBtn}
      >
        {ModalComponent && <ModalComponent />}
      </CustomModal>
    </div>
  );
};

export default Table;