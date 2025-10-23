"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Table from "../../common/table/table";
import Button from "../../common/button/button";
import { FaEdit, FaTrash, FaUserPlus } from "react-icons/fa";
import Pagination from "../../common/pagination/pagination";
import Alert from "../../common/alert/alert";
import CustomModal from "../../common/modal/modal";
import { addUserRole, getUserRoles, getUserRoleById, editUserRole, deleteUserRole } from "../../../../../utils/organization/auth/api";

const VALID_RESOURCES = [
  "organization", "user", "role", "device", "location", "profileOwn", "profileAny",
  "passwordOwn", "passwordAny", "notification", "report", "alert", "logs",
  "zone", "camera", "analytics", "dashboard", "settings"
];
const VALID_PERMISSIONS = ["create", "read", "update", "delete"];

const SystemUserRolesTable = () => {
  const [roles, setRoles] = useState([]);
  const [totalRoles, setTotalRoles] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [alert, setAlert] = useState({ show: false, type: "info", message: "" });
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const rowsPerPage = 4;

  const { register, handleSubmit, reset, formState: { errors, isSubmitting }, setValue } = useForm({
    defaultValues: {
      name: "",
      description: "",
      permissions: VALID_RESOURCES.reduce((acc, resource) => ({
        ...acc,
        [resource]: { create: false, read: false, update: false, delete: false }
      }), {})
    }
  });

  const columns = [
    {
      header: <input type="checkbox" className="mr-2" />,
      key: "checkbox",
      render: () => <input type="checkbox" className="mr-2" />,
    },
    { header: "Role Name", key: "name" },
    { header: "Description", key: "description" },
    {
      header: "Permissions",
      key: "permissions",
      render: (row) => (
        <span>
          {row.permissions
            .map((perm) => `${perm.resource}: ${perm.permission.join(", ")}`)
            .join("; ")}
        </span>
      ),
    },
    {
      header: "Actions",
      key: "actions",
      render: (row) => (
        <>
          <button
            className="text-blue-600 mr-2 hover:text-blue-800 transition-colors"
            onClick={() => handleEdit(row._id)}
            title="Edit Role"
          >
            <FaEdit />
          </button>
          <button
            className="text-red-600 hover:text-red-800 transition-colors"
            onClick={() => handleOpenDeleteModal(row._id)}
            title="Delete Role"
          >
            <FaTrash />
          </button>
        </>
      ),
    },
  ];

  // Fetch user roles with optional search query
  const fetchRoles = async () => {
    try {
      const response = await getUserRoles(currentPage + 1, rowsPerPage, searchQuery ? { search: searchQuery } : {});
      setRoles(response.roleData || []);
      setTotalRoles(response.totalUserRolesNumber || 0);
    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        message: error || "Failed to fetch user roles.",
      });
    }
  };

  useEffect(() => {
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
    setCurrentPage(0); // Reset to first page on search
  };

  // Handle add role button click
  const handleAddRole = () => {
    setModalMode("add");
    reset({
      name: "",
      description: "",
      permissions: VALID_RESOURCES.reduce((acc, resource) => ({
        ...acc,
        [resource]: { create: false, read: false, update: false, delete: false }
      }), {})
    });
    setIsFormModalOpen(true);
  };

  // Handle edit button click
  const handleEdit = async (id) => {
    try {
      const response = await getUserRoleById(id);
      const role = response.roleData;
      const permissionsState = VALID_RESOURCES.reduce((acc, resource) => {
        const permObj = role.permissions.find((p) => p.resource === resource);
        return {
          ...acc,
          [resource]: {
            create: permObj?.permission.includes("create") || false,
            read: permObj?.permission.includes("read") || false,
            update: permObj?.permission.includes("update") || false,
            delete: permObj?.permission.includes("delete") || false,
          }
        };
      }, {});
      reset({
        name: role.name,
        description: role.description,
        permissions: permissionsState,
      });
      setSelectedRoleId(id);
      setModalMode("edit");
      setIsFormModalOpen(true);
    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        message: error || "Failed to fetch role data.",
      });
    }
  };

  // Handle form submission for add/edit role
  const onSubmit = async (data) => {
    const formattedPermissions = Object.entries(data.permissions)
      .map(([resource, perms]) => ({
        resource,
        permission: Object.entries(perms)
          .filter(([_, selected]) => selected)
          .map(([perm]) => perm)
      }))
      .filter((permObj) => permObj.permission.length > 0);

    if (formattedPermissions.length === 0) {
      setAlert({
        show: true,
        type: "error",
        message: "At least one permission must be selected.",
      });
      return;
    }

    const roleData = {
      name: data.name,
      description: data.description,
      permissions: formattedPermissions,
    };

    try {
      if (modalMode === "add") {
        await addUserRole(roleData);
        setAlert({
          show: true,
          type: "success",
          message: "User role created successfully.",
        });
      } else {
        await editUserRole(selectedRoleId, roleData);
        setAlert({
          show: true,
          type: "success",
          message: "User role updated successfully.",
        });
      }
      
      setIsFormModalOpen(false);
      fetchRoles();
    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        message: error || `Failed to ${modalMode === "add" ? "create" : "update"} user role.`,
      });
    }
  };

  // Handle delete modal open
  const handleOpenDeleteModal = (id) => {
    setSelectedRoleId(id);
    setIsDeleteModalOpen(true);
  };

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    try {
      await deleteUserRole(selectedRoleId);
      setAlert({
        show: true,
        type: "success",
        message: "User role deleted successfully.",
      });
      setIsDeleteModalOpen(false);
      fetchRoles();
    } catch (error) {
      setAlert({
        show: true,
        type: "error",
        message: error || "Failed to delete user role.",
      });
    }
  };

  // Select all permissions
  const handleSelectAll = () => {
    const allPermissions = VALID_RESOURCES.reduce((acc, resource) => ({
      ...acc,
      [resource]: { create: true, read: true, update: true, delete: true }
    }), {});
    setValue("permissions", allPermissions);
  };

  // Unselect all permissions
  const handleUnselectAll = () => {
    const noPermissions = VALID_RESOURCES.reduce((acc, resource) => ({
      ...acc,
      [resource]: { create: false, read: false, update: false, delete: false }
    }), {});
    setValue("permissions", noPermissions);
  };

  const handlePageChange = (newPageIndex) => {
    setCurrentPage(newPageIndex);
  };

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
            placeholder="Search by role name..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-64 border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 transition-colors"
            onClick={handleAddRole}
          >
            <FaUserPlus /> Add New Role
          </Button>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800">User Roles</h2>
        </div>
        <Table
          data={roles}
          columns={columns}
          className="mt-4"
        />
        <Pagination
          pageCount={Math.ceil(totalRoles / rowsPerPage)}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalResults={totalRoles}
          resultsPerPage={rowsPerPage}
        />
      </div>
      <CustomModal
        isOpen={isFormModalOpen}
        onRequestClose={() => setIsFormModalOpen(false)}
        title={modalMode === "add" ? "Add New User Role" : "Edit User Role"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role Name
            </label>
            <input
              type="text"
              {...register("name", {
                required: "Role name is required",
                minLength: {
                  value: 3,
                  message: "Role name must be at least 3 characters",
                },
              })}
              className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.name && (
              <span className="text-red-500 text-sm mt-1">{errors.name.message}</span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 10,
                  message: "Description must be at least 10 characters",
                },
              })}
              className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? "border-red-500" : "border-gray-300"}`}
              rows={4}
            />
            {errors.description && (
              <span className="text-red-500 text-sm mt-1">{errors.description.message}</span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Permissions
            </label>
            <div className="flex justify-between mb-3">
              <Button
                type="button"
                className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors text-sm"
                onClick={handleSelectAll}
              >
                Select All
              </Button>
              <Button
                type="button"
                className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors text-sm"
                onClick={handleUnselectAll}
              >
                Unselect All
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto border border-gray-200 rounded-md p-4 bg-gray-50">
              {VALID_RESOURCES.map((resource) => (
                <div key={resource} className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-800 capitalize">{resource}</h3>
                  <div className="flex gap-4 mt-2">
                    {VALID_PERMISSIONS.map((perm) => (
                      <label key={perm} className="flex items-center gap-1 text-sm text-gray-600">
                        <input
                          type="checkbox"
                          {...register(`permissions.${resource}.${perm}`)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="capitalize">{perm}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
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
              {isSubmitting ? "Saving..." : modalMode === "add" ? "Create Role" : "Save Changes"}
            </Button>
          </div>
        </form>
      </CustomModal>
      <CustomModal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete Role"
      >
        <div className="space-y-4">
          <p className="text-gray-700">Are you sure you want to delete this role? This action cannot be undone.</p>
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

export default SystemUserRolesTable;