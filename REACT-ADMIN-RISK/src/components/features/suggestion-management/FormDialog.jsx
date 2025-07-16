import { useTheme } from "@emotion/react";
import { tokens } from "../../../theme/theme";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, Switch, TextField, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import AlertNotify from "../../global/AlertNotify";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

export const FormDiaglog = ({
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

    const [alert, setAlert] = useState({ message: '', severity: 'info' });
    const [formData, setFormData] = useState(initialData || {});

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                riskID: formData.riskID,
                advisorID: formData.advisorID,
                actionType: formData.actionType,
                actionDate: new Date(formData.actionDate).toISOString(),
                notes: formData.notes,
            };

            await onSave(data);
            setAlert({ message: "Prediction saved successfully", severity: "success" });
            onClose();
        } catch (error) {
            setAlert({
                message: error.message || "Fail to save prediction",
                severity: "error",
            });
        }
    };
    const handleCancel = () => {
        onSave(null);
        onClose();
    };
    const handleDateChange = (newValue) => {
        setFormData(prev => ({
            ...prev,
            actionDate: newValue ? newValue.toISOString() : null
        }));
    };


    useEffect(() => {
        setFormData(initialData || {});
    }, [initialData]);

    return (
        <Dialog
            fullScreen={fullScreen}
            open={openState}
            onClose={handleCancel}
            aria-labelledby="responsive-dialog-title"
        >
            {/* alert  message */}
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
                    <Stack
                        direction={{ xs: 'column', sm: 'column' }}
                        spacing={2}
                        sx={{ width: '100%' }}
                        alignItems={'flex-start'}
                    >
                        <Typography variant="body1">
                            <strong>Details:</strong> {formData?.notes || 'N/A'}
                        </Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker label="Action Date"
                                    format="DD/MM/YYYY"
                                    value={dayjs(formData.actionDate)}
                                    onChange={handleDateChange}
                                />
                            </DemoContainer>
                        </LocalizationProvider>


                    </Stack>

                    <DialogActions>
                        <Button
                            onClick={handleCancel}
                            sx={{ color: colors.primary[100] }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={!formData?.actionDate}
                        >
                            Save
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    )
}

