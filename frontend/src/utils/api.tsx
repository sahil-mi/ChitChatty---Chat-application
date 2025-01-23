import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "http://localhost:8000", // Your Django API base URL
});

// Function to refresh the access token
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refresh_token");
  try {
    const response = await api.post("/api/token/refresh/", {
      refresh: refreshToken,
    });

    const newAccessToken = response.data.access;
    localStorage.setItem("access_token", newAccessToken);
    return newAccessToken;
  } catch (error) {
    // console.error("Error refreshing token", error);
    // Log the user out if refresh token has expired
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    window.location.href = "/sign-in/";
  }
};

// Axios request interceptor to add Authorization header
api.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Axios response interceptor to handle 401 errors (expired tokens)
api.interceptors.response.use(
  (response) => {
    return response; // If the response is fine, pass it along
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();
        api.defaults.headers.common["Authorization"] =
          `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest); // Retry the original request with the new token
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
