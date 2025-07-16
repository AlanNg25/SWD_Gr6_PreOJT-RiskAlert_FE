import { apiClient } from './apiClient';

export const suggestionAPI = {
    // Get all predictions
    getAll: () => apiClient('/api/Suggestion'),

    // Get Suggestion by ID
    getById: (id) => apiClient(`/api/Suggestion/${id}`),

    // Create new Suggestion
    create: (SuggestionData) => apiClient('/api/Suggestion', 'POST', SuggestionData),

    // Update Suggestion
    update: (id, SuggestionData) => apiClient(`/api/Suggestion/${id}`, 'PUT', SuggestionData),

    // Delete Suggestion
    delete: (id) => apiClient(`/api/Suggestion/${id}`, 'DELETE')
};