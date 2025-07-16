import { apiClient } from './apiClient';

export const predictionAPI = {
    // Get all predictions
    getAll: () => apiClient('/api/Prediction'),

    // Get Prediction by ID
    getById: (id) => apiClient(`/api/Prediction/${id}`),

    // Create new Prediction
    create: (PredictionData) => apiClient('/api/Prediction', 'POST', PredictionData),

    // Update Prediction
    update: (id, PredictionData) => apiClient(`/api/Prediction/${id}`, 'PUT', PredictionData),

    // Delete Prediction
    delete: (id) => apiClient(`/api/Prediction/${id}`, 'DELETE')
};