import axios from "axios";
import { store } from "../redux/store/store";
import { clearUser } from "../redux/reducers/authSlice";
import { BASE_URL } from "../config/urls";

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
});

// -------------------- REQUEST INTERCEPTOR --------------------
apiClient.interceptors.request.use(
    (config) => {
        const token = store.getState()?.auth?.accessToken;

        if (token) {
            console.log("Sending Authorization:", token);
            // config.headers["x-access-token"] = token;
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// -------------------- RESPONSE INTERCEPTOR --------------------
apiClient.interceptors.response.use(
    (response) => response,

    (error) => {
        const { status } = error.response || {};
        const originalRequest = error.config;

        // ------------------ Access Token Expired ------------------
        if (status === 401) {
            console.warn("❌ Access Token expired — Logging out.");

            // Clear redux session
            store.dispatch(clearUser());

            return Promise.reject(
                new Error("Session expired — please login again.")
            );
        }

        // ------------------ Custom backend error for token ------------------
        const backendCode =
            error?.response?.data?.responseData?.responseStatus;

        if (backendCode === 501) {
            console.warn("❌ Backend says token invalid (501) — Logging out.");

            store.dispatch(clearUser());

            return Promise.reject(
                new Error("Invalid token — please login again.")
            );
        }

        // ------------------ Other errors ------------------
        return Promise.reject(error);
    }
);

export default apiClient;
