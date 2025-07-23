import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from '@mui/material';
import { useState } from "react";

const EditCourseForm = ({ open, onClose, onSubmit, initialData, teachers, semesters, subjects }) => {
    const [formData, setFormData] = useState(initialData || {});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogContent>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <TextField
                        name="courseCode"
                        label="Course Code"
                        value={formData.courseCode || ''}
                        onChange={handleChange}
                        fullWidth
                        required
                        margin="normal"
                    />
                    
                    <TextField
                        select
                        name="teacherID"
                        label="Teacher"
                        value={formData.teacherID || ''}
                        onChange={handleChange}
                        fullWidth
                        required
                        margin="normal"
                    >
                        {teachers.map((teacher) => (
                            <MenuItem key={teacher.userID} value={teacher.userID}>
                                {teacher.fullName}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        name="semesterID"
                        label="Semester"
                        value={formData.semesterID || ''}
                        onChange={handleChange}
                        fullWidth
                        required
                        margin="normal"
                    >
                        {semesters.map((semester) => (
                            <MenuItem key={semester.semesterID} value={semester.semesterID}>
                                {semester.semesterCode}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        name="subjectID"
                        label="Subject"
                        value={formData.subjectID || ''}
                        onChange={handleChange}
                        fullWidth
                        required
                        margin="normal"
                    >
                        {subjects.map((subject) => (
                            <MenuItem key={subject.subjectID} value={subject.subjectID}>
                                {`${subject.subjectCode} - ${subject.subjectName}`}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Update
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditCourseForm;