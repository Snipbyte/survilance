import React, { useState, useEffect, useCallback } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import Button from "@/app/components/common/button/button";
import PortZoneCard from "../portZoneCard/portZoneCard";
import CustomModal from "@/app/components/common/modal/modal";
import Alert from "@/app/components/common/alert/alert";
import { useForm, useFieldArray } from "react-hook-form";
import { getZones, addZone, editZone, deleteZone } from "../../../../../../utils/organization/zone/api";

const PortZoneSection = () => {
  const [zones, setZones] = useState([]);
  const [totalZones, setTotalZones] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const limit = 10;

  const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm({
    defaultValues: {
      coordinates: [{ lat: "", lng: "" }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "coordinates",
  });

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: "", message: "" }), 3000);
  };

  const fetchZones = useCallback(async () => {
    try {
      const response = await getZones(currentPage, limit, searchQuery);
      setZones(response.zonesData);
      setTotalZones(response.totalZonesDataNumber);
    } catch (error) {
      showAlert("error", error);
    }
  }, [currentPage, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => fetchZones(), 300);
    return () => clearTimeout(timer);
  }, [fetchZones]);

  const handleAddZone = () => {
    reset({ zoneName: "", zoneCode: "", zoneDescription: "", zoneType: "general", coordinates: [{ lat: "", lng: "" }], zoneStatus: "active", isZoneActive: true });
    setIsAddModalOpen(true);
  };

  const onAddSubmit = async (data) => {
    try {
      const coordinates = data.coordinates
        .filter((coord) => coord.lat !== "" && coord.lng !== "")
        .map((coord) => ({
          lat: parseFloat(coord.lat),
          lng: parseFloat(coord.lng),
        }));
      const response = await addZone({
        ...data,
        coordinates,
      });
      setZones((prev) => [response.zoneData, ...prev.slice(0, limit - 1)]);
      setTotalZones((prev) => prev + 1);
      setIsAddModalOpen(false);
      reset();
      showAlert("success", "Zone created successfully");
    } catch (error) {
      showAlert("error", error);
    }
  };

  const handleEdit = (zone) => {
    setSelectedZone(zone);
    setValue("zoneName", zone.zoneName);
    setValue("zoneCode", zone.zoneCode);
    setValue("zoneDescription", zone.zoneDescription);
    setValue("zoneType", zone.zoneType);
    setValue("coordinates", zone.coordinates.length > 0 ? zone.coordinates : [{ lat: "", lng: "" }]);
    setValue("zoneStatus", zone.zoneStatus);
    setValue("isZoneActive", zone.isZoneActive);
    setIsEditModalOpen(true);
  };

  const onEditSubmit = async (data) => {
    try {
      const coordinates = data.coordinates
        .filter((coord) => coord.lat !== "" && coord.lng !== "")
        .map((coord) => ({
          lat: parseFloat(coord.lat),
          lng: parseFloat(coord.lng),
        }));
      const response = await editZone(selectedZone._id, {
        ...data,
        coordinates,
      });
      setZones((prev) =>
        prev.map((zone) =>
          zone._id === selectedZone._id ? response.zoneData : zone
        )
      );
      setIsEditModalOpen(false);
      reset();
      setSelectedZone(null);
      showAlert("success", "Zone updated successfully");
    } catch (error) {
      showAlert("error", error);
    }
  };

  const handleDelete = (zone) => {
    setSelectedZone(zone);
    setIsDeleteModalOpen(true);
  };

  const onDeleteConfirm = async () => {
    try {
      await deleteZone(selectedZone._id);
      setZones((prev) => prev.filter((zone) => zone._id !== selectedZone._id));
      setTotalZones((prev) => prev - 1);
      setIsDeleteModalOpen(false);
      setSelectedZone(null);
      showAlert("success", "Zone deleted successfully");
    } catch (error) {
      showAlert("error", error);
    }
  };

  const handleCloseModal = (isEdit = false) => {
    console.log("Closing modal, isEdit:", isEdit);
    if (isEdit) {
      setIsEditModalOpen(false);
      setSelectedZone(null);
    } else {
      setIsAddModalOpen(false);
    }
    reset({ zoneName: "", zoneCode: "", zoneDescription: "", zoneType: "general", coordinates: [{ lat: "", lng: "" }], zoneStatus: "active", isZoneActive: true });
  };

  const zoneTypes = ["entry", "exit", "restricted", "general"];
  const zoneStatuses = ["active", "inactive", "maintenance"];

  const renderFormFields = (isEdit = false) => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Zone Name</label>
        <input
          {...register("zoneName", { required: "Zone Name is required" })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.zoneName && (
          <p className="text-red-600 text-sm mt-1">{errors.zoneName.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Zone Code</label>
        <input
          {...register("zoneCode", { required: "Zone Code is required" })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.zoneCode && (
          <p className="text-red-600 text-sm mt-1">{errors.zoneCode.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          {...register("zoneDescription")}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Zone Type</label>
        <select
          {...register("zoneType", { required: "Zone Type is required" })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {zoneTypes.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
        {errors.zoneType && (
          <p className="text-red-600 text-sm mt-1">{errors.zoneType.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Coordinates</label>
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center space-x-2 mb-2">
            <input
              type="number"
              step="any"
              {...register(`coordinates.${index}.lat`, {
                required: "Latitude is required",
                valueAsNumber: true,
                validate: (value) => !isNaN(value) || "Latitude must be a valid number",
              })}
              placeholder="Latitude"
              className="block w-1/2 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              step="any"
              {...register(`coordinates.${index}.lng`, {
                required: "Longitude is required",
                valueAsNumber: true,
                validate: (value) => !isNaN(value) || "Longitude must be a valid number",
              })}
              placeholder="Longitude"
              className="block w-1/2 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {index > 0 && (
              <Button
                icon={FaMinus}
                onClick={() => remove(index)}
                className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              />
            )}
          </div>
        ))}
        {errors.coordinates && (
          <p className="text-red-600 text-sm mt-1">
            {errors.coordinates.message || "Invalid coordinates"}
          </p>
        )}
        <Button
          icon={FaPlus}
          onClick={() => append({ lat: "", lng: "" })}
          className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 text-sm"
        >
          Add Coordinate
        </Button>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Zone Status</label>
        <select
          {...register("zoneStatus", { required: "Zone Status is required" })}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {zoneStatuses.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
        {errors.zoneStatus && (
          <p className="text-red-600 text-sm mt-1">{errors.zoneStatus.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            {...register("isZoneActive")}
            className="mr-2"
          />
          Active
        </label>
      </div>
      <div className="flex justify-end space-x-2 mt-4">
        <Button
          onClick={() => handleCloseModal(isEdit)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(isEdit ? onEditSubmit : onAddSubmit)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
        <h2 className="text-headingColor font-bold text-base md:text-lg">Port Zones</h2>
        <Button
          icon={FaPlus}
          onClick={handleAddZone}
          className="px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700"
        >
          Add Zone
        </Button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="space-y-3 min-h-[250px] max-h-[350px] overflow-auto">
        {zones.map((zone) => (
          <PortZoneCard
            key={zone._id}
            zone={zone}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-600">
          Showing {(currentPage - 1) * limit + 1} to{" "}
          {Math.min(currentPage * limit, totalZones)} of {totalZones} zones
        </span>
        <div className="flex space-x-2">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </Button>
          <Button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage * limit >= totalZones}
            className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </Button>
        </div>
      </div>
      <CustomModal
        isOpen={isAddModalOpen}
        onRequestClose={() => handleCloseModal(false)}
        title="Add New Zone"
      >
        {renderFormFields()}
      </CustomModal>
      <CustomModal
        isOpen={isEditModalOpen}
        onRequestClose={() => handleCloseModal(true)}
        title="Edit Zone"
      >
        {renderFormFields(true)}
      </CustomModal>
      <CustomModal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedZone(null);
        }}
        title="Delete Zone"
      >
        <div>
          <p>Are you sure you want to delete the zone "{selectedZone?.zoneName}"? This action cannot be undone.</p>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedZone(null);
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={onDeleteConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete
            </Button>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default PortZoneSection;