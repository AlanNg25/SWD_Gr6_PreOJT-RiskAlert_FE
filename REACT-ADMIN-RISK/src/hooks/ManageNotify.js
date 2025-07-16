import { useState, useEffect, useCallback } from 'react';
import { notifyAPI } from '../services/api/notifyAPI';
import { peopleApi } from '../services/api/peopleAPI';

export function useNotifiesWithUser() {
    const [notifies, setNotifies] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchNotify = async () => {
        try {
            setLoading(true);
            // Fetch both notification and people
            const [notify, people] = await Promise.all(
                [notifyAPI.getAll(),
                peopleApi.getAll()]
            )
            // Map with user by ID
            const userMapping = {};
            people.forEach(user => {
                userMapping[user.userID] = {
                    UserID: user.userID,
                    UserEmail: user.email,
                    UserFullname: user.fullName
                }
            });

            const notifyWithPeople = notify.map(notification => ({
                ...notification,
                UserEmail: userMapping[notification.receiverID]?.UserEmail || 'N/A',
                UserFullname: userMapping[notification.receiverID]?.UserFullname || 'N/A',
            }))

            setNotifies(notifyWithPeople);
            setUsers(people);
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
        notifies,
        users,
        loading,
        error,
        refetch: fetchNotify
    };
}

export function useDelete() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteNotify = useCallback(async (id) => {
        if (!id)
            return { success: false, error: 'No notification ID provided' };
        setLoading(true);
        setError(null);
        try {
            const res = await notifyAPI.delete(id);
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
        deleteNotify,
        loading,
        error
    };
}