import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, AlertTitle, Box, Collapse } from '@mui/material';

const AlertNotify = ({
    message,
    severity = 'info',
    showTitle = true,
    onClose,
    autoHide = false,
    autoHideDelay = 3000,
    sx = {}
}) => {
    const [open, setOpen] = useState(!!message);

    // Auto-hide functionality
    useEffect(() => {
        if (message && autoHide) {
            const timer = setTimeout(() => {
                handleClose();
            }, autoHideDelay);
            return () => clearTimeout(timer);
        }
    }, [message, autoHide, autoHideDelay]);

    // Update open state when message changes
    useEffect(() => {
        setOpen(!!message);
    }, [message]);

    const handleClose = () => {
        setOpen(false);
        if (onClose) {
            setTimeout(onClose, 150); // Allow animation time
        }
    };

    if (!message) return null;

    const getTitle = () => {
        if (!showTitle) return null;
        const titles = {
            error: 'Error',
            warning: 'Warning',
            info: 'Info',
            success: 'Success'
        };
        return titles[severity] || 'Notification';
    };

    return (
        <Collapse in={open} style={{
            position: 'fixed',
            top: 16, left: 0,
            zIndex: 1300, width: '100%',
            display: 'flex',
            justifyContent: 'center',
            pointerEvents: 'auto'
        }}>
            <Box
                display={'flex'}
                justifyContent={'center'}
                sx={{ pointerEvents: 'auto' }}
            >
                <Alert
                    severity={severity}
                    onClose={onClose ? handleClose : undefined}
                    sx={{
                        mt: 2, mb: 1,
                        position: 'static',
                        pointerEvents: 'auto',
                        ...sx
                    }}
                >
                    {showTitle && <AlertTitle>{getTitle()}</AlertTitle>}
                    {message}
                </Alert>
            </Box>
        </Collapse>
    );
};

export default AlertNotify