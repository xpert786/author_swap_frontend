import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

// Send cookies with requests so Django can set/read CSRF cookie
apiClient.defaults.withCredentials = true;

// Helper to read a cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}


apiClient.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    // Add CSRF token header for unsafe HTTP methods if available.
    const method = (config.method || "get").toLowerCase();
    const unsafeMethods = ["post", "put", "patch", "delete"];
    if (unsafeMethods.includes(method)) {
      const csrftoken = getCookie('csrftoken');
      if (csrftoken) {
        config.headers['X-CSRFToken'] = csrftoken;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");

      // Only redirect if not already on the login page to prevent infinite loops
      if (!window.location.pathname.includes("/login")) {
        window.location.replace("/authorswap-frontend/login");
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
