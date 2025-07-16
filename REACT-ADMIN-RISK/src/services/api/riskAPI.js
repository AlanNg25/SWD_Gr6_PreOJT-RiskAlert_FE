import { apiClient } from './apiClient';

export const riskAnalysisAPI = {
    // Get all RiskAnalysiss
    getAll: () => apiClient('/api/RiskAnalysis'),

    // Get RiskAnalysis by ID
    getById: (id) => apiClient(`/api/RiskAnalysis/${id}`),

    // Create new RiskAnalysis
    create: (RiskAnalysisData) => apiClient('/api/RiskAnalysis', 'POST', RiskAnalysisData),

    // Update RiskAnalysis
    update: (id, RiskAnalysisData) => apiClient(`/api/RiskAnalysis/${id}`, 'PUT', RiskAnalysisData),

    // Delete RiskAnalysis
    delete: (id) => apiClient(`/api/RiskAnalysis/${id}`, 'DELETE')
};