import { apiClient } from './apiClient';

export const gradeAPI = {
    // Get all predictions
    getAll: () => apiClient('/api/Grade'),

    // Get grade by ID
    getById: (id) => apiClient(`/api/Grade/${id}`),

    // Get Detail List by GradeID
    getDetailListById: (gradeId) => apiClient(`/api/Grade/${gradeId}/details`),

    // Get Grade by UserID
    getByUserID: (userId) => apiClient(`/api/Grade/by-user/${userId}`),

    // Create new grade
    create: (gradeData) => apiClient('/api/Grade', 'POST', gradeData),

    // Create new grade details
    createDetails: (gradeDataDet) => apiClient('/api/Grade/details', 'POST', gradeDataDet),

    // Update grade
    update: (id, gradeData) => apiClient(`/api/Grade/${id}`, 'PUT', gradeData),

    // Update details
    updateDetails: (id, gradeDetData) => apiClient(`/api/Grade/details/${id}`, 'PUT', gradeDetData),

    // Delete grade
    delete: (id) => apiClient(`/api/Grade/${id}`, 'DELETE'),

    // Delete grade details
    deleteDetails: (idDet) => apiClient(`/api/Grade/details/${idDet}`, 'DELETE'),

};