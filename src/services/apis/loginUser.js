import publicApiClient from '../publicApiClient';

export async function loginUser(payload) {
    try {
        const response = await publicApiClient.post(
            `/auth/login?email=${payload.email}&password=${payload.password}`
        );
        console.log(response.data, "res of login api")
        return response.data; // {status, code, message, metaData}
    } catch (error) {
        console.log(error, "error of login api")
        throw error; // Keep original error
    }
}
