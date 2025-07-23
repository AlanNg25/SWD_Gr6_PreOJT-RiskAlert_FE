import { Box, Button, Paper, Stack, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import AlertNotify from "../../components/global/AlertNotify";
import { tokens } from "../../theme/theme";
import YesNoDialogCustom from '../../components/global/DialogCustom';
import { useCourse, useDelete, useDropdownData } from "../../hooks/ManageCourse";
import EditCourseForm from "../../screens/Course/EditCourseForm";

export default function Course() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const { courses, loading, error, refetch: refetchCourses } = useCourse();
    const { deleteCourse, loading: deleteLoading } = useDelete();
    const { teachers, semesters, subjects } = useDropdownData();

    const [alert, setAlert] = useState({ message: '', severity: 'info' });
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editData, setEditData] = useState(null);



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
                        disabled={deleteLoading}
                    >
                        Delete
                    </Button>
                    <Button
                        style={{ height: '3em' }}
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => handleEdit(params.row)}
                        disabled={deleteLoading}
                    >
                        Edit
                    </Button>
                </Stack>
            )
        }
    ];

    const handleOpenDialog = (courseId) => {
        setOpenConfirmDialog(prev => !prev);
        setSelectedCourse(courseId);
    };

    const handleCloseDialog = async (confirmRes) => {
        setOpenConfirmDialog(prev => !prev);

        if (confirmRes === 'no' || confirmRes === null) {
            console.log(confirmRes);
        }
        else if (confirmRes === 'yes') {
            handleDelete(selectedCourse);
        }
        setSelectedCourse(null);
    };

    const handleDelete = async (id) => {
        try {
            const res = await deleteCourse(id);
            if (res.success) {
                setAlert({
                    message: 'Course deleted successfully',
                    severity: 'success'
                });
                await refetchCourses(); // Refresh DataGrid after successful delete
                setSelectedCourse(null);
            } else {
                setAlert({
                    message: res.error || 'Failed to delete course',
                    severity: 'error'
                });
            }
        } catch (error) {
            setAlert({
                message: error.message || 'An error occurred',
                severity: 'error'
            });
        }
    };

    const handleEdit = (course) => {
        setEditData({
            id: course.id,
            courseCode: course.courseCode,
            teacherID: course.teacherID,
            semesterID: course.semesterID,
            subjectID: course.subjectID
        });
        setOpenEditDialog(true);
    };

    const handleCloseEdit = () => {
        setOpenEditDialog(false);
        setEditData(null);
    };

    const handleUpdate = async (updatedData) => {
        try {
            await courseAPI.update(editData.id, updatedData);
            setAlert({
                message: 'Course updated successfully',
                severity: 'success'
            });
            await refetchCourses();
            handleCloseEdit();
        } catch (error) {
            setAlert({
                message: error.message || 'Failed to update course',
                severity: 'error'
            });
        }
    };

    if (error) {
        return <AlertNotify message={error} severity="error" />;
    }

    return (
        <Box m="20px">
            {alert.message && (
                <AlertNotify
                    message={alert.message}
                    severity={alert.severity}
                    autoHide={true}
                    autoHideDelay={3000}
                    onClose={() => setAlert({ message: '', severity: 'info' })}
                />
            )}

            {openConfirmDialog && (
                <YesNoDialogCustom
                    diaglogTitle={'Confirmation'}
                    contentTXT={'Do you want to delete this course?'}
                    onClose={handleCloseDialog}
                    openState={handleOpenDialog}
                />
            )}

            {openEditDialog && (
                <EditCourseForm
                    open={openEditDialog}
                    onClose={handleCloseEdit}
                    onSubmit={handleUpdate}
                    initialData={editData}
                    teachers={teachers}
                    semesters={semesters}
                    subjects={subjects}
                />
            )}

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
                            onClick={() => {/* Handle create new */ }}
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
                                backgroundColor: colors.greyAccent[700],
                                borderBottom: 'none'
                            },
                            height: '70vh',
                            width: '100%',
                            p: 2
                        }}
                    >
                        <DataGrid
                            rows={courses}
                            getRowId={(row) => row.id}
                            columns={columns}
                            initialState={{ pagination: { paginationModel } }}
                            pageSizeOptions={[paginationModel.pageSize]}
                            loading={loading}
                            virtualizeColumnsWithAutoRowHeight
                        />
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}