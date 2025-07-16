import { apiClient } from './apiClient';

export const enrollmenAPI = {
    // Get all Enrollments
    getAll: () => apiClient('/api/Enrollment'),

    // Get Enrollment by ID
    getById: (id) => apiClient(`/api/Enrollment/${id}`),

    // Create new Enrollment
    create: (EnrollmentData) => apiClient('/api/Enrollment', 'POST', EnrollmentData),

    // Update Enrollment
    update: (id, EnrollmentData) => apiClient(`/api/Enrollment/${id}`, 'PUT', EnrollmentData),

    // Delete Enrollment
    delete: (id) => apiClient(`/api/Enrollment/${id}`, 'DELETE')
};