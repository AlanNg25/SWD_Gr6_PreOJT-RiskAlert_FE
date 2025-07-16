import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, IconButton, Input, InputAdornment, InputLabel, MenuItem, OutlinedInput, Stack, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { tokens } from "../../../theme/theme";
import AlertNotify from "../../global/AlertNotify";

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

    const [formData, setFormData] = useState({
        majorCode: initialData?.majorCode || '',
        majorName: initialData?.majorName || ''
    });

    const [alert, setAlert] = useState({ message: '', severity: 'info' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        handleGenerateCode({ name, value });
    }

    const handleGenerateCode = ({ name, value }) => {
        if (name === "majorName") {
            // Map of example major names to codes
            const majorMap = {
                "Civil Engineering": "CE",
                "Physics": "PHY",
                "Mathematics": "MATH",
                "Biology": "BIO",
                "Computer Science": "CS",
                "Electrical Engineering": "EE",
                "Business Administration": "BA",
                "Mechanical Engineering": "ME",
                "English Literature": "ENG",
                "Chemistry": "CHEM"
            };
            // If the entered value matches a known major, set the code
            const code = majorMap[value.trim()];
            if (code) {
                setFormData((prev) => ({ ...prev, majorCode: code }));
            } else {
                // Otherwise, generate code from initials (up to 4 chars)
                const initials = value
                    .split(' ')
                    .map(word => word[0]?.toUpperCase() || '')
                    .join('')
                    .slice(0, 4);
                setFormData((prev) => ({ ...prev, majorCode: initials }));
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submitData = { ...formData };
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


    return (
        <Dialog
            fullScreen={fullScreen}
            open={openState}
            onClose={handleCancel}
            aria-labelledby="responsive-dialog-title"
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
            <DialogTitle
                id="responsive-dialog-title"
                sx={{ backgroundColor: colors.primary[900], color: colors.greyAccent[100] }}
            >
                <Typography fontWeight={'bold'} textTransform={'uppercase'}>
                    {formTitle}
                </Typography>
            </DialogTitle>
            <DialogContent
                sx={{
                    backgroundColor: colors.primary[900]
                }}
            >
                <DialogContentText sx={{ color: colors.greyAccent[100], marginBottom: '16px' }}>
                    {contentTXT}
                </DialogContentText>
                <form onSubmit={handleSubmit}>
                    <Stack direction="row" spacing={2}>
                        <TextField
                            label={'Major Code'}
                            value={formData.majorCode}
                            // onChange={handleGenerateCode}
                            id="majorCode"
                            name="majorCode"
                            variant="standard"
                            type="text"
                            disabled
                        />
                        <TextField
                            label={'Major Name'}
                            value={formData.majorName}
                            onChange={handleChange}
                            id="majorName"
                            name="majorName"
                            variant="standard"
                            type="text" fullWidth
                            error={!formData.majorName}
                            helperText={!formData.majorName ? 'Major name is required' : ''}
                        />
                    </Stack>

                    <DialogActions>
                        <Button onClick={handleCancel} sx={{ color: colors.primary[100] }}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={!formData.majorName}
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