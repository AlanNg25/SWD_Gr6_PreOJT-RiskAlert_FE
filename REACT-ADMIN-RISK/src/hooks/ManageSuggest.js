import { useCallback, useEffect, useState } from "react";
import { peopleApi } from "../services/api/peopleAPI";
import { riskAnalysisAPI } from "../services/api/riskAPI";
import { suggestionAPI } from "../services/api/suggestionAPI";

export function useSuggestionWithUserAndRisk() {
    const [suggestions, setSuggestions] = useState([]);
    const [users, setUsers] = useState([]);
    const [risks, setRisks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSuggestion = async () => {
        try {
            setLoading(true);
            // Fetch both notification and people
            const [suggestion, riskList, people] = await Promise.all(
                [suggestionAPI.getAll(),
                riskAnalysisAPI.getAll(),
                peopleApi.getAll()]
            )

            // Map with risk by ID
            const riskMapping = {};
            riskList.forEach(risk => {
                riskMapping[risk.riskID] = {
                    RiskLevel: risk.riskLevel,
                    RiskNotes: risk.notes,
                    isRiskResolved: risk.isResolved
                };
            });
            // Map with user by ID
            const userMapping = {};
            people.forEach(user => {
                if (user.role === 'Advisor') {
                    userMapping[user.userID] = {
                        advisorEmail: user.email,
                        advisorFullName: user.fullName
                    };
                }
            });

            const suggestionWithPeopleAndRisk = suggestion.map(suggestion => ({
                ...suggestion,
                advisorEmail: userMapping[suggestion.advisorID]?.advisorEmail || 'N/A',
                advisorFullName: userMapping[suggestion.advisorID]?.advisorFullName || 'N/A',
                RiskLevel: riskMapping[suggestion.riskID]?.RiskLevel || 'N/A',
                RiskNotes: riskMapping[suggestion.riskID]?.RiskNotes || 'N/A',
                isRiskResolved: riskMapping[suggestion.riskID]?.isRiskResolved || 'N/A',
            }))

            setSuggestions(suggestionWithPeopleAndRisk);
            setUsers(people);
            setRisks(risks)
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuggestion();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        suggestions,
        users,
        loading,
        error,
        refetch: fetchSuggestion
    };
}

export function useDelete() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deletePredic = useCallback(async (id) => {
        if (!id)
            return { success: false, error: 'No suggestion ID provided' };
        setLoading(true);
        setError(null);
        try {
            const res = await suggestionAPI.delete(id);
            setError(null)
            return { success: true, data: res };
        } catch (err) {
            const errMsg = err.message || "Delete failed";
            setError(errMsg);
            return { success: false, error: errMsg };
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        deletePredic,
        loading,
        error
    };
}