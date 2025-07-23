import { apiClient } from './apiClient';

export const courseAPI = {
    // Get all major
    getAll: () => apiClient('/api/Course'),

    // Get Course by ID
    getById: (id) => apiClient(`/api/Course/${id}`),

    // Create new Course
    create: (CourseData) => apiClient('/api/Course', 'POST', CourseData),

    // Update Course
    update: (id, CourseData) => apiClient(`/api/Course/${id}`, 'PUT', CourseData),

    // Delete Course
    delete: (id) => apiClient(`/api/Course/${id}`, 'DELETE')
};