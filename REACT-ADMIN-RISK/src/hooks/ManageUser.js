import { useState, useEffect, useCallback } from 'react';
import { peopleApi } from '../services/api/peopleAPI';
import { majorAPI } from '../services/api/majorAPI';

export function usePeople() {
    const [people, setPeople] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPeople = async () => {
        try {
            setLoading(true);
            const data = await peopleApi.getAll();
            setPeople(data);
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
        people,
        loading,
        error,
        refetch: fetchPeople
    };
}

export function usePeopleWithMajor() {
    const [people, setPeople] = useState([]);
    const [majors, setMajors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPeople = async () => {
        try {
            setLoading(true);
            // Fetch cả people và majors cùng lúc
            const [peopleData, majorsData] = await Promise.all([
                peopleApi.getAll(),
                majorAPI.getAll()
            ]);

            // Map for look up major code
            const majorMap = {};
            majorsData.forEach(major => {
                majorMap[major.majorID] = {
                    MajorName: major.majorName,
                    MajorCode: major.majorCode
                };
            });

            // Kết hợp thông tin major vào từng person
            const peopleWithMajors = peopleData.map(person => ({
                ...person,
                MajorCode: majorMap[person.majorID]?.MajorCode || 'N/A',
                MajorName: majorMap[person.majorID]?.MajorName || 'Unknown'
            }));

            setPeople(peopleWithMajors);
            setMajors(majorsData);
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
        people,
        majors,
        loading,
        error,
        refetch: fetchPeople
    };
}

export function useDeleteUser() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteUser = useCallback(async (id) => {
        if (!id) return { success: false, error: 'No user ID provided' };
        setLoading(true);
        setError(null);
        try {
            await peopleApi.delete(id);
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    return { deleteUser, loading, error };
}