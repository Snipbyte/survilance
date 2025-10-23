import axios from "axios";

export const getAlerts = async (modelType, page = 1, limit = 10, macAddress = "", dateFrom = "", dateTo = "") => {
  try {
    const params = new URLSearchParams({ modelType, page: page.toString(), limit: limit.toString() });
    if (macAddress) params.append("macAddress", macAddress);
    if (dateFrom) params.append("dateFrom", dateFrom);
    if (dateTo) params.append("dateTo", dateTo);
    const response = await axios.get(`/api/alerts?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "An error occurred while fetching alerts.";
  }
};
