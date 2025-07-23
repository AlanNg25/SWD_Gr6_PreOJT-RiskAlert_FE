import { useState, useEffect } from 'react';
import { courseAPI } from '../services/api/courseAPI';

export const useManageCourse = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await courseAPI.getAll();
                setCourses(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const createCourse = async (courseData) => {
        try {
            const newCourse = await courseAPI.create(courseData);
            setCourses((prevCourses) => [...prevCourses, newCourse]);
        } catch (err) {
            setError(err.message);
        }
    };

    const updateCourse = async (id, courseData) => {
        try {
            const updatedCourse = await courseAPI.update(id, courseData);
            setCourses((prevCourses) => 
                prevCourses.map((course) => (course.id === id ? updatedCourse : course))
            );
        } catch (err) {
            setError(err.message);
        }
    };

    const deleteCourse = async (id) => {
        try {
            await courseAPI.delete(id);
            setCourses((prevCourses) => prevCourses.filter((course) => course.id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    return {
        courses,
        loading,
        error,
        createCourse,
        updateCourse,
        deleteCourse,
    };
};