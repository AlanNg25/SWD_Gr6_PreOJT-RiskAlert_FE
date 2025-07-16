import { useTheme } from "@emotion/react";
import { tokens } from "../../../theme/theme";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, styled, Switch, TextField, Typography, useMediaQuery } from "@mui/material";
import FireOutlinedIcon from '@mui/icons-material/LocalFireDepartmentOutlined';
// import { uploadFileWithProgress } from '../../../services/firebase/ImageGgUpload'
import { useEffect, useState } from "react";
import { deleteFile, uploadFileWithProgress } from "../../../services/firebase/ImageGgUpload";
import AlertNotify from "../../global/AlertNotify";

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
    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    const [alert, setAlert] = useState({ message: '', severity: 'info' });
    const [formData, setFormData] = useState(initialData || {});
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileUrl, setFileUrl] = useState(initialData?.attachment || "");
    const [uploadProgress, setUploadProgress] = useState(0);
    const [fileRef, setFileRef] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submitData = {
                ...formData,
                sentTime: new Date().toISOString(),
                fileRef, // Gửi fileRef để Notify.js có thể xóa file nếu cần
            };

            await onSave(submitData);
            setAlert({ message: "Notification saved successfully", severity: "success" });
            onClose();
        } catch (error) {
            setAlert({
                message: error.message || "Failed‌ساعة 11:29 م +07 يوم الثلاثاء، 15 يوليو 2025 to save notification",
                severity: "error",
            });
        }
    };
    const handleCancel = () => {
        // Nếu có fileRef và hủy, xóa file đã tải lên
        if (fileRef) {
            deleteFile(fileRef).catch((error) => {
                console.error("Failed to delete file on cancel:", error);
            });
        }
        onSave(null);
        onClose();
    };
    const handleChange = async (event) => {
        const { name, value, checked, type } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
        }));

    };
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            if (!formData.id) {
                setAlert({
                    message: "Notification ID is missing",
                    severity: "error",
                });
                return;
            }
            try {
                setSelectedFile(file);
                setUploadProgress(0); // Reset tiến trình tải lên
                console.log(selectedFile);
                const { downloadURL, fileRef } = await uploadFileWithProgress(
                    file,
                    "attachmentNoti",
                    formData.id,
                    (progress) => setUploadProgress(progress)
                );
                // console.log("Uploaded fileRef path:", fileRef.fullPath);
                setFileUrl(downloadURL);
                setFileRef(fileRef); // Lưu fileRef để sử dụng sau này
                setFormData((prev) => ({
                    ...prev,
                    fileName: file.name,
                    attachment: downloadURL, // Cập nhật attachment ngay khi tải lên
                }));
            } catch (error) {
                setAlert({
                    message: error.message || "Failed to upload file",
                    severity: "error",
                });
                setSelectedFile(null);
                setFileUrl(initialData?.attachment || "");
                setFileRef(null);
            }
        }
    };

    useEffect(() => {
        setFormData(initialData || {});
        setFileUrl(initialData?.attachment || '');
    }, [initialData]);

    useEffect(() => {
        uploadProgress.toFixed(2) == 100 && (
            setAlert({
                message: "File uploaded successfully",
                severity: "success",
            })
        )
    }, [uploadProgress])


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
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        sx={{ width: '100%' }}
                    >
                        <TextField
                            value={formData?.content || ''}
                            label={'Content'}
                            id="content"
                            name="content"
                            onChange={handleChange}
                            variant="outlined"
                            type="text"
                            required
                            error={!formData?.content || false}
                            helperText={!formData?.content && 'Fill the content notification'}
                        />
                        <Stack direction={'row'}
                            alignItems={'center'} >
                            <Typography
                                flex={1}
                                alignItems={'center'}
                            >
                                Status
                            </Typography>
                            <Switch
                                checked={formData?.status === 1}
                                id="status"
                                name="status"
                                onChange={handleChange}
                            />
                        </Stack>
                        <Button
                            component="label"
                            role={undefined}
                            variant="contained"
                            tabIndex={-1}
                            startIcon={<FireOutlinedIcon />}
                            sx={{ height: '4em' }}
                        >Upload files
                            <VisuallyHiddenInput
                                type="file"
                                onChange={handleFileChange}
                                multiple
                            />
                        </Button>
                    </Stack>
                    {uploadProgress > 0 && (
                        <Typography>Upload Progress: {uploadProgress.toFixed(2)}%</Typography>
                    )}
                    {fileUrl && (
                        <Typography>
                            Current File: <a href={fileUrl}>{formData?.fileName}</a>
                        </Typography>
                    )}

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
                            disabled={!formData?.content || uploadProgress.toFixed(2) != 100}
                        >
                            Save
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    )
}

