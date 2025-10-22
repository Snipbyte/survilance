import axios from "axios";


export const getCameras = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`/api/organization/cameras/getCameras?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "An error occurred while fetching cameras.";
  }
};

export const getCameraById = async (id) => {
  try {
    const response = await axios.get(`/api/organization/cameras/getCameraById/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "An error occurred while fetching the camera.";
  }
};

export const addCamera = async (cameraData) => {
  try {
    const response = await axios.post("/api/organization/cameras/addCamera", cameraData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "An error occurred while creating the camera.";
  }
};

export const editCamera = async (id, cameraData) => {
  try {
    const response = await axios.put(`/api/organization/cameras/editCamera/${id}`, cameraData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "An error occurred while updating the camera.";
  }
};

export const deleteCamera = async (id) => {
  try {
    const response = await axios.delete(`/api/organization/cameras/deleteCamera/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "An error occurred while deleting the camera.";
  }
};