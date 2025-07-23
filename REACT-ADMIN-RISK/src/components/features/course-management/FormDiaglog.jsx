import React, { useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { courseAPI } from '../../../services/api/courseAPI';
import AlertNotify from '../../global/AlertNotify';

const CourseForm = ({ onSuccess }) => {
    const [courseData, setCourseData] = useState({
        courseCode: '',
        courseName: '',
        description: '',
    });
    const [alert, setAlert] = useState({ message: '', severity: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourseData({ ...courseData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await courseAPI.create(courseData);
            setAlert({ message: 'Course created successfully!', severity: 'success' });
            onSuccess();
        } catch (error) {
            setAlert({ message: 'Failed to create course. Please try again.', severity: 'error' });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Typography variant="h4">Create Course</Typography>
            <TextField
                name="courseCode"
                label="Course Code"
                value={courseData.courseCode}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
            />
            <TextField
                name="courseName"
                label="Course Name"
                value={courseData.courseName}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
            />
            <TextField
                name="description"
                label="Description"
                value={courseData.description}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
                margin="normal"
            />
            <Button type="submit" variant="contained" color="primary">
                Submit
            </Button>
            {alert.message && <AlertNotify message={alert.message} severity={alert.severity} />}
        </form>
    );
};

export default CourseForm;