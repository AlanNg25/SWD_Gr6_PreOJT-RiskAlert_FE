import { apiClient } from './apiClient';

export const semesterAPI = {
    // Get all Semester
    getAll: () => apiClient('/api/Semester'),

    // Get Semester by ID
    getById: (id) => apiClient(`/api/Semester/${id}`),

    // Create new Semester
    create: (SemesterData) => apiClient('/api/Semester', 'POST', SemesterData),

    // Update Semester
    update: (id, SemesterData) => apiClient(`/api/Semester/${id}`, 'PUT', SemesterData),

    // Delete Semester
    delete: (id) => apiClient(`/api/Semester/${id}`, 'DELETE'),

    // Get Semester by Code
    getByCode: (code) => apiClient(`/api/Semester/code/${code}`)
};