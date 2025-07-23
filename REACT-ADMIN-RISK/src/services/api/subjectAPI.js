import { apiClient } from './apiClient';

export const subjectAPI = {
    // Get all Subject
    getAll: () => apiClient('/api/Subject'),

    // Get Subject by ID
    getById: (id) => apiClient(`/api/Subject/${id}`),

    // Create new Subject
    create: (SubjectData) => apiClient('/api/Subject', 'POST', SubjectData),

    // Update Subject
    update: (id, SubjectData) => apiClient(`/api/Subject/${id}`, 'PUT', SubjectData),

    // Delete Subject
    delete: (id) => apiClient(`/api/Subject/${id}`, 'DELETE')
};