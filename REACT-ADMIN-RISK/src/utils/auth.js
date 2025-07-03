/**
 * Checks if a JWT token is expired.
 *
 * @param {string} token - The JWT token to check.
 * @returns {boolean} True if the token is expired or invalid, otherwise false.
 */

/**
 * Retrieves the valid authenticated user from localStorage.
 *
 * @param {string} nameItem_user - The nameItem_user to validate (currently unused).
 * @returns {Object|null} The user object if valid and not expired, otherwise null.
 */
// utils/auth.js
export function isTokenExpired(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Date.now() / 1000;
        return payload.exp < now;
    } catch (error) {
        console.log('auth error: ', error);
        return true; // If can't decode, consider expired
    }
}



export function getValidUser(nameItem_user) {
    try {
        const userStr = localStorage.getItem(nameItem_user);
        if (!userStr) return null;

        const user = JSON.parse(userStr);
        if (!user.token || isTokenExpired(user.token)) {
            localStorage.removeItem(nameItem_user);
            return null;
        }

        return user;
    } catch (error) {
        console.log('auth error: ', error);
        localStorage.removeItem(nameItem_user);
        return null;
    }
}