import { Autocomplete, Box, Button, Paper, Stack, TextField, Typography, useTheme } from "@mui/material";
import AlertNotify from "../../components/global/AlertNotify";
import { useEffect, useState } from "react";
import { tokens } from "../../theme/theme";
import { DataGrid } from "@mui/x-data-grid";
import { useDelete, useRiskAnalysisWithUser } from "../../hooks/ManageRiskAnalysis";
import { riskAnalysisAPI } from "../../services/api/riskAPI";
import YesNoDialogCustom from "../../components/global/DialogCustom";

export default function RiskAnalysis() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode)

    const paginationModel = { page: 0, pageSize: 7 };
    const columns = [
        { field: 'riskLevel', headerName: 'Risk Level', minWidth: 50 },
        {
            field: 'trackingDate',
            headerName: 'Tracking Date',
            minWidth: 50,
            renderCell: (params) =>
                params.value ? new Date(params.value).toLocaleDateString('vi-VN') : '',
        },
        { field: 'notes', headerName: 'Notes', flex: 2 },
        {
            field: 'isResolved',
            headerName: 'Resolved?',
            minWidth: 50,
            type: 'boolean',
            renderCell: (params) => (params.value ? '✅ Yes' : '❌ No'),
        },
        {
            field: 'student',
            headerName: 'Student Code',
            minWidth: 50,
            renderCell: (params) => params.row?.student?.code || '',
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
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
                        disabled={deleteLoading}
                    >
                        Delete
                    </Button>
                </Stack>
            ),
            sortable: false,
            filterable: false,
        }
    ];

    const [alert, setAlert] = useState({ message: '', severity: 'info' });
    const [loadingDetail, setLoadingDetail] = useState(false)
    const [riskChoosed, setRiskChoosed] = useState(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const { riskAnalys, loading, refetch } = useRiskAnalysisWithUser();
    const { deletePredic, loading: deleteLoading } = useDelete();


    const [filterRisk, setFilterRisk] = useState([]);
    const [selectedRiskAnalys, setSelectedRiskAnalys] = useState(null);
    const defaultPropsUser = {
        options: Array.isArray(riskAnalys)
            ? Array.from(
                new Map(riskAnalys.map(item => [item.riskID, item])).values()
            )
            : [],
        getOptionLabel: (option) => `${option.riskLevel}` + `_ ${option.notes}` || []
    }

    const handleOpenDialog = (e) => {
        setOpenConfirmDialog(true);
        setRiskChoosed(e);
    }
    const handleCloseDiaglog = (confirmRes) => {
        setOpenConfirmDialog((prev) => (!prev));

        if (confirmRes === 'no' || confirmRes === null) {
            console.log(confirmRes);
        }
        else if (confirmRes === 'yes') {
            handleDelete(riskChoosed)
        }
        setRiskChoosed(null);
    }
    const handleFilterByRisk = async () => {
        try {
            setLoadingDetail(true);
            const res = await riskAnalysisAPI.getById(selectedRiskAnalys.riskID);
            if (res) {
                const risks = riskAnalys
                    .filter((n) => n.riskID == res.riskID);
                setFilterRisk(
                    risks.map(rsk => ({
                        id: rsk.riskID,
                        ...rsk
                    }))
                );
            } else {
                setAlert({ message: 'Failed to fetch person', severity: 'error' });
                setFilterRisk([]);
            }
            setLoadingDetail(false);
        } catch (er) {
            setAlert({ message: er.message || 'An error occurred', severity: 'error' });
            setFilterRisk([]);
        }
    }

    // delete
    const handleDelete = async (id) => {
        try {
            const res = await deletePredic(id);
            if (res.success) {
                setAlert({ message: 'Prediction deleted successfully', severity: 'success' });
                await refetch(); // Refresh DataGrid after successful delete
                setRiskChoosed(null);
            } else {
                setAlert({ message: res.error || 'Failed to delete prediction', severity: 'error' });
            }
        } catch (error) {
            setAlert({ message: error.message || 'An error occurred', severity: 'error' });
        }
    }

    // Fetch risks by ID when selected
    useEffect(() => {
        const filterPrediction = () => {
            try {
                if (selectedRiskAnalys) {
                    handleFilterByRisk();
                } else {
                    // Show all notifications
                    const allNotifications = Array.isArray(riskAnalys)
                        ? riskAnalys.map(risk => ({ id: risk.riskID, ...risk }))
                        : [];
                    setFilterRisk(allNotifications);
                }
            } catch (err) {
                console.error('Filter error:', err);
                setAlert({ message: err.message || 'An error occurred', severity: 'error' });
                setFilterRisk([]);
            }
        };

        filterPrediction();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedRiskAnalys, riskAnalys])

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

            {/* DialogConfirmDelete */}
            {openConfirmDialog && (
                <YesNoDialogCustom
                    diaglogTitle={'Confirmation'}
                    contentTXT={'Do you want to delete this prediction?'}
                    onClose={handleCloseDiaglog}
                    openState={handleOpenDialog}
                />
            )}

            {/* HEADER PAGE */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h2" color={colors.greyAccent[100]} fontWeight="bold">
                    Risk Analysis Page
                </Typography>
                <Typography variant="h5" color={colors.secondary[400]}>
                    Welcome to Risk Analysis page
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
                                value={selectedRiskAnalys}
                                onChange={(event, newValue) => {
                                    setSelectedRiskAnalys(newValue);
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} label="Choose Risk Analys" variant="outlined"
                                        sx={{
                                            width: '13em',
                                        }}
                                    />
                                )}
                            />
                        </Box>
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
                            rows={filterRisk}
                            columns={columns}
                            initialState={{ pagination: { paginationModel } }}
                            pageSizeOptions={[paginationModel.pageSize]}
                            loading={loading && loadingDetail}
                            virtualizeColumnsWithAutoRowHeight
                        />
                    </Box>
                </Paper>
            </Box>

        </Box>
    )
} 
