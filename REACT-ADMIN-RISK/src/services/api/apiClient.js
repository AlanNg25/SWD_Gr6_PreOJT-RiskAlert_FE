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
            throw new Error("Failed to parse user data from localStorage: " + error.message);
        }
    }

    // Add Authorization header if token exists
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // var dataBody = JSON.stringify(body);
    try {
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

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(
                `HTTP ${res.status}: ${errorText || res.statusText}`);
        }

        // Kiểm tra content type trước khi parse JSON
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await res.json();
        } else {
            return res;
        }
    } catch (error) {
        // Xử lý các loại lỗi khác nhau
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Network error: Cannot connect to server. Please check if the server is running.');
        } else if (error.message.includes('ERR_CONNECTION_REFUSED')) {
            throw new Error('Connection refused: Server is not available.');
        } else if (error.message.includes('ERR_NETWORK')) {
            throw new Error('Network error: Please check your internet connection.');
        } else {
            throw error; // Re-throw other errors as-is
        }
    }

}
