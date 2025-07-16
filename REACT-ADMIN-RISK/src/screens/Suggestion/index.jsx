import { Autocomplete, Box, Button, Paper, Stack, TextField, Typography, useTheme } from "@mui/material";
import AlertNotify from "../../components/global/AlertNotify";
import { useEffect, useState } from "react";
import { tokens } from "../../theme/theme";
import { DataGrid } from "@mui/x-data-grid";
import { useDelete, useSuggestionWithUserAndRisk } from "../../hooks/ManageSuggest";
import { suggestionAPI } from "../../services/api/suggestionAPI";
import YesNoDialogCustom from "../../components/global/DialogCustom";
import { FormDiaglog } from "../../components/features/suggestion-management/FormDialog";

export default function Suggestion() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode)

    const paginationModel = { page: 0, pageSize: 7 };
    const columns = [
        {
            field: 'sentDate', headerName: 'Sent Date', width: 100,
            renderCell: (params) => (new Date(params.value).toLocaleDateString('vi-VN') || 'N/A')
        },
        {
            field: 'actionDate', headerName: 'Action Date', width: 100,
            renderCell: (params) => params.value != null
                ? new Date(params.value).toLocaleDateString('vi-VN')
                : <Typography align="center" m={'1em 0'}>N/A</Typography>
        },
        { field: 'actionType', headerName: 'Action Type', width: 100 },
        { field: 'notes', headerName: 'Notes', minWidth: 200 },
        { field: 'advisorEmail', headerName: 'Advisor Email', width: 100 },
        // { field: 'advisorFullName', headerName: 'Advisor Full Name', width: 100 },
        { field: 'RiskLevel', headerName: 'Risk Level', width: 100 },
        { field: 'RiskNotes', headerName: 'Risk Notes', flex: 2 },
        // { field: 'isRiskResolved', headerName: 'Resolved?', width: 100 },
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
                        onClick={() => handleOpenDialog(params.row.suggestionID)}
                        disabled={deleteLoading}
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
                        onClick={() => handleOpenEditModal(params.row)}
                        disabled={deleteLoading}
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
    const [suggestionChoosed, setSuggestionChoosed] = useState(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [openDiaglogEdit, setDiaglogEdit] = useState(false);


    const { suggestions, loading, refetch } = useSuggestionWithUserAndRisk();
    const { deletePredic, loading: deleteLoading } = useDelete();


    const [filterSuggestion, setFilterSuggestion] = useState([]);
    const [selectedSuggestion, setSelectedSuggestion] = useState(null);
    const defaultProps = {
        options: Array.isArray(suggestions)
            ? Array.from(
                new Map(suggestions.map(item => [item.suggestionID, item])).values()
            )
            : [],
        getOptionLabel: (option) => `${option.actionType} - `
            + `${option.notes}` || []
    }

    const handleOpenDialog = (e) => {
        setOpenConfirmDialog(true);
        setSuggestionChoosed(e);
    }
    const handleCloseDiaglog = (confirmRes) => {
        setOpenConfirmDialog((prev) => (!prev));

        if (confirmRes === 'no' || confirmRes === null) {
            console.log(confirmRes);
        }
        else if (confirmRes === 'yes') {
            handleDelete(suggestionChoosed)
        }
        setSuggestionChoosed(null);
    }
    const handleOpenEditModal = (row) => {
        setSuggestionChoosed({
            ...row,
            riskID: row.riskID,
            advisorID: row.advisorID,
            actionType: row.actionType,
            notes: row.notes,
        });

        setDiaglogEdit(true);
    }
    const handleCloseEditModal = () => {
        setDiaglogEdit(false);
    }
    const handleFilterBySuggest = async () => {
        try {
            setLoadingDetail(true);
            const res = await suggestionAPI.getById(selectedSuggestion.suggestionID);
            if (res) {
                const suggests = suggestions
                    .filter((n) => n.suggestionID == res.suggestionID);
                setFilterSuggestion(
                    suggests.map(suggest => ({
                        id: suggest.suggestionID,
                        ...suggest
                    }))
                );
            } else {
                setAlert({ message: 'Failed to fetch person', severity: 'error' });
                setFilterSuggestion([]);
            }
            setLoadingDetail(false);
        } catch (er) {
            setAlert({ message: er.message || 'An error occurred', severity: 'error' });
            setFilterSuggestion([]);
        }
    }

    // delete
    const handleDelete = async (id) => {
        try {
            const res = await deletePredic(id);
            if (res.success) {
                setAlert({ message: 'Suggestion deleted successfully', severity: 'success' });
                await refetch(); // Refresh DataGrid after successful delete
                setSuggestionChoosed(null);
            } else {
                setAlert({ message: res.error || 'Failed to delete prediction', severity: 'error' });
            }
        } catch (error) {
            setAlert({ message: error.message || 'An error occurred', severity: 'error' });
        }
    }
    // Update
    const handleUpdate = async (data) => {
        if (!data) return;
        try {
            const dataPredic = {
                riskID: data.riskID,
                advisorID: data.advisorID,
                actionType: data.actionType,
                actionDate: data.actionDate,
                notes: data.notes,
            };

            const res = await suggestionAPI.update(suggestionChoosed.suggestionID, dataPredic);
            if (res.ok) {
                setAlert({ message: "Suggestion updated successfully", severity: "success" });
                await refetch();
                setSuggestionChoosed(null);
            } else {
                setAlert({ message: res.status || 'An error occurred', severity: 'error' });
            }
        } catch (error) {
            setAlert({ message: error.message || 'An error occurred', severity: 'error' });
        }
    }

    // Fetch suggest by ID when selected
    useEffect(() => {
        const filterPrediction = () => {
            try {
                if (selectedSuggestion) {
                    handleFilterBySuggest();
                } else {
                    // Show all
                    const allSuggest = Array.isArray(suggestions)
                        ? suggestions.map(noti => ({ id: noti.predictionID, ...noti }))
                        : [];
                    setFilterSuggestion(allSuggest);
                }
            } catch (err) {
                console.error('Filter error:', err);
                setAlert({ message: err.message || 'An error occurred', severity: 'error' });
                setFilterSuggestion([]);
            }
        };

        filterPrediction();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedSuggestion, suggestions])

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

            {/* EDIT MODAL */}
            {openDiaglogEdit && (
                <FormDiaglog
                    openState={handleOpenEditModal}
                    formTitle={"Edit Suggestion"}
                    contentTXT={"Edit Suggestion form"}
                    onSave={handleUpdate}
                    onClose={handleCloseEditModal}
                    initialData={suggestionChoosed}
                />
            )}

            {/* HEADER PAGE */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h2" color={colors.greyAccent[100]} fontWeight="bold">
                    Suggestion Page
                </Typography>
                <Typography variant="h5" color={colors.secondary[400]}>
                    Welcome to Suggestion page
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
                                value={selectedSuggestion}
                                onChange={(event, newValue) => {
                                    setSelectedSuggestion(newValue);
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} label="Choose Suggestion" variant="outlined"
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
                            rows={filterSuggestion}
                            getRowId={(row) => row.suggestionID}
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
