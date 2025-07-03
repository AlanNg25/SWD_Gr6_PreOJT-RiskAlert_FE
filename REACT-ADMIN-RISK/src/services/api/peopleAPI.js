import { apiClient } from './apiClient';

export const peopleApi = {
    // Get all people
    getAll: () => apiClient('/api/User'),

    // Get person by ID
    getById: (id) => apiClient(`/api/User/${id}`),

    // Create new person
    create: (personData) => apiClient('/api/User', 'POST', personData),

    // Update person
    update: (id, personData) => apiClient(`/api/User/${id}`, 'PUT', personData),

    // Delete person
    delete: (id) => apiClient(`/api/User/${id}`, 'DELETE')
};