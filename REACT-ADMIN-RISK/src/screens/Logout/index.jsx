import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/api/apiClient';
import AlertNotify from '../../components/global/AlertNotify';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { tokens } from '../../theme/theme';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';

const AUTH_STORAGE = "AUTHENTICATED_USER"

function Logout() {
    const navigate = useNavigate();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchLogout = async () => {
        try {
            await apiClient("/api/Auth/logout", "POST");
        } catch (error) {
            throw new Error(error);
        }
    }

    useEffect(() => {
        try {
            setLoading(true)
            fetchLogout();
            localStorage.removeItem(AUTH_STORAGE);

            // Simulate a short delay before redirecting
            const timer = setTimeout(() => {
                navigate('/login');
                setLoading(false)
            }, 3000);

            return () => clearTimeout(timer);
        } catch (error) {
            setErrorMsg(error);
        }
    }, [navigate]);

    return (
        <Box
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            height={'100%'}
            bgcolor={theme.palette.background.paper}
        >
            {errorMsg && (
                <AlertNotify
                    severity="warning"
                    message={errorMsg}
                    onClose={() => setErrorMsg('')}
                />
            )}
            <Box
                width={300}
                height={400}
                bgcolor={colors.purpleAccent[700]}
                borderRadius={3}
                p={4}
                display={'flex'} flexDirection={'column'}
                alignContent={'center'}
                justifyContent={'flex-start'}
            >
                <Box display={'flex'} justifyContent={'center'} alignItems={'center'} flex={1} >
                    <ExitToAppOutlinedIcon sx={{ fontSize: 150 }} />
                </Box>

                <Box height={'40%'} alignContent={'center'}>
                    <Typography variant='h3' fontWeight='Bold' align='center' m={2}
                        color={colors.purpleAccent[100]}
                    >
                        You have been logged out</Typography>
                    <Button
                        color={colors.greyAccent[800]}
                        fullWidth
                        loading={loading}
                        loadingIndicator="Redirecting to login page..."
                    />
                </Box>

            </Box>
        </Box>

    );
}

export default Logout;