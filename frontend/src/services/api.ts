import axios from "axios";

// Creates a centralized axios instance
const api = axios.create({
  baseURL: "/api", // Relies on the vite.config.ts proxy
  withCredentials: true, // IMPORTANT: Allows passing HttpOnly JWT cookies!
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || (error.response.status === 400 && error.response.data?.message?.includes("token")))) {
      console.warn("Unauthorized access! The JWT might be expired or missing.");
      // Force a soft logout if the API actively rejects the auth token
      if (
        window.location.pathname !== "/login" && 
        window.location.pathname !== "/register" && 
        window.location.pathname !== "/" &&
        error.config?.url !== "/auth/me"
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
