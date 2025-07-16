import { useCallback, useEffect, useState } from "react";
import { riskAnalysisAPI } from "../services/api/riskAPI";
import { enrollmenAPI } from "../services/api/enrollmentAPI";
import { peopleApi } from "../services/api/peopleAPI";

export function useRiskAnalysisWithUser() {
    const [riskAnalys, setRiskAnalys] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPrediction = async () => {
        try {
            setLoading(true);

            const [riskAnalys, people, enrollments] = await Promise.all(
                [riskAnalysisAPI.getAll(),
                peopleApi.getAll(),
                enrollmenAPI.getAll()]
            )
            // Map with enrollment by ID
            const erollmentMapping = {};
            enrollments.forEach(enroll => {
                const student = people.find(p => p.userID === enroll.studentID);
                erollmentMapping[enroll.enrollmentID] = { student };
            });

            const riskAnlWithPeople = riskAnalys.map(risk => ({
                ...risk,
                student: erollmentMapping[risk.enrollmentID]?.student || 'N/A',
            }))

            setRiskAnalys(riskAnlWithPeople);
            setEnrollments(enrollments);
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
        riskAnalys,
        enrollments,
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
            return { success: false, error: 'No riskAnalys ID provided' };
        setLoading(true);
        setError(null);
        try {
            const res = await riskAnalysisAPI.delete(id);
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