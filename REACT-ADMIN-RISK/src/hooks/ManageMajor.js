import { useState, useEffect, useCallback } from 'react';
import { majorAPI } from '../services/api/majorAPI';

export function useMajors() {
    const [majors, setMajors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPeople = async () => {
        try {
            setLoading(true);
            const data = await majorAPI.getAll();
            setMajors(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPeople();
    }, []);

    return {
        majors,
        loading,
        error,
        refetch: fetchPeople
    };
}

export function useDeleteOneMajor() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteMajor = useCallback(async (id) => {
        if (!id) return { success: false, error: 'No major ID provided' };
        setLoading(true);
        setError(null);
        try {
            const res = await majorAPI.delete(id);
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
        deleteMajor,
        loading,
        error
    };
}