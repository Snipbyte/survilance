import axios from "axios";

export const getZones = async (page = 1, limit = 10, search = "") => {
  try {
    const response = await axios.get(`/api/organization/zones/getZones?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "An error occurred while fetching zones.";
  }
};

export const getZoneById = async (id) => {
  try {
    const response = await axios.get(`/api/organization/zones/getZoneById/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "An error occurred while fetching the zone.";
  }
};

export const addZone = async (zoneData) => {
  try {
    const response = await axios.post("/api/organization/zones/addZone", zoneData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "An error occurred while creating the zone.";
  }
};

export const editZone = async (id, zoneData) => {
  try {
    const response = await axios.put(`/api/organization/zones/editZone/${id}`, zoneData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "An error occurred while updating the zone.";
  }
};

export const deleteZone = async (id) => {
  try {
    const response = await axios.delete(`/api/organization/zones/deleteZone/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "An error occurred while deleting the zone.";
  }
};