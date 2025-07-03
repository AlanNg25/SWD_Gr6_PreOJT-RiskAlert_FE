import { useState } from 'react';
import { Box, Paper, Typography, useTheme, Button, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AlertNotify from '../../components/global/AlertNotify';
import { tokens } from '../../theme/theme';
import { useDeleteUser, usePeopleWithMajor, useUpdateUser } from '../../hooks/ManageUser';
import DialogCustom from '../../components/global/DialogCustom';
import FormDialog from '../../components/global/FormDialog';
import { peopleApi } from '../../services/api/peopleAPI';

export default function People() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [alert, setAlert] = useState({ message: '', severity: 'info' });
    const [openDialog, setOpenDiaglog] = useState(false);
    const [openModalEdit, setOpenModelEdit] = useState(false);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [userIdMng, setUserIdMng] = useState('');

    const { people, loading, error: fetchError, refetch } = usePeopleWithMajor();
    const { deleteUser, loading: deleteLoading, error: deleteError } = useDeleteUser();
    // const { updateUser, loading: updateLoading, error: updateError } = useUpdateUser();

    const handleOpenDialog = async (id) => {
        setUserIdMng(id);
        setOpenDiaglog((prev) => (!prev));
    }
    const handleOpenEditModal = async (editedUser) => {
        setUserIdMng(editedUser);
        setOpenModelEdit((prev) => (!prev));
    }
    const handleOpenCreateModal = async () => {
        setOpenModalCreate((prev) => (!prev));
    }

    const handleClose = (res) => {
        setOpenDiaglog((prev) => (!prev));

        if (res === 'no' || res === null) {
            console.log(res);
        }
        else if (res === 'yes') {
            handleDelete(userIdMng)
        }
        setUserIdMng('');
    }
    const handleCloseModal = () => {
        setOpenModelEdit((prev) => (!prev));
        setUserIdMng('');
    }
    const handleCloseModalCreate = () => {
        setOpenModalCreate((prev) => (!prev));
        setUserIdMng('');
    }

    const handleDelete = async (id) => {
        try {
            const res = await deleteUser(id);
            if (res.success) {
                setAlert({ message: 'User deleted successfully', severity: 'success' });
                await refetch(); // Refresh DataGrid after successful delete
            } else {
                setAlert({ message: res.error || 'Failed to delete user', severity: 'error' });
            }
        } catch (error) {
            setAlert({ message: error.message || 'An error occurred', severity: 'error' });
        }
    };
    const handleUpdate = async (row) => {
        try {
            if (userIdMng == null || row == null) return;
            // Reorder the row object to match the desired order before sending to API
            const reorderedRow = {
                fullName: row.fullName,
                password: row.password,
                email: row.email,
                phone: row.phone,
                majorID: row.majorID,
                role: row.role.charAt(0).toUpperCase() + row.role.slice(1),
                code: row.code,
                status: row.status,
            };
            const res = await peopleApi.update(userIdMng.userID, reorderedRow);
            if (res.ok) {
                setAlert({ message: 'User updated successfully', severity: 'success' });
                await refetch();
            }
        } catch (error) {
            setAlert({ message: error.message || 'An error occurred', severity: 'error' });
        }
        setUserIdMng('');
    }
    const handleCreate = async (row) => {
        try {
            if (row == null) return;
            // Reorder the row object to match the desired order before sending to API
            const reorderedRow = {
                fullName: row.fullName,
                password: row.password,
                email: row.email,
                phone: row.phone,
                majorID: row.majorID,
                role: row.role,
                code: row.code,
                status: row.status,
            };
            const res = await peopleApi.create(reorderedRow);
            if (res) {
                setAlert({ message: 'User Create successfully', severity: 'success' });
                await refetch();
            }
        } catch (error) {
            setAlert({ message: error.message || 'An error occurred', severity: 'error' });
        }
        setUserIdMng('');
    }

    const paginationModel = { page: 0, pageSize: 7 };
    const columns = [
        { field: 'code', headerName: 'Code', width: 80 },
        { field: 'fullName', headerName: 'Full Name', width: 150 },
        { field: 'email', headerName: 'Email', width: 180 },
        { field: 'phone', headerName: 'Phone', width: 120 },
        { field: 'MajorCode', headerName: 'Major Code', width: 100 },
        { field: 'MajorName', headerName: 'Major Name', width: 100 },
        { field: 'role', headerName: 'Role', width: 100 },
        { field: 'password', headerName: 'Pass', flex: 1 },
        {
            field: 'status',
            headerName: 'Status',
            width: 80,
            renderCell: (params) => (
                params.value === 1
                    ? <span title="Enabled" style={{ color: 'green' }}>🟢</span>
                    : <span title="Disabled" style={{ color: 'red' }}>🔴</span>
            )
        },
        {
            field: 'createdAt', headerName: 'Created At', width: 90,
            renderCell: (params) => {
                return new Date(params.value).toLocaleDateString('en-GB');
            }
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

    const rows = Array.isArray(people)
        ? people.map(person => ({ id: person.userID, ...person }))
        : [];

    return (
        <Box m="20px">
            {/* DialogConfirmDelete */}
            {openDialog && (
                <DialogCustom
                    diaglogTitle={'Confirmation'}
                    contentTXT={"Do you want to delete this one?"}
                    openState={openDialog}
                    onClose={handleClose}
                />)}
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
            {/* EDIT MODAL */}
            {openModalEdit && (
                <FormDialog
                    formTitle="Customer Form"
                    contentTXT="Update information"
                    openState={openModalEdit}
                    onSave={handleUpdate}
                    initialData={userIdMng}
                    onClose={handleCloseModal}
                />
            )}
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
                    Clients Page
                </Typography>
                <Typography variant="h5" color={colors.secondary[400]}>
                    Welcome to Clients page
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
                        <Button
                            style={{
                                height: '3em',
                                margin: 'auto 1em',
                                color: colors.primary[900]
                            }}
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => handleOpenCreateModal()}
                            disabled={deleteLoading}
                        >
                            Create
                        </Button>
                    </Stack>
                    <Box
                        sx={{
                            '& .MuiDataGrid-root': {
                                border: `.5px solid ${colors.greyAccent[500]}`,
                            },
                            '& .MuiDataGrid-cell': {
                                borderBottom: 'none',
                            },
                            '& .MuiDataGrid-virtualScroller': {
                                backgroundColor: colors.primary[900],
                            },
                            height: '36em'
                        }}
                    >
                        <DataGrid
                            rows={rows}
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