import { Autocomplete, Box, Button, Paper, Stack, TextField, Typography, useTheme } from "@mui/material";
import AlertNotify from "../../components/global/AlertNotify";
import { useEffect, useState } from "react";
import { tokens } from "../../theme/theme";
import { DataGrid } from "@mui/x-data-grid";
import { useGrade } from "../../hooks/ManageGrade";
import { gradeAPI } from "../../services/api/gradeAPI";

export default function Grade() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode)

    const paginationModel = { page: 0, pageSize: 7 };
    const columns = [
        {
            field: 'gradeDate',
            headerName: 'Grade Date',
            minWidth: 130,
            renderCell: (params) =>
                params.value ? new Date(params.value).toLocaleDateString('vi-VN') : '',
        },
        { field: 'scoreAverage', headerName: 'Score', minWidth: 100 },
        {
            field: 'student.code',
            headerName: 'Student Code',
            minWidth: 100,
            renderCell: (params) => params.row.student?.code || '',
        },
        {
            field: 'student.email',
            headerName: 'Student Email',
            minWidth: 200,
            flex: 1,
            renderCell: (params) => params.row.student?.email || '',
        },
        {
            field: 'student.fullname',
            headerName: 'Student Email',
            minWidth: 200,
            renderCell: (params) => params.row.student?.fullName || '',
        },
        {
            field: 'course.courseCode',
            headerName: 'Course Code',
            minWidth: 120,
            renderCell: (params) => params.row.course?.courseCode || '',
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 180,
            renderCell: (params) => (
                <Stack direction="row" spacing={2}
                    alignItems="center"
                    justifyContent="center"   // <-- key change
                    width="100%"
                    height="100%"
                >
                    <Button
                        style={{
                            height: '3em',
                        }}
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleOpenDialog(params.row.id)}
                    // disabled={deleteLoading}
                    >
                        Delete
                    </Button>
                    <Button
                        style={{
                            height: '3em',
                        }}
                        variant="contained"
                        color="secondary"
                        size="small"
                    // onClick={() => handleOpenEditModal(params.row)}
                    // disabled={deleteLoading}
                    >
                        Edit
                    </Button>
                </Stack>
            ),
            sortable: false,
            filterable: false,
        }
    ];

    const [alert, setAlert] = useState({ message: '', severity: 'info' });
    const [loadingDetail, setLoadingDetail] = useState(false)


    const { grades, loading, refetch } = useGrade();


    const [filterGrade, setFilterGrade] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState(null);
    const defaultPropsUser = {
        options: Array.isArray(grades)
            ? Array.from(
                new Map(grades.map(item => [item.gradeID, item])).values()
            )
            : [],
        getOptionLabel: (option) =>
            `${option.student.email}` + ` _ ${option.course.courseCode}` || []
    }

    const handleOpenDialog = () => { }
    const handleFilterByGrade = async () => {
        try {
            setLoadingDetail(true);
            const res = await gradeAPI.getById(selectedGrade.gradeID);
            if (res) {
                const gradesss = grades
                    .filter((n) => n.gradeID == res.gradeID);
                setFilterGrade(
                    gradesss.map(grd => ({
                        ...grd
                    }))
                );
            } else {
                setAlert({ message: 'Failed to fetch person', severity: 'error' });
                setFilterGrade([]);
            }
            setLoadingDetail(false);
        } catch (er) {
            setAlert({ message: er.message || 'An error occurred', severity: 'error' });
            setFilterGrade([]);
        }
    }

    // Fetch grade by ID when selected
    useEffect(() => {
        const filterPrediction = () => {
            try {
                if (selectedGrade) {
                    handleFilterByGrade();
                } else {
                    // Show all grades
                    const allGrades = Array.isArray(grades)
                        ? grades.map(grd => ({ ...grd }))
                        : [];
                    setFilterGrade(allGrades);
                }
            } catch (err) {
                console.error('Filter error:', err);
                setAlert({ message: err.message || 'An error occurred', severity: 'error' });
                setFilterGrade([]);
            }
        };

        filterPrediction();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedGrade, grades])

    return (
        <Box m="20px">
            {/* ALERT MSG */}
            {alert.message && (
                <AlertNotify
                    message={alert.message}
                    severity={alert.severity}
                    autoHide={true}
                    autoHideDelay={3000}
                    onClose={() => setAlert({ message: '', severity: 'info' })}
                />
            )}

            {/* HEADER PAGE */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h2" color={colors.greyAccent[100]} fontWeight="bold">
                    Grade Page
                </Typography>
                <Typography variant="h5" color={colors.secondary[400]}>
                    Welcome to Grade page
                </Typography>
            </Box>
            {/* CONTENT SECTION */}
            <Box mt="20px">
                <Paper
                    sx={{
                        backgroundColor: 'transparent'
                    }} >
                    <Stack direction={'row'} justifyContent={'space-between'}>
                        <Typography variant="h4" p="10px">
                            Detail
                        </Typography>
                        <Box
                            display={'flex'}
                            alignContent={'flex-start'}
                            flex={1}
                        >
                            <Autocomplete
                                {...defaultPropsUser}
                                clearOnEscape
                                value={selectedGrade}
                                onChange={(event, newValue) => {
                                    setSelectedGrade(newValue);
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} label="Choose Notification" variant="outlined"
                                        sx={{
                                            width: '13em',
                                        }}
                                    />
                                )}
                            />
                        </Box>
                        <Button
                            style={{
                                height: '3em',
                                margin: 'auto 1em',
                                color: colors.primary[900],
                                fontWeight: 'bold'
                            }}
                            variant="contained"
                            color="success"
                            size="small"
                        // onClick={() => handleOpenCreateModal()}
                        // disabled={deleteLoading}
                        >Create</Button>
                    </Stack>
                    <Box
                        sx={{
                            '& .MuiDataGrid-root': {
                                borderRadius: '20px',
                                boxShadow: 4
                            },
                            '& .MuiDataGrid-columnHeader': {
                                backgroundColor: colors.greyAccent[900],
                            },
                            '& .MuiDataGrid-columnHeaderTitle': {
                                fontWeight: 'bold'
                            },
                            '& .MuiDataGrid-cell': {
                                borderBottom: 'none',
                            },
                            height: '36em'
                        }}
                    >
                        <DataGrid
                            rows={filterGrade}
                            getRowId={(row) => row.gradeID}
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
    )
} 
