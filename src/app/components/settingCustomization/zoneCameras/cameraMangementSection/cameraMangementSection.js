import React, { useState, useEffect, useCallback } from "react";
import { FaPlus } from "react-icons/fa";
import Button from "@/app/components/common/button/button";
import CameraManagementCard from "../cameraMangementCard/cameraMangementCard";
import CustomModal from "@/app/components/common/modal/modal";
import Alert from "@/app/components/common/alert/alert";
import { useForm } from "react-hook-form";
import { getZones } from "../../../../../../utils/organization/zone/api";
import { getCameras, addCamera, editCamera, deleteCamera } from "../../../../../../utils/organization/camera/api";

const CameraManagementSection = () => {
  const [cameras, setCameras] = useState([]);
  const [totalCameras, setTotalCameras] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [zones, setZones] = useState([]);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const limit = 10;

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      deviceName: "",
      deviceId: "",
      deviceType: "surveillance",
      deviceIP: "",
      deviceMAC: "",
      deviceResolution: "1920x1080",
      deviceLocation: "",
      zoneId: "",
      isDeviceActive: true,
      deviceStatus: "offline",
    },
  });

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: "", message: "" }), 3000);
  };

  const fetchCameras = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getCameras(currentPage, limit);
      setCameras(response.devicesData);
      setTotalCameras(response.totalCameraDevicesNumber);
    } catch (error) {
      showAlert("error", error.message || "Failed to fetch cameras");
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  const fetchZones = useCallback(async () => {
    try {
      const response = await getZones(1, 100); // Fetch up to 100 zones for dropdown
      console.log("Fetched zones:", response.zonesData); // Debug log
      setZones(response.zonesData);
    } catch (error) {
      console.error("Error fetching zones:", error); // Debug log
      showAlert("error", error.message || "Failed to fetch zones");
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchCameras(), 300);
    fetchZones();
    return () => clearTimeout(timer);
  }, [fetchCameras, fetchZones]);

  const handleAddCamera = () => {
    reset({
      deviceName: "",
      deviceId: "",
      deviceType: "surveillance",
      deviceIP: "",
      deviceMAC: "",
      deviceResolution: "1920x1080",
      deviceLocation: "",
      zoneId: "",
      isDeviceActive: true,
      deviceStatus: "offline",
    });
    setIsAddModalOpen(true);
  };

  const onAddSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await addCamera({
        ...data,
        zoneId: data.zoneId || null,
      });
      setCameras((prev) => [response.deviceData, ...prev.slice(0, limit - 1)]);
      setTotalCameras((prev) => prev + 1);
      setIsAddModalOpen(false);
      reset();
      showAlert("success", "Camera added successfully");
    } catch (error) {
      showAlert("error", error.message || "Failed to add camera");
    } finally {
      setLoading(false);
    }
  };

  const onEditSubmit = async (data) => {
    try {
      setLoading(true);
      const { deviceId, deviceMAC, ...updateData } = data; // Exclude deviceId and deviceMAC
      const response = await editCamera(selectedCamera._id, {
        ...updateData,
        zoneId: data.zoneId || null,
      });
      setCameras((prev) =>
        prev.map((camera) =>
          camera._id === selectedCamera._id ? response.deviceData : camera
        )
      );
      setIsEditModalOpen(false);
      reset();
      setSelectedCamera(null);
      showAlert("success", "Camera updated successfully");
    } catch (error) {
      showAlert("error", error.message || "Failed to update camera");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (camera) => {
    setSelectedCamera(camera);
    setIsDeleteModalOpen(true);
  };

  const onDeleteConfirm = async () => {
    try {
      setLoading(true);
      await deleteCamera(selectedCamera._id);
      setCameras((prev) => prev.filter((camera) => camera._id !== selectedCamera._id));
      setTotalCameras((prev) => prev - 1);
      setIsDeleteModalOpen(false);
      setSelectedCamera(null);
      showAlert("success", "Camera deleted successfully");
    } catch (error) {
      showAlert("error", error.message || "Failed to delete camera");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = (isEdit = false) => {
    console.log("Closing modal, isEdit:", isEdit);
    if (isEdit) {
      setIsEditModalOpen(false);
      setSelectedCamera(null);
    } else {
      setIsAddModalOpen(false);
    }
    reset({
      deviceName: "",
      deviceId: "",
      deviceType: "surveillance",
      deviceIP: "",
      deviceMAC: "",
      deviceResolution: "1920x1080",
      deviceLocation: "",
      zoneId: "",
      isDeviceActive: true,
      deviceStatus: "offline",
    });
  };

  
  const handleEdit = (camera) => {
    setSelectedCamera(camera);
    setValue("deviceName", camera.deviceName);
    setValue("deviceId", camera.deviceId);
    setValue("deviceType", camera.deviceType);
    setValue("deviceIP", camera.deviceIP);
    setValue("deviceMAC", camera.deviceMAC);
    setValue("deviceResolution", camera.deviceResolution);
    setValue("deviceLocation", camera.deviceLocation);
    setValue("zoneId", camera.zoneId?._id || "");
    setValue("isDeviceActive", camera.isDeviceActive);
    setValue("deviceStatus", camera.deviceStatus);
    setIsEditModalOpen(true);
  };


  const deviceTypes = ["surveillance", "cctv", "webcam"];
  const deviceStatuses = ["online", "offline", "maintenance"];

  const renderFormFields = (isEdit = false) => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Device Name</label>
        <input
          {...register("deviceName", { required: "Device Name is required" })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.deviceName && (
          <p className="text-red-600 text-sm mt-1">{errors.deviceName.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Device ID</label>
        <input
          {...register("deviceId", { required: "Device ID is required" })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isEdit}
        />
        {errors.deviceId && (
          <p className="text-red-600 text-sm mt-1">{errors.deviceId.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Device Type</label>
        <select
          {...register("deviceType", { required: "Device Type is required" })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {deviceTypes.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
        {errors.deviceType && (
          <p className="text-red-600 text-sm mt-1">{errors.deviceType.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Device IP</label>
        <input
          {...register("deviceIP", {
            required: "Device IP is required",
            pattern: {
              value: /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/,
              message: "Invalid IP address format",
            },
          })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.deviceIP && (
          <p className="text-red-600 text-sm mt-1">{errors.deviceIP.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Device MAC</label>
        <input
          {...register("deviceMAC", {
            required: "Device MAC is required",
            pattern: {
              value: /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
              message: "Invalid MAC address format (e.g., 00:1A:2B:3C:4D:5E)",
            },
          })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isEdit}
        />
        {errors.deviceMAC && (
          <p className="text-red-600 text-sm mt-1">{errors.deviceMAC.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Device Resolution</label>
        <input
          {...register("deviceResolution", { required: "Device Resolution is required" })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.deviceResolution && (
          <p className="text-red-600 text-sm mt-1">{errors.deviceResolution.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Device Location</label>
        <input
          {...register("deviceLocation")}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Zone</label>
        <select
          {...register("zoneId")}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">No Zone</option>
          {zones.length > 0 ? (
            zones.map((zone) => (
              <option key={zone._id} value={zone._id}>
                {zone.zoneName}
              </option>
            ))
          ) : (
            <option value="" disabled>
              No zones available
            </option>
          )}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Device Status</label>
        <select
          {...register("deviceStatus", { required: "Device Status is required" })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {deviceStatuses.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
        {errors.deviceStatus && (
          <p className="text-red-600 text-sm mt-1">{errors.deviceStatus.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            {...register("isDeviceActive")}
            className="mr-2"
          />
          Active
        </label>
      </div>
      <div className="flex justify-end space-x-2 mt-4">
        <Button
          onClick={() => handleCloseModal(isEdit)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          isLoading={loading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(isEdit ? onEditSubmit : onAddSubmit)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          isLoading={loading}
        >
          {isEdit ? "Update" : "Create"}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg border p-3 mb-2 md:mb-0">
      {alert.show && (
        <Alert
          type={alert.type}
          message={alert.message}
          className="mb-4 z-[10000]"
        />
      )}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-headingColor font-bold text-base md:text-lg">Camera Management</h2>
        <Button
          icon={FaPlus}
          onClick={handleAddCamera}
          className="px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 text-white bg-green-600 hover:bg-green-700"
          isLoading={loading}
        >
          Add Camera
        </Button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="space-y-3 min-h-[250px] max-h-[350px] overflow-auto">
        {cameras.map((camera) => (
          <CameraManagementCard
            key={camera._id}
            camera={camera}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-600">
          Showing {(currentPage - 1) * limit + 1} to{" "}
          {Math.min(currentPage * limit, totalCameras)} of {totalCameras} cameras
        </span>
        <div className="flex space-x-2">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            isLoading={loading}
          >
            Previous
          </Button>
          <Button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage * limit >= totalCameras}
            className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            isLoading={loading}
          >
            Next
        </Button>
        </div>
      </div>
      <CustomModal
        isOpen={isAddModalOpen}
        onRequestClose={() => handleCloseModal(false)}
        title="Add New Camera"
      >
        {renderFormFields()}
      </CustomModal>
      <CustomModal
        isOpen={isEditModalOpen}
        onRequestClose={() => handleCloseModal(true)}
        title="Edit Camera"
      >
        {renderFormFields(true)}
      </CustomModal>
      <CustomModal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedCamera(null);
        }}
        title="Delete Camera"
      >
        <div>
          <p>Are you sure you want to delete the camera "{selectedCamera?.deviceName}"? This action cannot be undone.</p>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedCamera(null);
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              isLoading={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={onDeleteConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              isLoading={loading}
            >
              Delete
            </Button>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default CameraManagementSection;