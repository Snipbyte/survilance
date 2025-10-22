import axios from "axios";

export const loginUser = async (emailOrUserId, password) => {
  try {
    const response = await axios.post("/api/organization/auth/login", {
      emailOrUserId,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "An error occurred during login.";
  }
};


export const addUser = async (userData) => {
  try {
    const response = await axios.post("/api/organization/users/addUser", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "An error occurred while creating the user.";
  }
};

export const getUsers = async (page = 1, limit = 10, params = {}) => {
  try {
    const response = await axios.get("/api/organization/users/getUsers", {
      params: { page, limit, ...params },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "An error occurred while fetching users.";
  }
};

export const getUserById = async (id) => {
  try {
    const response = await axios.get(`/api/organization/users/getUserById/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "An error occurred while fetching the user.";
  }
};

export const editUser = async (id, userData) => {
  try {
    const response = await axios.put(`/api/organization/users/editUser/${id}`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "An error occurred while updating the user.";
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`/api/organization/users/deleteUser/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "An error occurred while deleting the user.";
  }
};



export const addUserRole = async (roleData) => {
  try {
    const response = await axios.post("/api/organization/userRoles/addUserRole", roleData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "An error occurred while creating the user role.";
  }
};

export const getUserRoles = async (page = 1, limit = 10, params = {}) => {
  try {
    const response = await axios.get("/api/organization/userRoles/getUserRoles", {
      params: { page, limit, ...params },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "An error occurred while fetching user roles.";
  }
};

export const getUserRoleById = async (id) => {
  try {
    const response = await axios.get(`/api/organization/userRoles/getUserRoleById/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "An error occurred while fetching the user role.";
  }
};

export const editUserRole = async (id, roleData) => {
  try {
    const response = await axios.put(`/api/organization/userRoles/editUserRole/${id}`, roleData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "An error occurred while updating the user role.";
  }
};

export const deleteUserRole = async (id) => {
  try {
    const response = await axios.delete(`/api/organization/userRoles/deleteUserRole/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "An error occurred while deleting the user role.";
  }
};


export const getUserProfile = async () => {
  try {
    const response = await axios.get("/api/organization/auth/me");
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "An error occurred while fetching the profile.";
  }
};

export const logoutUser = async () => {
  try {
   
    return { message: "Logout successful" };
  } catch (error) {
    throw error.response?.data?.error || "An error occurred during logout.";
  }
};