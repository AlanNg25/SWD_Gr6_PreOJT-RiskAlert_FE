import { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, IconButton, Input, InputAdornment, InputLabel, MenuItem, OutlinedInput, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { tokens } from "../../../theme/theme";
import AlertNotify from "../../global/AlertNotify";
import { majorAPI } from "../../../services/api/majorAPI";
import { peopleApi } from "../../../services/api/peopleAPI";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const FormDialog = ({
    formTitle,
    contentTXT,
    openState,
    onSave,
    onClose,
    initialData = null,
}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const validRoles = ['Teacher', 'Advisor', 'Student'];
    const [formData, setFormData] = useState({
        fullName: initialData?.fullName || '',
        password: initialData?.password || '',
        email: initialData?.email || '',
        phone: initialData?.phone || '',
        majorID: initialData?.majorID || '',
        role: validRoles.includes(initialData?.role) ? initialData.role : '',
        code: initialData?.code || '',
        status: initialData?.status === 1 ? '1' : '0',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [majors, setMajors] = useState([]);
    const [users, setUsers] = useState([]);
    const [alert, setAlert] = useState({ message: '', severity: 'info' });

    // SHOW / UNSHOW PASSWORD 
    const handleClickShowPassword = () => setShowPassword(prev => !prev);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    // Fetch majors and roles for toggle
    useEffect(() => {
        const fetchMajors = async () => {
            try {
                const majorsData = await majorAPI.getAll();
                setMajors(majorsData);
            } catch (error) {
                setAlert({ message: 'Failed to load majors\n' + error, severity: 'error' });
            }
        };
        const fetchUsers = async () => {
            try {
                const usersData = await peopleApi.getAll();
                setUsers(usersData);
            } catch (error) {
                setAlert({ message: 'Failed to load users\n' + error, severity: 'error' });
            }
        }
        fetchMajors();
        fetchUsers();
    }, []);

    // Update formData when initialData changes
    useEffect(() => {
        setFormData({
            fullName: initialData?.fullName || '',
            password: initialData?.password || '',
            email: initialData?.email || '',
            phone: initialData?.phone || '',
            majorID: initialData?.majorID || '',
            role: validRoles.includes(initialData?.role) ? initialData.role : '',
            code: initialData?.code || '',
            status: initialData?.status === 1 ? '1' : '0',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialData]);

    // Generate code based on role
    useEffect(() => {
        // Only run if the role is changed from the initial value
        if (
            formData.role &&
            (!initialData?.role || formData.role.toLowerCase() !== initialData.role.toLowerCase())
        ) {
            let prefix = '';
            switch (formData.role) {
                case 'Teacher':
                    prefix = 'TCH';
                    break;
                case 'Advisor':
                    prefix = 'ADV';
                    break;
                case 'Student':
                    prefix = 'STU';
                    break;
                default:
                    prefix = '';
            }
            // Find the greatest code with the current prefix, then increment by 1
            const filteredUsers = users.filter(user => user.code && user.code.startsWith(prefix));
            let maxNumber = 0;
            filteredUsers.forEach(user => {
                const numPart = parseInt(user.code.replace(prefix, ''), 10);
                if (!isNaN(numPart) && numPart > maxNumber) {
                    maxNumber = numPart;
                }
            });
            const nextNumber = (maxNumber + 1).toString().padStart(4, '0');
            setFormData((prev) => ({ ...prev, code: `${prefix}${nextNumber}` }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.role]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submitData = { ...formData, status: parseInt(formData.status) };
            await onSave(submitData);
            setAlert({ message: 'User saved successfully', severity: 'success' });
            onClose();
        } catch (error) {
            setAlert({ message: error.message || 'Failed to save user', severity: 'error' });
        }
    };

    const handleCancel = () => {
        onSave(null);
        onClose();
    };

    const textFieldSx = {
        '& .MuiInputLabel-root': { color: colors.primary[200] },
        '& .MuiInput-root': { color: colors.primary[100] },
        '& .MuiInput-underline:before': { borderBottomColor: colors.primary[100] },
        '& .Mui-focused': { color: colors.greyAccent[400] },
        '& .MuiInput-root.Mui-focused': { color: colors.greyAccent[100] },
        '& .MuiInputLabel-root.Mui-focused': { color: colors.greyAccent[400] },
        '& .MuiInput-underline:after': { borderBottomColor: colors.greyAccent[400] },
        marginBottom: '16px',
    };

    return (
        <Dialog
            fullScreen={fullScreen}
            open={openState}
            onClose={handleCancel}
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle
                id="responsive-dialog-title"
                sx={{ backgroundColor: colors.primary[600], color: colors.greyAccent[100] }}
            >
                <Typography variant="h5" fontWeight={'bold'} textTransform={'uppercase'}>
                    {formTitle}
                </Typography>
            </DialogTitle>
            <DialogContent
                sx={{
                    backgroundColor: colors.primary[600]
                }}
            >
                {alert.message && (
                    <AlertNotify
                        message={alert.message}
                        severity={alert.severity}
                        autoHide={true}
                        autoHideDelay={3000}
                        onClose={() => setAlert({ message: '', severity: 'info' })}
                    />
                )}
                <DialogContentText sx={{ color: colors.greyAccent[100], marginBottom: '16px' }}>
                    {contentTXT}
                </DialogContentText>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/* Left Column */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                value={formData.fullName}
                                onChange={handleChange}
                                autoFocus
                                required
                                margin="dense"
                                id="fullName"
                                name="fullName"
                                label="Full Name"
                                type="text"
                                fullWidth
                                variant="standard"
                                sx={textFieldSx}
                                error={!formData.fullName}
                                helperText={!formData.fullName ? 'Full Name is required' : ''}
                            />
                            <TextField
                                value={formData.email}
                                onChange={handleChange}
                                required
                                margin="dense"
                                id="email"
                                name="email"
                                label="Email Address"
                                type="email"
                                fullWidth
                                variant="standard"
                                sx={textFieldSx}
                                error={!formData.email}
                                helperText={!formData.email ? 'Email is required' : ''}
                            />
                            {/* <TextField
                                value={formData.password}
                                onChange={handleChange}
                                required
                                margin="dense"
                                id="password"
                                name="password"
                                label="New Password"
                                type="password"
                                fullWidth
                                variant="standard"
                                sx={textFieldSx}
                                error={!formData.password}
                                helperText={!formData.password ? 'Password is required' : ''}
                            /> */}
                            <FormControl sx={{ m: '.5em auto 1em', width: '100%' }} variant="standard" required>
                                <InputLabel htmlFor="standard-adornment-password" >
                                    New Password
                                </InputLabel>
                                <Input
                                    id="standard-adornment-password password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    onChange={handleChange}
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
                                    required
                                    error={!formData.password}
                                    helperText={!formData.password ? 'Password is required' : ''}
                                />
                            </FormControl>
                            <TextField
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                margin="dense"
                                id="phone"
                                name="phone"
                                label="Phone Number"
                                type="tel"
                                fullWidth
                                variant="standard"
                                sx={textFieldSx}
                                error={!formData.phone}
                                helperText={!formData.phone ? 'Phone Number is required' : ''}
                            />
                            <TextField
                                select
                                value={formData.majorID}
                                onChange={handleChange}
                                required
                                margin="dense"
                                id="majorID"
                                name="majorID"
                                label="Major"
                                fullWidth
                                variant="standard"
                                sx={textFieldSx}
                                error={!formData.majorID}
                                helperText={!formData.majorID ? 'Major is required' : ''}
                            >
                                <MenuItem value="" disabled>
                                    Select major
                                </MenuItem>
                                {majors.map((major) => (
                                    <MenuItem key={major.majorID} value={major.majorID}>
                                        {major.majorName}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        {/* Right Column */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                select
                                value={formData.status}
                                onChange={handleChange}
                                required
                                margin="dense"
                                id="status"
                                name="status"
                                label="Status"
                                fullWidth
                                variant="standard"
                                sx={textFieldSx}
                                error={!formData.status}
                                helperText={!formData.status ? 'Status is required' : ''}
                            >
                                <MenuItem value="" disabled>
                                    Select status
                                </MenuItem>
                                <MenuItem value="1">Active</MenuItem>
                                <MenuItem value="0">Inactive</MenuItem>
                            </TextField>
                            <TextField
                                select
                                value={formData.role}
                                onChange={handleChange}
                                required
                                margin="dense"
                                id="role"
                                name="role"
                                label="Role"
                                fullWidth
                                variant="standard"
                                sx={textFieldSx}
                                error={!formData.role}
                                helperText={!formData.role ? 'Role is required' : ''}
                            >
                                <MenuItem value="" disabled>
                                    Select role
                                </MenuItem>
                                <MenuItem value="Teacher">Teacher</MenuItem>
                                <MenuItem value="Advisor">Advisor</MenuItem>
                                <MenuItem value="Student">Student</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>
                    <DialogActions>
                        <Button onClick={handleCancel} sx={{ color: colors.primary[100] }}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={!formData.fullName || !formData.email || !formData.phone || !formData.role || !formData.status || !formData.majorID || !formData.password}
                        >
                            Save
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default FormDialog;