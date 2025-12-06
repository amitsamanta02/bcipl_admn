import apiClient from "../apiClient";

export async function updateLeadStatus(id, status) {
    try {
        const response = await apiClient.post(`/update/status`, null, {
            params: { id: id, status: status },
        });
        console.log(response.data, "res of update status api")
        return response.data;
    } catch (error) {
        throw error;
    }
}
