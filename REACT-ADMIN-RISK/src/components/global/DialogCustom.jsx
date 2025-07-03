import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery, useTheme } from "@mui/material"
import { tokens } from "../../theme/theme";


const DialogCustom = ({
    diaglogTitle,
    contentTXT,
    openState,
    onClose
}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleAnswer = (answer) => {
        onClose(answer) // Trả về 'yes' || 'no' || null
    };

    return (
        <Dialog
            fullScreen={fullScreen}
            open={openState}
            onClose={() => handleAnswer(null)}
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle
                id="responsive-dialog-title"
                sx={{
                    backgroundColor: colors.primary[600],
                    color: colors.greyAccent[100],
                }}
            >
                {diaglogTitle}
            </DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ color: colors.greyAccent[100] }}>
                    {contentTXT}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ backgroundColor: colors.primary[500] }}>
                <Button
                    autoFocus
                    onClick={() => handleAnswer('no')}
                    sx={{
                        color: 'red',
                        borderColor: 'red',
                        '&:hover': {
                            backgroundColor: 'grey',
                            color: colors.greyAccent[100],
                        }
                    }}
                    variant="outlined"
                >
                    No
                </Button>
                <Button
                    onClick={() => handleAnswer('yes')}
                    autoFocus
                    sx={{
                        color: colors.secondary[400],
                        borderColor: colors.secondary[400],
                        '&:hover': {
                            backgroundColor: colors.secondary[700],
                            color: colors.greyAccent[100],
                        }
                    }}
                    variant="outlined"
                >
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DialogCustom