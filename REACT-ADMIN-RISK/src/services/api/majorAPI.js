import { apiClient } from './apiClient';

export const majorAPI = {
    // Get all major
    getAll: () => apiClient('/api/Major'),

    // Get major by ID
    getById: (id) => apiClient(`/api/Major/${id}`),

    // Create new major
    // Example Value
    // {
    //   "majorCode": "string",
    //   "majorName": "string"
    // }
    create: (majorData) => apiClient('/api/Major', 'POST', majorData),

    // Update major
    update: (id, majorData) => apiClient(`/api/Major/${id}`, 'PUT', majorData),

    // Delete major
    delete: (id) => apiClient(`/api/Major/${id}`, 'DELETE')
};