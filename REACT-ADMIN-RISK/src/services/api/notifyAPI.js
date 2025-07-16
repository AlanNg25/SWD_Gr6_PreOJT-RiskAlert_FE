import { apiClient } from './apiClient';

export const notifyAPI = {
    // Get all major
    getAll: () => apiClient('/api/Notification'),

    // Get Notification by ID
    getById: (id) => apiClient(`/api/Notification/${id}`),

    // Get Notification by UserID
    getByUserId: (idUser) => apiClient(`/api/Notification/by-user/${idUser}`),

    // Create new Notification
    create: (NotificationData) => apiClient('/api/Notification', 'POST', NotificationData),

    // Update Notification
    update: (id, NotificationData) => apiClient(`/api/Notification/${id}`, 'PUT', NotificationData),

    // Delete Notification
    delete: (id) => apiClient(`/api/Notification/${id}`, 'DELETE')
};