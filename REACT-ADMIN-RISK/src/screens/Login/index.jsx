import { Box, Button, Checkbox, Container, FormControl, FormControlLabel, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography, useTheme } from '@mui/material'
import { tokens } from '../../theme/theme';
import { useEffect, useState } from 'react';
import AlertNotify from '../../components/global/AlertNotify';
import { apiClient } from '../../services/api/apiClient'
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { getValidUser } from '../../utils/auth';

const AUTH_STORAGE = "AUTHENTICATED_USER";

function Login() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const Logged = getValidUser(AUTH_STORAGE)

    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('');
    const [warningMessage, setWarningMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };

    const handleClickShowPassword = () => setShowPassword(prev => !prev);

    useEffect(() => {
        if (Logged != null) {
            navigate("/");
        }
    }, [Logged, navigate]);

    return (
        <Box
            sx={{
                height: '100vh',
                alignContent: 'center'
            }}
        >
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
            <Container
                maxWidth="xs"
                sx={{
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
                    onLoad={loading}
                    onSubmit={handleLogin}
                >
                    <TextField
                        disabled={loading}
                        onChange={e => setEmail(e.target.value)}
                        label="Email"
                        variant="outlined" margin="normal"
                        fullWidth required />
                    <FormControl sx={{ m: '.5em auto 1em', width: '100%' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                            onLoad={loading}
                            id="outlined-adornment-password"
                            type={showPassword ? 'text' : 'password'}
                            onChange={(e) => setPassword(e.currentTarget.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label={
                                            showPassword ? 'hide the password' : 'display the password'
                                        }
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        onMouseUp={handleMouseUpPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                        />
                    </FormControl>

                    <Button
                        loading={loading}
                        loadingPosition="start"
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