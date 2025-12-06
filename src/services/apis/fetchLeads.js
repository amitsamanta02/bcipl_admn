// src/services/apis/fetchLeads.js
import apiClient from "../apiClient";

export async function fetchLeads(filters = {}) {
    try {
        const params = {};

        if (filters.startDate) params.startDate = filters.startDate;
        if (filters.endDate) params.endDate = filters.endDate;
        if (filters.status && filters.status !== "ALL") {
            params.status = filters.status;
        }

        const response = await apiClient.get("/filter", { params });
        console.log(response.data, "res of lead")
        return response.data;
    } catch (error) {
        throw error;
    }
}
