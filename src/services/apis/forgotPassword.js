import publicApiClient from '../publicApiClient';

export async function forgotPassword(payload) {
    try {
        const response = await publicApiClient.post(
            `/auth/password/forgot?email=${payload.email}`
        );
        console.log(response.data, "res of forgot api")
        return response.data; // {status, code, message}
    } catch (error) {
        console.log(error, "err in forgot api")
        throw error; // return raw error
    }
}