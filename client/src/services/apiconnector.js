import axios from "axios";

const axiosInstance = axios.create({
  withCredentials: true,
});

export const apiConnector = async (
  method,
  url,
  bodyData = null,
  params = null,
  headers = null
) => {
  try {
    const response = await axiosInstance({
      method: method.toUpperCase(),
      url,
      data: bodyData || null,
      params: params || null,
      headers: headers || null,
    });
    return response.data;
  } catch (error) {
    console.error("API call error:", error.response || error.message);
    throw error;
  }
};
