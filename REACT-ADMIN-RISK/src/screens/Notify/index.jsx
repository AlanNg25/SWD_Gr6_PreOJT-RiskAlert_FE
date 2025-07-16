import { DataGrid } from '@mui/x-data-grid';
import { tokens } from '../../theme/theme';
import { Autocomplete, Box, Button, Paper, Stack, TextField, Typography, useTheme } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useDelete, useNotifiesWithUser } from '../../hooks/ManageNotify';
import { FormDiaglog } from '../../components/features/notify-management/FormDiaglog';
import AlertNotify from '../../components/global/AlertNotify'
import YesNoDialogCustom from '../../components/global/DialogCustom';
import { Link } from 'react-router-dom';
import { notifyAPI } from '../../services/api/notifyAPI';
import { deleteFile } from '../../services/firebase/ImageGgUpload';


export default function Notify() {
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
        { field: 'UserEmail', headerName: 'Receiver Email', flex: 1 },
        { field: 'content', headerName: 'Content', flex: 2 },
        {
            field: 'attachment', headerName: 'Attachment Link', flex: 2,
            renderCell: (params) => {
                const title = String(params.value).split('/').pop();
                return <Link href={params.value} underline="hover">
                    {title}
                </Link>
            }
        },
        {
            field: 'sentTime', headerName: 'Sent Time', flex: 1,
            renderCell: (params) => {
                return new Date(params.value).toLocaleDateString('vi-VN');
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

    const [alert, setAlert] = useState({ message: '', severity: 'info' });
    const [loadingDetail, setLoadingDetail] = useState(false)
    const [notificationChoosed, setNotiChoosed] = useState(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [openDiaglogEdit, setDiaglogEdit] = useState(false);


    const { notifies, loading, refetch } = useNotifiesWithUser();
    const { deleteNotify, loading: deleteLoading } = useDelete();

    const [filterNotify, setFilterNotify] = useState([]);
    const [selectedNotify, setSelectedNotify] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const defaultProps = useMemo(() => ({
        options: Array.isArray(notifies)
            ? selectedUser
                ? notifies.map((noti) => noti)
                    .filter(noti => noti.UserEmail == selectedUser.UserEmail)
                : notifies.map((noti) => noti)
            : [],
        getOptionLabel: (option) => `${option.content}` + `\n ${option.UserEmail}` || []
    }), [notifies, selectedUser]);
    const defaultPropsUser = {
        options: Array.isArray(notifies)
            ? Array.from(
                new Map(notifies.map(item => [item.UserEmail, item])).values()
            )
            : [],
        getOptionLabel: (option) => `${option.UserEmail}` || []
    }

    const handleOpenDialog = (e) => {
        setOpenConfirmDialog(prev => !prev);
        setNotiChoosed(e);
    }
    const handleCloseDiaglog = (confirmRes) => {
        setOpenConfirmDialog((prev) => (!prev));

        if (confirmRes === 'no' || confirmRes === null) {
            console.log(confirmRes);
        }
        else if (confirmRes === 'yes') {
            handleDelete(notificationChoosed)
        }
        setNotiChoosed(null);
    }
    const handleOpenEditModal = (row) => {
        setNotiChoosed({
            id: row.notificationID,
            receiverID: row.receiverID,
            content: row.content,
            status: row.status,
            attachment: row.attachment,
            fileName: row.attachment ? row.attachment.split("/").pop() : "",
            sentTime: row.sentTime,
        });
        setDiaglogEdit(prev => !prev);
    }
    const handleCloseEditModal = () => {
        setDiaglogEdit(prev => !prev);
    }
    const handleFilterByUser = async () => {
        try {
            setLoadingDetail(true);
            const res = await notifyAPI.getByUserId(selectedUser.receiverID);
            if (res) {
                const receiverIds = res.map(item => item.receiverID);
                if (!selectedNotify) {
                    const notis = notifies.filter(
                        n => receiverIds.includes(n.receiverID)
                    );
                    setFilterNotify(
                        notis.map(not => ({
                            id: not.notificationID,
                            ...not
                        }))
                    );
                } else {
                    const notis = notifies.find(n =>
                        n.notificationID == selectedNotify.notificationID
                    )
                    setFilterNotify([notis].map(not => ({
                        id: not.notificationID,
                        ...not
                    }))
                    );
                }
            } else {
                setAlert({ message: 'Failed to fetch person', severity: 'error' });
                setFilterNotify([]);
            }
            setLoadingDetail(false);
        } catch (er) {
            setAlert({ message: er.message || 'An error occurred', severity: 'error' });
            setFilterNotify([]);
        }
    }
    const handleFilterByNoti = async () => {
        try {
            setLoadingDetail(true);
            const res = await notifyAPI.getById(selectedNotify.notificationID);
            if (res) {
                const notifications = notifies
                    .filter((n) => n.notificationID == res.notificationID);
                setFilterNotify(
                    notifications.map(not => ({
                        id: not.notificationID,
                        ...not
                    }))
                );
            } else {
                setAlert({ message: 'Failed to fetch person', severity: 'error' });
                setFilterNotify([]);
            }
            setLoadingDetail(false);
        } catch (er) {
            setAlert({ message: er.message || 'An error occurred', severity: 'error' });
            setFilterNotify([]);
        }
    }


    // Delete
    const handleDelete = async (id) => {
        try {
            const res = await deleteNotify(id);
            if (res.success) {
                setAlert({ message: 'Notification deleted successfully', severity: 'success' });
                await refetch(); // Refresh DataGrid after successful delete
                setNotiChoosed(null);
            } else {
                setAlert({ message: res.error || 'Failed to delete Notification', severity: 'error' });
            }
        } catch (error) {
            setAlert({ message: error.message || 'An error occurred', severity: 'error' });
        }
    }
    // Update
    const handleUpdate = async (data) => {
        if (!data) return;
        try {
            const dataNotify = {
                "receiverID": data.receiverID,
                "content": data.content,
                "status": data.status,
                "attachment": data.attachment,
                "sentTime": data.sentTime
            }
            const res = await notifyAPI.update(data.id, dataNotify);
            if (res.ok) {
                setAlert({ message: "Notification updated successfully", severity: "success" });
                await refetch();
                setNotiChoosed(null);
            } else {
                handleUpdateFails(data, res, null);
            }
        } catch (error) {
            handleUpdateFails(data, null, error);
        }
    }
    const handleUpdateFails = async (data, res = null, er = null) => {
        if (data.fileRef) {
            try {
                await deleteFile(data.fileRef);
                setAlert({
                    message: "Update failed, uploaded file deleted",
                    severity: "warning",
                });
            } catch {
                setAlert({
                    message: "Update failed and unable to delete uploaded file",
                    severity: "error",
                });
            }
        } else {
            setAlert({
                message: res.error || er.message || "Failed to update notification",
                severity: "error",
            });
        }
    }

    // Fetch notifycation by ID and person by ID when selected
    useEffect(() => {
        const filterNotifications = () => {
            try {
                if (selectedUser) {
                    handleFilterByUser();
                } else if (selectedNotify) {
                    handleFilterByNoti();
                } else {
                    // Show all notifications
                    const allNotifications = Array.isArray(notifies)
                        ? notifies.map(noti => ({ id: noti.notificationID, ...noti }))
                        : [];
                    setFilterNotify(allNotifications);
                }
            } catch (err) {
                console.error('Filter error:', err);
                setAlert({ message: err.message || 'An error occurred', severity: 'error' });
                setFilterNotify([]);
            }
        };

        filterNotifications();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedNotify, selectedUser, notifies])

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
                    contentTXT={'Do you want to delete this notification?'}
                    onClose={handleCloseDiaglog}
                    openState={handleOpenDialog}
                />
            )}

            {/* EDIT MODAL */}
            {openDiaglogEdit && (
                <FormDiaglog
                    openState={handleOpenEditModal}
                    formTitle={"Edit Notification"}
                    contentTXT={"Edit Notification form"}
                    onSave={handleUpdate}
                    onClose={handleCloseEditModal}
                    initialData={notificationChoosed}
                />
            )}



            {/* HEADER PAGE */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h2" color={colors.greyAccent[100]} fontWeight="bold">
                    Notify Page
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
                        <Box
                            display={'flex'}
                            alignContent={'flex-start'}
                            flex={1}
                        >
                            <Autocomplete
                                {...defaultPropsUser}
                                clearOnEscape
                                value={selectedUser}
                                onChange={(event, newValue) => {
                                    setSelectedUser(newValue);
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} label="Choose User" variant="outlined"
                                        sx={{
                                            mr: 1,
                                            width: '13em'
                                        }}
                                    />
                                )}
                            />
                            <Autocomplete
                                {...defaultProps}
                                clearOnEscape
                                value={selectedNotify}
                                onChange={(event, newValue) => {
                                    setSelectedNotify(newValue);
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} label="Choose Notification" variant="outlined"
                                        sx={{
                                            width: '18em',
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
                            rows={filterNotify}
                            columns={columns}
                            initialState={{ pagination: { paginationModel } }}
                            pageSizeOptions={[paginationModel.pageSize]}
                            loading={loading || loadingDetail}
                            virtualizeColumnsWithAutoRowHeight
                        />
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}