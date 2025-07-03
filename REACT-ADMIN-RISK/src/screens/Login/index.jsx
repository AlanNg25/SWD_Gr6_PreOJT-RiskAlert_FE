import { Alert, AlertTitle, Box, Button, Checkbox, Container, FormControlLabel, TextField, Typography, useTheme } from '@mui/material'
import { tokens } from '../../theme/theme';
import { useState } from 'react';
import AlertNotify from '../../components/global/AlertNotify';
import { apiClient } from '../../services/api/apiClient'
import { useNavigate } from 'react-router-dom';

function Login() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState('');
    const [warningMessage, setWarningMessage] = useState('');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        localStorage.clear();

        e.preventDefault();
        try {
            const emailInput = email;
            const passInput = password;
            const res = await apiClient("/api/Auth/login", "POST", {
                email: emailInput,
                password: passInput,
            });
            if (res && res.role == "Advisor") {
                localStorage.setItem("AUTHENTICATED_USER", JSON.stringify(res));
                navigate("/");
            } else {
                setWarningMessage("You don't have permission!")
            }
        } catch (error) {
            setErrorMessage(error.message || "An error occurred during login.");
        }
    };

    // const handleAuthSuccess = async (res) => {
    //     try {
    //         await saveAuthDataAsync(res);
    //         navigate("/");
    //     } catch (error) {
    //         console.error("Authentication storage error:", error);
    //         setErrorMessage("Failed to save authentication data. Please try again.");
    //     }
    // };

    // const saveAuthDataAsync = (userData) => {
    //     return new Promise((resolve, reject) => {
    //         try {
    //             localStorage.setItem("AUTHENTICATED_USER", userData);

    //             // Use setTimeout to ensure the operation completes
    //             setTimeout(() => {
    //                 const savedData = localStorage.getItem("AUTHENTICATED_USER");
    //                 if (savedData && savedData.token) {
    //                     resolve(true);
    //                 } else {
    //                     reject(new Error("Data verification failed"));
    //                 }
    //             }, 10); // Small delay to ensure write completion

    //         } catch (error) {
    //             reject(error);
    //         }
    //     });
    // };

    return (
        <Box sx={{
            height: '100vh',
            alignContent: 'center'
        }}>
            {errorMessage && (
                <AlertNotify
                    message={errorMessage}
                    severity="error"
                    onClose={() => setErrorMessage('')}
                />
            )}
            {warningMessage && (
                <AlertNotify
                    message={warningMessage}
                    severity="warning"
                    onClose={() => warningMessage('')}
                />
            )}
            <Container maxWidth="xs" sx={{
                height: 'full-content',
                padding: '7vh 0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                borderRadius: 2,
                boxShadow: `0 4px 24px ${colors.secondary[400]}`,
            }} >
                <Typography variant="h2" fontWeight={'Bold'} gutterBottom align='center'>
                    Welcome back
                </Typography>
                <Typography variant='h6' align='center' color={colors.greyAccent[100]}>
                    Login To Your Account
                </Typography>
                <form
                    onSubmit={handleLogin}
                >
                    <TextField
                        onChange={e => setEmail(e.target.value)}
                        label="Email"
                        variant="outlined" margin="normal"
                        fullWidth required />
                    <TextField
                        onChange={e => setPassword(e.target.value)}
                        label="Password" type="password"
                        variant="outlined" margin="normal"
                        fullWidth required />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Login
                    </Button>
                </form>
            </Container>
        </Box>
    )
}

export default Login