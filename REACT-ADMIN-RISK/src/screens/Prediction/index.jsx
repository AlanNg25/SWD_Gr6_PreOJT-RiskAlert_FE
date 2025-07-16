import { Autocomplete, Box, Button, Paper, Stack, TextField, Typography, useTheme } from "@mui/material";
import AlertNotify from "../../components/global/AlertNotify";
import { useEffect, useState } from "react";
import { tokens } from "../../theme/theme";
import { DataGrid } from "@mui/x-data-grid";
import { useDelete, usePredictionsWithUser } from "../../hooks/ManagePrediction";
import { predictionAPI } from "../../services/api/prediction";
import YesNoDialogCustom from "../../components/global/DialogCustom";

export default function Prediction() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode)

    const paginationModel = { page: 0, pageSize: 7 };
    const columns = [
        {
            field: 'predictionDate', headerName: 'Prediction Date', width: 100,
            renderCell: (params) => {
                return new Date(params.value).toLocaleDateString('vi-VN');
            }
        },
        {
            field: 'UserEmail', headerName: 'Student Email', flex: 1,
        },
        {
            field: 'UserFullname', headerName: 'Student FullName', minWidth: 150,
        },
        {
            field: 'probability', headerName: 'Probability', flex: 1,
        },
        {
            field: 'details', headerName: 'Details', minWidth: 150,
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
            )
        }
    ];

    const [alert, setAlert] = useState({ message: '', severity: 'info' });
    const [loadingDetail, setLoadingDetail] = useState(false)
    const [predictChoosed, setPredictChoosed] = useState(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const { predictions, loading, refetch } = usePredictionsWithUser();
    const { deletePredic, loading: deleteLoading } = useDelete();

    const [filterPrediction, setFilterPrediction] = useState([]);
    const [selectedPrediction, setSelectedNotify] = useState(null);
    const defaultProps = {
        options: Array.isArray(predictions)
            ? Array.from(
                new Map(predictions.map(item => [item.UserEmail, item])).values()
            )
            : [],
        getOptionLabel: (option) => `${option.UserFullname} -`
            + `${option.probability}` || []
    }

    const handleOpenDialog = (e) => {
        setOpenConfirmDialog(true);
        setPredictChoosed(e);
    }
    const handleCloseDiaglog = (confirmRes) => {
        setOpenConfirmDialog((prev) => (!prev));

        if (confirmRes === 'no' || confirmRes === null) {
            console.log(confirmRes);
        }
        else if (confirmRes === 'yes') {
            handleDelete(predictChoosed)
        }
        setPredictChoosed(null);
    }
    const handleFilterByPredic = async () => {
        try {
            setLoadingDetail(true);
            const res = await predictionAPI.getById(selectedPrediction.predictionID);
            if (res) {
                const predics = predictions
                    .filter((n) => n.predictionID == res.predictionID);
                setFilterPrediction(
                    predics.map(predic => ({
                        id: predic.predictionID,
                        ...predic
                    }))
                );
            } else {
                setAlert({ message: 'Failed to fetch person', severity: 'error' });
                setFilterPrediction([]);
            }
            setLoadingDetail(false);
        } catch (er) {
            setAlert({ message: er.message || 'An error occurred', severity: 'error' });
            setFilterPrediction([]);
        }
    }

    // delete
    const handleDelete = async (id) => {
        try {
            const res = await deletePredic(id);
            if (res.success) {
                setAlert({ message: 'Prediction deleted successfully', severity: 'success' });
                await refetch(); // Refresh DataGrid after successful delete
                setPredictChoosed(null);
            } else {
                setAlert({ message: res.error || 'Failed to delete prediction', severity: 'error' });
            }
        } catch (error) {
            setAlert({ message: error.message || 'An error occurred', severity: 'error' });
        }
    }

    // Fetch prediction by ID when selected
    useEffect(() => {
        const filterPrediction = () => {
            try {
                if (selectedPrediction) {
                    handleFilterByPredic();
                } else {
                    // Show all notifications
                    const allNotifications = Array.isArray(predictions)
                        ? predictions.map(noti => ({ id: noti.predictionID, ...noti }))
                        : [];
                    setFilterPrediction(allNotifications);
                }
            } catch (err) {
                console.error('Filter error:', err);
                setAlert({ message: err.message || 'An error occurred', severity: 'error' });
                setFilterPrediction([]);
            }
        };

        filterPrediction();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedPrediction, predictions])

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
                    Prediction Page
                </Typography>
                <Typography variant="h5" color={colors.secondary[400]}>
                    Welcome to Prediction page
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
                                {...defaultProps}
                                clearOnEscape
                                value={selectedPrediction}
                                onChange={(event, newValue) => {
                                    setSelectedNotify(newValue);
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} label="Choose Prediction" variant="outlined"
                                        sx={{
                                            width: '15em',
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
                            rows={filterPrediction}
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
