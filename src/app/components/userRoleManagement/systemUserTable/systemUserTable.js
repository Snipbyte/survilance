"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Table from "../../common/table/table";
import Button from "../../common/button/button";
import { FaUserPlus, FaEdit, FaTrash, FaUserCog } from "react-icons/fa";
import Pagination from "../../common/pagination/pagination";
import Alert from "../../common/alert/alert";
import CustomModal from "../../common/modal/modal";
import Images from "../../common/Image/Image";
import { getUsers, getUserById, addUser, editUser, deleteUser, getUserRoles } from "../../../../../utils/organization/auth/api";

const SystemUserTable = () => {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [alert, setAlert] = useState({ show: false, type: "info", message: "" });
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [roles, setRoles] = useState([]);
  const rowsPerPage = 4;

  const { register, handleSubmit, reset, formState: { errors, isSubmitting }, setValue } = useForm({
    defaultValues: {
      userFullName: "",
      userEmail: "",
      userPassword: "",
      userRole: "",
      userStatus: "Active",
    
    }
  });

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

  const columns = [
    {
      header: <input type="checkbox" className="mr-2" />,
      key: "checkbox",
      render: () => <input type="checkbox" className="mr-2" />,
    },
    { header: "Name", key: "userFullName" },
    { header: "Email", key: "userEmail" },
    { header: "Role", key: "userRole" },
  
    { header: "Status", key: "userStatus" },
    {
      header: "Actions",
      key: "actions",
      render: (row) => (
        <>
          <button
            className="text-blue-600 mr-2 hover:text-blue-800 transition-colors"
            onClick={() => handleEdit(row._id)}
            title="Edit User"
          >
            <FaEdit />
          </button>
          <button
            className="text-orange-600 mr-2 hover:text-orange-800 transition-colors"
            onClick={() => handleEdit(row._id)} // Placeholder for settings
            title="User Settings"
          >
            <FaUserCog />
          </button>
          <button
            className="text-red-600 hover:text-red-800 transition-colors"
            onClick={() => handleOpenDeleteModal(row._id)}
            title="Delete User"
          >
            <FaTrash />
          </button>
        </>
      ),
    },
  ];

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await getUsers(currentPage + 1, rowsPerPage, searchQuery ? { search: searchQuery } : {});
      setUsers(response.userData || []);
      setTotalUsers(response.totalUsersNumber || 0);
    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        message: error || "Failed to fetch users.",
      });
    }
  };

  // Fetch roles for dropdown
  const fetchRoles = async () => {
    try {
      const response = await getUserRoles(1, 100); // Fetch all roles
      setRoles(response.roleData || []);
    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        message: error || "Failed to fetch roles.",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [currentPage, searchQuery]);

  // Auto-hide alert
  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ show: false, type: "info", message: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0);
  };

  // Handle add user
  const handleAddUser = () => {
    setModalMode("add");
    reset({
      userFullName: "",
      userEmail: "",
      userPassword: "",
      userRole: "",
      userStatus: "Active",
    
      
    });
    setIsFormModalOpen(true);
  };

  // Handle edit user
  const handleEdit = async (id) => {
    try {
      const response = await getUserById(id);
      const user = response.userData;
      reset({
        userFullName: user.userFullName,
        userEmail: user.userEmail,
        userPassword: "", // Password not fetched
        userRole: user.userRole?._id || "",
        userStatus: user.userStatus,
       
        
      });
      setSelectedUserId(id);
      setModalMode("edit");
      setIsFormModalOpen(true);
    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        message: error || "Failed to fetch user data.",
      });
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    const userData = {
      userFullName: data.userFullName,
      userEmail: data.userEmail,
      userRole: data.userRole,
      userStatus: data.userStatus,
    
      
    };
    if (data.userPassword && modalMode === "add") {
      userData.userPassword = data.userPassword;
    } else if (data.userPassword && modalMode === "edit") {
      userData.userPassword = data.userPassword; // Only include if provided
    }

    try {
      if (modalMode === "add") {
        await addUser(userData);
        setAlert({
          show: true,
          type: "success",
          message: "User created successfully.",
        });
      } else {
        await editUser(selectedUserId, userData);
        setAlert({
          show: true,
          type: "success",
          message: "User updated successfully.",
        });
      }
      setIsFormModalOpen(false);
      fetchUsers();
    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        message: error || `Failed to ${modalMode === "add" ? "create" : "update"} user.`,
      });
    }
  };

  // Handle delete modal open
  const handleOpenDeleteModal = (id) => {
    setSelectedUserId(id);
    setIsDeleteModalOpen(true);
  };

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    try {
      await deleteUser(selectedUserId);
      setAlert({
        show: true,
        type: "success",
        message: "User deleted successfully.",
      });
      setIsDeleteModalOpen(false);
      fetchUsers();
    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        message: error || "Failed to delete user.",
      });
    }
  };

  const handlePageChange = (newPageIndex) => {
    setCurrentPage(newPageIndex);
  };

  const renderName = (row) => (
    <div className="flex items-center space-x-3">
      <Images
        src={row.userImage || "/images/png/avatar.png"}
        alt={`${row.userFullName}'s avatar`}
        className="w-8 h-8 rounded-full"
      />
      <div className="flex flex-col">
        <span className="font-medium">{row.userFullName}</span>
        <span className="text-gray-500 text-sm">ID: {row.userId}</span>
      </div>
    </div>
  );

  const renderRole = (row) => (
    <span className={`px-3 py-1 text-sm rounded-full ${roleStyles[row.userRole?.name] || "bg-gray-200 text-gray-800"}`}>
      {row.userRole?.name || "N/A"}
    </span>
  );

  const renderStatus = (row) => (
    <span className={`px-3 py-1 text-sm rounded-full ${statusStyles[row.userStatus]}`}>
      {row.userStatus}
    </span>
  );

  return (
    <div className="p-4 bg-white rounded-lg border my-6">
      {alert.show && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[10000] w-full max-w-md">
          <Alert type={alert.type} message={alert.message} />
        </div>
      )}
      <div className="flex justify-between items-center mb-6 bg-gray-50 p-2 rounded">
        <div className="flex items-center gap-2">
          <input
            type="search"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-64 border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Roles</option>
            {roles.map((role) => (
              <option key={role._id} value={role._id}>{role.name}</option>
            ))}
          </select>
          <select className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Status</option>
            <option>Active</option>
            <option>Suspended</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          {/* <Button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Bulk Upload
          </Button> */}
          <Button
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 transition-colors"
            onClick={handleAddUser}
          >
            <FaUserPlus /> Add New User
          </Button>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800">System Users</h2>
        </div>
        <Table
          data={users}
          columns={columns.map((col) => ({
            ...col,
            render:
              col.key === "userFullName"
                ? renderName
                : col.key === "userRole"
                  ? renderRole
                  : col.key === "userStatus"
                    ? renderStatus
                    : col.render,
          }))}
          className="mt-4"
        />
        <Pagination
          pageCount={Math.ceil(totalUsers / rowsPerPage)}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalResults={totalUsers}
          resultsPerPage={rowsPerPage}
        />
      </div>
      <CustomModal
        isOpen={isFormModalOpen}
        onRequestClose={() => setIsFormModalOpen(false)}
        title={modalMode === "add" ? "Add New User" : "Edit User"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              {...register("userFullName", {
                required: "Full name is required",
                minLength: { value: 3, message: "Full name must be at least 3 characters" },
              })}
              className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.userFullName ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.userFullName && (
              <span className="text-red-500 text-sm mt-1">{errors.userFullName.message}</span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              {...register("userEmail", {
                required: "Email is required",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" },
              })}
              className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.userEmail ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.userEmail && (
              <span className="text-red-500 text-sm mt-1">{errors.userEmail.message}</span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password {modalMode === "edit" && "(Leave blank to keep unchanged)"}
            </label>
            <input
              type="password"
              {...register("userPassword", {
                required: modalMode === "add" ? "Password is required" : false,
                minLength: { value: 6, message: "Password must be at least 6 characters" },
              })}
              className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.userPassword ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.userPassword && (
              <span className="text-red-500 text-sm mt-1">{errors.userPassword.message}</span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              {...register("userRole", { required: "Role is required" })}
              className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.userRole ? "border-red-500" : "border-gray-300"}`}
            >
              <option value="">Select a role</option>
              {roles.map((role) => (
                <option key={role._id} value={role._id}>{role.name}</option>
              ))}
            </select>
            {errors.userRole && (
              <span className="text-red-500 text-sm mt-1">{errors.userRole.message}</span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              {...register("userStatus", { required: "Status is required" })}
              className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.userStatus ? "border-red-500" : "border-gray-300"}`}
            >
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
            {errors.userStatus && (
              <span className="text-red-500 text-sm mt-1">{errors.userStatus.message}</span>
            )}
          </div>
       
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              onClick={() => setIsFormModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : modalMode === "add" ? "Create User" : "Save Changes"}
            </Button>
          </div>
        </form>
      </CustomModal>
      <CustomModal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete User"
      >
        <div className="space-y-4">
          <p className="text-gray-700">Are you sure you want to delete this user? This action cannot be undone.</p>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default SystemUserTable;