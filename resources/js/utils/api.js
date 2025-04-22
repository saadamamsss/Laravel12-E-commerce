import axios from "axios";

// Create an instance of Axios
export const API = axios.create({
    baseURL: `${import.meta.env.VITE_APP_URL}/_/api/`,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
    },
    withCredentials: true,
});

API.interceptors.request.use(
    (config) => {
        // Add CSRF token for non-GET requests
        if (config.method !== "get") {
            const csrfToken = document.querySelector(
                'meta[name="csrf-token"]'
            )?.content;
            if (csrfToken) {
                config.headers["X-CSRF-TOKEN"] = csrfToken;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
