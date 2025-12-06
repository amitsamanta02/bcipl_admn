import publicApiClient from "../publicApiClient";

export async function resetPassword(payload) {
    try {
        const { token, newPassword } = payload;

        const response = await publicApiClient.post(
            `/auth/password/reset?token=${token}&newPassword=${newPassword}`
        );
        console.log(response.data, "res of reset pass api")
        return response.data; // {status, code, message}
    } catch (error) {
        throw error; // return raw error
    }
}
