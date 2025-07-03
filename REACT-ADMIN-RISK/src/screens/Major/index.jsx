import { tokens } from '../../theme/theme';
import { useTheme } from '@mui/material';


export default function Major() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode)

    return (
        <Box m="20px">
            {/* DialogConfirmDelete */}

            {/* ALERT MSG */}

            {/* EDIT MODAL */}

            {/* CREATE MODAL */}


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
                        // onClick={() => handleOpenCreateModal()}
                        // disabled={deleteLoading}
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
                            // rows={rows}
                            // columns={columns}
                            // initialState={{ pagination: { paginationModel } }}
                            // pageSizeOptions={[paginationModel.pageSize]}
                            // loading={loading}
                            virtualizeColumnsWithAutoRowHeight
                        />
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}