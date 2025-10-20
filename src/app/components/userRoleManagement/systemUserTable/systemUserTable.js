"use client";
import React, { useState } from "react";
import Table from "../../common/table/table";
import Button from "../../common/button/button";
import { FaUserPlus, FaEdit, FaTrash, FaUserCog } from "react-icons/fa";
import Pagination from "../../common/pagination/pagination";
import Images from "../../common/Image/Image";

const SystemUserTable = () => {
  const columns = [
    {
      header: <input type="checkbox" className="mr-2" />,
      key: "checkbox",
      render: () => <input type="checkbox" className="mr-2" />,
    },
    { header: "Name", key: "name" },
    { header: "Email", key: "email" },
    { header: "Role", key: "role" },
    { header: "Access Zone", key: "accessZone" },
    { header: "Shift", key: "shift" },
    { header: "Status", key: "status" },
    {
      header: "Actions",
      key: "actions",
      render: () => (
        <>
          <button className="text-blue-600 mr-2">
            <FaEdit />
          </button>
          <button className="text-orange-600 mr-2">
            <FaUserCog />
          </button>
          <button className="text-red-600">
            <FaTrash />
          </button>
        </>
      ),
    },
  ];

  const roleStyles = {
    Admin: "bg-red-200 text-red-800",
    Supervisor: "bg-yellow-200 text-yellow-800",
    Operator: "bg-green-200 text-green-800",
    Auditor: "bg-purple-200 text-purple-800",
  };

  const statusStyles = {
    Active: "bg-green-200 text-green-800",
    Suspended: "bg-yellow-200 text-yellow-800",
  };

  const data = [
    {
      checkbox: true,
      name: { firstName: "John Anderson", id: "USR001", image: "/images/png/avatar.png" },
      email: "john.anderson@port.com",
      role: "Admin",
      accessZone: "All Zones",
      shift: "All Shifts",
      status: "Active",
    },
    {
      checkbox: true,
      name: { firstName: "Sarah Chen", id: "USR002", image: "/images/png/avatar.png" },
      email: "sarah.chen@port.com",
      role: "Supervisor",
      accessZone: "Terminal A, Terminal B",
      shift: "Day Shift",
      status: "Active",
    },
    {
      checkbox: true,
      name: { firstName: "Mike Rodriguez", id: "USR003", image: "/images/png/avatar.png" },
      email: "mike.rodriguez@port.com",
      role: "Operator",
      accessZone: "Yard 1, Gate Area",
      shift: "Night Shift",
      status: "Suspended",
    },
    {
      checkbox: true,
      name: { firstName: "Lisa Thompson", id: "USR004", image: "/images/png/avatar.png" },
      email: "lisa.thompson@port.com",
      role: "Auditor",
      accessZone: "All Zones",
      shift: "Day Shift",
      status: "Active",
    },
    {
      checkbox: true,
      name: { firstName: "David Lee", id: "USR005", image: "/images/png/avatar.png" },
      email: "david.lee@port.com",
      role: "Admin",
      accessZone: "Terminal C",
      shift: "Night Shift",
      status: "Active",
    },
    {
      checkbox: true,
      name: { firstName: "Emily Davis", id: "USR006", image: "/images/png/avatar.png" },
      email: "emily.davis@port.com",
      role: "Supervisor",
      accessZone: "Yard 2",
      shift: "Day Shift",
      status: "Active",
    },
    {
      checkbox: true,
      name: { firstName: "James Wilson", id: "USR007", image: "/images/png/avatar.png" },
      email: "james.wilson@port.com",
      role: "Operator",
      accessZone: "Gate Area",
      shift: "All Shifts",
      status: "Suspended",
    },
    {
      checkbox: true,
      name: { firstName: "Rachel Green", id: "USR008", image: "/images/png/avatar.png" },
      email: "rachel.green@port.com",
      role: "Auditor",
      accessZone: "Terminal B",
      shift: "Night Shift",
      status: "Active",
    },
    {
      checkbox: true,
      name: { firstName: "Michael Brown", id: "USR009", image: "/images/png/avatar.png" },
      email: "michael.brown@port.com",
      role: "Admin",
      accessZone: "All Zones",
      shift: "Day Shift",
      status: "Active",
    },
    {
      checkbox: true,
      name: { firstName: "Sophia Kim", id: "USR010", image: "/images/png/avatar.png" },
      email: "sophia.kim@port.com",
      role: "Supervisor",
      accessZone: "Terminal A",
      shift: "All Shifts",
      status: "Active",
    },
    {
      checkbox: true,
      name: { firstName: "Thomas Clark", id: "USR011", image: "/images/png/avatar.png" },
      email: "thomas.clark@port.com",
      role: "Operator",
      accessZone: "Yard 1",
      shift: "Day Shift",
      status: "Suspended",
    },
    {
      checkbox: true,
      name: { firstName: "Anna White", id: "USR012", image: "/images/png/avatar.png" },
      email: "anna.white@port.com",
      role: "Auditor",
      accessZone: "All Zones",
      shift: "Night Shift",
      status: "Active",
    },
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 4;

  const startIndex = currentPage * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRows = data.slice(startIndex, endIndex);

  const handlePageChange = (newPageIndex) => {
    setCurrentPage(newPageIndex);
  };

  const renderName = (row) => (
    <div className="flex items-center space-x-3">
      <Images
        src={row.name.image}
        alt={`${row.name.firstName}'s avatar`}
        className="w-8 h-8 rounded-full"
      />
      <div className="flex flex-col">
        <span className="font-medium">{row.name.firstName}</span>
        <span className="text-paraColor text-sm">ID: {row.name.id}</span>
      </div>
    </div>
  );

  const renderRole = (row) => (
    <span className={`px-3 py-1 text-sm rounded-full ${roleStyles[row.role]}`}>
      {row.role}
    </span>
  );

  const renderStatus = (row) => (
    <span className={`px-3 py-1 text-sm rounded-full ${statusStyles[row.status]}`}>
      {row.status}
    </span>
  );

  return (
    <div className="p-4 bg-white rounded-lg border my-6">
      {/* Filter Section */}
      <div className="flex justify-between items-center mb-6 bg-gray-50 p-2 rounded">
        <div className="flex items-center gap-2">
          <input
            type="search"
            placeholder="Search by name, email, or role..."
            className="w-64 border rounded p-2"
          />
          <select className="border p-2 rounded">
            <option>All Roles</option>
          </select>
          <select className="border p-2 rounded">
            <option>All Status</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-blue-600 text-white px-4 py-2 rounded">
            Bulk Upload
          </Button>
          <Button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2">
            <FaUserPlus /> Add New User
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex flex-col">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">System Users</h2>
        </div>

        <Table
          data={currentRows}
          columns={columns.map((col) => ({
            ...col,
            render:
              col.key === "name"
                ? renderName
                : col.key === "role"
                  ? renderRole
                  : col.key === "status"
                    ? renderStatus
                    : col.render,
          }))}
          className="mt-4"
        />

        <Pagination
          pageCount={Math.ceil(data.length / rowsPerPage)}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalResults={data.length}
          resultsPerPage={rowsPerPage}
        />
      </div>
    </div>
  );
};

export default SystemUserTable;