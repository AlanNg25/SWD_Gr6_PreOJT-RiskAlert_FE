import { useEffect, useState } from 'react';
import { Box, Paper, Typography, useTheme, Button, Stack, Autocomplete, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AlertNotify from '../../components/global/AlertNotify';
import { tokens } from '../../theme/theme';
import { useMajors } from '../../hooks/ManageMajor';
import DialogCustom from '../../components/global/DialogCustom';
import FormDialog from '../../components/features/major-management/FormDiaglog';
import { majorAPI } from '../../services/api/majorAPI';
// import FormDialog from '../../components/features/major-management/';
// import { majorAPI } from '../../services/api/majorAPI';

export default function Major() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [alert, setAlert] = useState({ message: '', severity: 'info' });
    // const [openDialog, setOpenDiaglog] = useState(false);
    // const [openModalEdit, setOpenModelEdit] = useState(false);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [majorIdMng, setMajorIdMng] = useState('');

    const { majors, loading, refetch } = useMajors();
    // const { deleteMajor, deleteLoading } = useDeleteOneMajor();

    const [selectedMajor, setSelectedMajor] = useState(null); // State to hold the selected major
    const [filteredRows, setFilteredRows] = useState([])
    const defaultProps = {
        options: Array.isArray(majors)
            ? majors.map((majs) => majs)
            : [],
        getOptionLabel: (option) => `${option.majorName}`,
    };
    // Fetch person by ID when selected
    useEffect(() => {
        if (selectedMajor) {
            const fetchMajorById = async () => {
                try {
                    const res = await majorAPI.getById(selectedMajor.majorID);
                    if (res) {
                        setFilteredRows([{ id: res.majorID, ...res }]);
                    } else {
                        setAlert({ message: 'Failed to fetch person', severity: 'error' });
                        setFilteredRows([]);
                    }
                } catch (error) {
                    setAlert({ message: error.message || 'An error occurred', severity: 'error' });
                    setFilteredRows([]);
                }
            };
            fetchMajorById();
        } else {
            // If no person is selected, show all rows
            setFilteredRows(
                Array.isArray(majors)
                    ? majors
                        .map(major => ({ id: major.majorID, ...major }))
                    : []
            );
        }
    }, [selectedMajor, majors]);

    // OPEN DIALOG
    // const handleOpenDialog = async (id) => {
    //     setMajorIdMng(id);
    //     setOpenDiaglog((prev) => (!prev));
    // }
    // const handleOpenEditModal = async (editedUser) => {
    //     setMajorIdMng(editedUser);
    //     setOpenModelEdit((prev) => (!prev));
    // }
    const handleOpenCreateModal = async () => {
        setOpenModalCreate((prev) => (!prev));
    }

    // CLOSE
    // const handleClose = (res) => {
    //     setOpenDiaglog((prev) => (!prev));

    //     if (res === 'no' || res === null) {
    //         console.log(res);
    //     }
    //     else if (res === 'yes') {
    //         handleDelete(majorIdMng)
    //     }
    //     setMajorIdMng('');
    // }
    // const handleCloseModal = () => {
    //     setOpenModelEdit((prev) => (!prev));
    //     setMajorIdMng('');
    // }
    const handleCloseModalCreate = () => {
        setOpenModalCreate((prev) => (!prev));
        setMajorIdMng('');
    }

    // // delete
    // const handleDelete = async (id) => {
    //     try {
    //         const res = await majorAPI.delete(id);
    //         if (res.success) {
    //             setAlert({ message: 'Major deleted successfully', severity: 'success' });
    //             await refetch(); // Refresh DataGrid after successful delete
    //             setSelectedMajor(null);
    //         } else {
    //             setAlert({ message: res.error || 'Failed to delete major', severity: 'error' });
    //         }
    //     } catch (error) {
    //         setAlert({ message: error.message || 'An error occurred', severity: 'error' });
    //     }
    // };
    // // update
    // const handleUpdate = async (row) => {
    //     try {
    //         if (majorIdMng == null || row == null)
    //             return;
    //         const res = await majorAPI.update(majorIdMng.majorID, row);
    //         if (res.ok) {
    //             setAlert({ message: 'Major updated successfully', severity: 'success' });
    //             await refetch();
    //         }
    //     } catch (error) {
    //         setAlert({ message: error.message || 'An error occurred', severity: 'error' });
    //     }
    //     setMajorIdMng('');
    // }
    // create
    const handleCreate = async (row) => {
        try {
            if (row == null) return;
            const res = await majorAPI.create(row);
            if (res) {
                setAlert({ message: 'User Create successfully', severity: 'success' });
                await refetch();
            }
        } catch (error) {
            setAlert({ message: error.message || 'An error occurred', severity: 'error' });
        }
        setMajorIdMng('');
    }

    const paginationModel = { page: 0, pageSize: 7 };
    const columns = [
        { field: 'majorCode', headerName: 'Code', width: 80 },
        { field: 'majorName', headerName: 'Major Name', flex: 1 },
        // ACTIONS
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
                    {/* <Button
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
                    </Button> */}
                    {/* <Button
                        style={{
                            height: '3em',
                        }}
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => handleOpenEditModal(params.row)}
                        disabled={loading}
                    >
                        Edit
                    </Button> */}
                </Stack>
            ),
            sortable: false,
            filterable: false,
        }
    ];


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
            {/* {openDialog && (
                <DialogCustom
                    diaglogTitle={'Confirmation'}
                    contentTXT={"Do you want to delete this one?"}
                    openState={openDialog}
                    onClose={handleClose}
                />)} */}
            {/* EDIT MODAL */}
            {/* {openModalEdit && (
                <FormDialog
                    formTitle="Customer Form"
                    contentTXT="Update information"
                    openState={openModalEdit}
                    onSave={handleUpdate}
                    initialData={majorIdMng}
                    onClose={handleCloseModal}
                />
            )} */}
            {/* CREATE MODAL */}
            {openModalCreate && (
                <FormDialog
                    formTitle="Customer Create"
                    contentTXT="Create a new user"
                    openState={openModalCreate}
                    onSave={handleCreate}
                    initialData={null}
                    onClose={handleCloseModalCreate}
                />
            )}

            {/* HEADER PAGE */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h2" color={colors.greyAccent[100]} fontWeight="bold">
                    Major Page
                </Typography>
                <Typography variant="h5" color={colors.secondary[400]}>
                    Welcome to Majors page
                </Typography>
            </Box>

            {/* CONTENT SECTION */}
            <Box mt="20px">
                <Paper
                    sx={{
                        backgroundColor: 'transparent',
                        boxShadow: 0
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
                                id="clear-on-escape"
                                clearOnEscape
                                value={selectedMajor}
                                onChange={(event, newValue) => {
                                    setSelectedMajor(newValue); // Update selected person
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} label="Choose Major" variant="standard"
                                        sx={{
                                            width: 260
                                        }}
                                    />
                                )}
                            />
                        </Box>
                        <Button
                            style={{
                                height: '3em',
                                margin: 'auto 1em',
                                color: colors.greyAccent[900],
                                fontWeight: 'bold'
                            }}
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => handleOpenCreateModal()}
                            disabled={loading}
                        >
                            Create
                        </Button>
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
                            rows={filteredRows}
                            columns={columns}
                            initialState={{ pagination: { paginationModel } }}
                            pageSizeOptions={[paginationModel.pageSize]}
                            loading={loading ? true : undefined}
                            virtualizeColumnsWithAutoRowHeight
                        />
                    </Box>
                </Paper>
            </Box >
        </Box >
    );
}