import { Box, Button, Paper, Stack, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import AlertNotify from "../../components/global/AlertNotify";
import { tokens } from "../../theme/theme";
import { courseAPI } from "../../services/api/courseAPI";
import DialogCustom from "../../components/global/DialogCustom";
import CourseForm from "../../components/features/course-management/FormDiaglog";
import { peopleApi } from "../../services/api/peopleAPI";
// import { semesterApi } from "../../services/api/semesterAPI";
// import { subjectApi } from "../../services/api/subjectAPI";

export default function Course() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [courses, setCourses] = useState([]);
    const [alert, setAlert] = useState({ message: '', severity: 'info' });
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const paginationModel = { page: 0, pageSize: 7 };
    const columns = [
        { field: 'courseCode', headerName: 'Course Code', width: 150 },
        { field: 'teacherName', headerName: 'Teacher', width: 200 },
        { field: 'semesterCode', headerName: 'Semester', width: 120 },
        { 
            field: 'subject',
            headerName: 'Subject Info',
            flex: 1,
            renderCell: (params) => (
                <div>
                    {params.row.subjectCode} - {params.row.subjectName}
                </div>
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 180,
            renderCell: (params) => (
                <Stack direction="row" spacing={2}
                    alignItems="center"
                    justifyContent="center"
                    width="100%"
                    height="100%"
                >
                    <Button
                        style={{ height: '3em' }}
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleOpenDialog(params.row.id)}
                    >
                        Delete
                    </Button>
                    <Button
                        style={{ height: '3em' }}
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => handleEdit(params.row)}
                    >
                        Edit
                    </Button>
                </Stack>
            )
        }
    ];

    const fetchCourseData = async () => {
        try {
            const coursesData = await courseAPI.getAll();
            
            // Map the data with related information
            const enrichedCourses = await Promise.all(coursesData.map(async course => {
                const [teacher, semester, subject] = await Promise.all([
                    peopleApi.getById(course.teacherID),
                    semesterApi.getById(course.semesterID),
                    subjectApi.getById(course.subjectID)
                ]);

                return {
                    id: course.courseID,
                    courseCode: course.courseCode,
                    teacherName: teacher.fullName,
                    semesterCode: semester.semesterCode,
                    subjectCode: subject.subjectCode,
                    subjectName: subject.subjectName,
                    ...course
                };
            }));

            setCourses(enrichedCourses);
            setLoading(false);
        } catch (error) {
            setAlert({ 
                message: error.message || 'Failed to fetch courses', 
                severity: 'error' 
            });
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourseData();
    }, []);

    const handleOpenDialog = (courseId) => {
        setSelectedCourse(courseId);
        setOpenDialog(true);
    };

    const handleCloseDialog = async (confirm) => {
        setOpenDialog(false);
        if (confirm === 'yes' && selectedCourse) {
            try {
                await courseAPI.delete(selectedCourse);
                setAlert({ 
                    message: 'Course deleted successfully', 
                    severity: 'success' 
                });
                await fetchCourseData();
            } catch (error) {
                setAlert({ 
                    message: error.message || 'Failed to delete course', 
                    severity: 'error' 
                });
            }
        }
        setSelectedCourse(null);
    };

    return (
        <Box m="20px">
            {alert.message && (
                <AlertNotify
                    message={alert.message}
                    severity={alert.severity}
                    onClose={() => setAlert({ message: '', severity: 'info' })}
                />
            )}

            <DialogCustom
                title="Confirm Delete"
                content="Are you sure you want to delete this course?"
                open={openDialog}
                handleClose={handleCloseDialog}
            />

            {/* HEADER */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h2" color={colors.greyAccent[100]} fontWeight="bold">
                    Course Management
                </Typography>
                <Typography variant="h5" color={colors.secondary[400]}>
                    Welcome to Course Management
                </Typography>
            </Box>

            {/* CONTENT SECTION */}
            <Box mt="20px">
                <Paper sx={{ backgroundColor: 'transparent' }}>
                    <Stack direction="row" justifyContent="space-between" p={2}>
                        <Typography variant="h4">Courses List</Typography>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => {/* Handle create new */}}
                        >
                            Create New Course
                        </Button>
                    </Stack>
                    
                    <Box
                        sx={{
                            '& .MuiDataGrid-root': {
                                border: 'none',
                                borderRadius: '5px'
                            },
                            '& .MuiDataGrid-cell': {
                                borderBottom: 'none'
                            },
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: colors.blueAccent[700],
                                borderBottom: 'none'
                            },
                            height: '70vh',
                            width: '100%',
                            p: 2
                        }}
                    >
                        <DataGrid
                            rows={courses}
                            columns={columns}
                            pagination
                            paginationModel={paginationModel}
                            loading={loading}
                            autoHeight
                        />
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}