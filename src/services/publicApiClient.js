import axios from "axios";
import { BASE_URL } from "../config/urls";

const publicApiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default publicApiClient;