import { apiClient } from './apiClient';

export const courseAPI = {
    // Get all major
    getAll: () => apiClient('/api/Course'),

    // Get Course by ID
    getById: (id) => apiClient(`/api/Course/${id}`),

    // Create new Course
    create: (NotificationData) => apiClient('/api/Course', 'POST', NotificationData),

    // Update Course
    update: (id, NotificationData) => apiClient(`/api/Course/${id}`, 'PUT', NotificationData),

    // Delete Course
    delete: (id) => apiClient(`/api/Course/${id}`, 'DELETE')
};