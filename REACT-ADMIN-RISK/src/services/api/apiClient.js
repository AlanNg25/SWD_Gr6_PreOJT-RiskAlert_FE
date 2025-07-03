import { getValidUser } from "../../utils/auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const AUTH_STORAGE = "AUTHENTICATED_USER";

const headers = {
    'accept': '*/*',
    'Content-Type': 'application/json'
};

export async function apiClient(path, method = 'GET', body = null) {
    const userData = getValidUser(AUTH_STORAGE);
    let token = null;

    if (userData) {
        try {
            token = userData.token;
        } catch (error) {
            throw new Error("Failed to parse user data from localStorage\n", error);
        }
    }

    // Add Authorization header if token exists
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }



    const res = await fetch(BASE_URL + path, {
        method,
        headers: headers,
        body: body ? JSON.stringify(body) : null
    });

    if (res.status === 401) {
        localStorage.removeItem(AUTH_STORAGE);
        const err = await res.text();
        throw new Error(err);
    }

    try {
        return await res.json();
    } catch {
        return res;
    }
}
