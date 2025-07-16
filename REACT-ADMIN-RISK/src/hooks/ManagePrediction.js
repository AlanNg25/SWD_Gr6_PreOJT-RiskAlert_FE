import { useCallback, useEffect, useState } from "react";
import { predictionAPI } from "../services/api/prediction";
import { peopleApi } from "../services/api/peopleAPI";

export function usePredictionsWithUser() {
    const [predictions, setPredictions] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPrediction = async () => {
        try {
            setLoading(true);
            // Fetch both notification and people
            const [prediction, people] = await Promise.all(
                [predictionAPI.getAll(),
                peopleApi.getAll()]
            )
            // Map with user by ID
            const userMapping = {};
            people.forEach(user => {
                if (user.role === 'Student') {
                    userMapping[user.userID] = {
                        UserID: user.userID,
                        UserEmail: user.email,
                        UserFullname: user.fullName
                    };
                }
            });

            const predictionWithPeople = prediction.map(prediction => ({
                ...prediction,
                UserEmail: userMapping[prediction.studentID]?.UserEmail || 'N/A',
                UserFullname: userMapping[prediction.studentID]?.UserFullname || 'N/A',
            }))

            setPredictions(predictionWithPeople);
            setUsers(people);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrediction();
    }, []);

    return {
        predictions,
        users,
        loading,
        error,
        refetch: fetchPrediction
    };
}

export function useDelete() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deletePredic = useCallback(async (id) => {
        if (!id)
            return { success: false, error: 'No prediction ID provided' };
        setLoading(true);
        setError(null);
        try {
            const res = await predictionAPI.delete(id);
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