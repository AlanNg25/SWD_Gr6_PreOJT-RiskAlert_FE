import { useEffect, useState } from "react";
import { gradeAPI } from "../services/api/gradeAPI";

export function useGrade() {
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchNotify = async () => {
        try {
            setLoading(true);

            const gradesList = await gradeAPI.getAll();

            setGrades(gradesList);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotify();
    }, []);

    return {
        grades,
        loading,
        error,
        refetch: fetchNotify
    };
}