import { Outlet, Navigate } from "react-router-dom";
import { getValidUser } from './auth'

/**
 - ProtectedRoute component restricts access to routes based on authentication.
 * It checks for an "AUTHENTICATED_USER" item in localStorage.
 * The expected user data includes: fullName, role, and token.
 - Example user object:
 * {
    "fullName": "John Doe",
    "role": "admin",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
 */
const AUTH_STORAGE = "AUTHENTICATED_USER"

function ProtectedRoute() {
  try {
    const userData = getValidUser(AUTH_STORAGE);
    if (userData === null) {
      return <Navigate to="/login" />;
    }
    return <Outlet />;
  } catch (error) {
    console.log('protect route: ', error);
    localStorage.removeItem(AUTH_STORAGE);
    return <Navigate to="/logout" replace />;
  }
}

export default ProtectedRoute