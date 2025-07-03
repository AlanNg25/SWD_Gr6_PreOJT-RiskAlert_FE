import { Box, ButtonBase, Typography, useTheme } from '@mui/material'
// import { ImageGgUpdload } from '../../components/global/ImageGgUpdload';
import { tokens } from '../../theme/theme';

export default function DashBoard() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box
            m={'.5em'}
            display={'flex'}
            flexDirection={'column'}
        >
            {/* HEADER PAGE */}
            <Box display={'flex'} width={'100%'} justifyContent={'space-between'}>
                <Typography variant='h3' textTransform={'uppercase'} >
                    Dashboard Page
                </Typography>
                <Typography variant='h4' m={"auto 0"} color={colors.greyAccent[400]} >
                    Welcome to dashboard page
                </Typography>
            </Box>
            {/* OVER VIEW SECTION */}
            <Box
                mt={'1em'}
                display={'flex'}
                minHeight={'30vh'}
            >
                <Typography variant='h5' fontWeight={'bold'} >
                    Overview
                </Typography>
                <Box>

                </Box>
            </Box>
            {/* DETAIL SECTION */}
            <Box
                mt={'1em'}
                display={'flex'}
                minHeight={'30vh'}
            >
                <Typography variant='h5' fontWeight={'bold'} >
                    Detail
                </Typography>
                <Box>

                </Box>
            </Box>
        </Box>
    )
}
