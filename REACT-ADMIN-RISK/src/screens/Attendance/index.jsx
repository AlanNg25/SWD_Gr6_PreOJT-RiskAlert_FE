import { Autocomplete, Box, Button, Paper, Stack, TextField, Typography, useTheme } from "@mui/material";
import AlertNotify from "../../components/global/AlertNotify";
import { useEffect, useState } from "react";
import { tokens } from "../../theme/theme";
import { DataGrid } from "@mui/x-data-grid";

export default function Attendance() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode)

    const paginationModel = { page: 0, pageSize: 7 };
    const columns = [
        {
            field: 'status', headerName: 'Status', flex: 1,
            renderCell: (params) => (
                params.value === 1
                    ? <span style={{ color: 'green', display: 'flex', justifyContent: 'center' }}>🟢</span>
                    : <span style={{ color: 'red', display: 'flex', justifyContent: 'center' }}>🔴</span>
            )
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

    const { notifies, loading, refetch } = [null, null, () => { }];

    const [filterAttendance, setFilterAttendance] = useState([]);
    const [selectedNotify, setSelectedNotify] = useState(null);
    const defaultPropsUser = {
        options: Array.isArray(notifies)
            ? Array.from(
                new Map(notifies.map(item => [item.UserEmail, item])).values()
            )
            : [],
        getOptionLabel: (option) => `${option.UserEmail}` || []
    }

    const handleOpenDialog = () => { }

    useEffect(() => { }, [])

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
                    Attendance Page
                </Typography>
                <Typography variant="h5" color={colors.secondary[400]}>
                    Welcome to Attendance page
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
                                value={selectedNotify}
                                onChange={(event, newValue) => {
                                    setSelectedNotify(newValue);
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
                            rows={filterAttendance}
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
