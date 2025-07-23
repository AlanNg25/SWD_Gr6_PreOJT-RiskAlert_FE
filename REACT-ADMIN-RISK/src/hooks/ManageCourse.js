import { useState, useEffect, useCallback } from 'react';
import { courseAPI } from '../services/api/courseAPI';
import { peopleApi } from '../services/api/peopleAPI';
import { semesterAPI } from '../services/api/semesterAPI';
import { subjectAPI } from '../services/api/subjectAPI';

export function useCourse() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            // Fetch all related data in parallel
            const [coursesData, teachers, semesters, subjects] = await Promise.all([
                courseAPI.getAll(),
                peopleApi.getAll(),
                semesterAPI.getAll(),
                subjectAPI.getAll()
            ]);

            // Create mappings for quick lookups
            const teacherMap = teachers.reduce((acc, teacher) => {
                if (teacher.role === 'Teacher') {
                    acc[teacher.userID] = teacher;
                }
                return acc;
            }, {});

            const semesterMap = semesters.reduce((acc, sem) => {
                acc[sem.semesterID] = sem;
                return acc;
            }, {});

            const subjectMap = subjects.reduce((acc, sub) => {
                acc[sub.subjectID] = sub;
                return acc;
            }, {});

            // Enrich course data with related information
            const enrichedCourses = coursesData.map(course => ({
                id: course.courseID,
                courseCode: course.courseCode,
                teacherName: teacherMap[course.teacherID]?.fullName || 'N/A',
                teacherEmail: teacherMap[course.teacherID]?.email || 'N/A',
                semesterCode: semesterMap[course.semesterID]?.semesterCode || 'N/A',
                subjectCode: subjectMap[course.subjectID]?.subjectCode || 'N/A',
                subjectName: subjectMap[course.subjectID]?.subjectName || 'N/A',
                ...course
            }));

            setCourses(enrichedCourses);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    return {
        courses,
        loading,
        error,
        refetch: fetchCourses
    };
}

export function useDelete() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteCourse = useCallback(async (id) => {
        if (!id) return { success: false, error: 'No course ID provided' };
        
        setLoading(true);
        setError(null);
        
        try {
            const res = await courseAPI.delete(id);
            setError(null);
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
        deleteCourse,
        loading,
        error
    };
}

export function useDropdownData() {
    const [teachers, setTeachers] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDropdownData = async () => {
        try {
            setLoading(true);
            const [teachersData, semestersData, subjectsData] = await Promise.all([
                peopleApi.getAll(),
                semesterAPI.getAll(),
                subjectAPI.getAll()
            ]);

            setTeachers(teachersData.filter(t => t.role === 'Teacher'));
            setSemesters(semestersData);
            setSubjects(subjectsData);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDropdownData();
    }, []);

    return {
        teachers,
        semesters,
        subjects,
        loading,
        error,
        refetch: fetchDropdownData
    };
}