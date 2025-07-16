import { Box, Paper, Typography, useTheme } from '@mui/material'
import { BarChart, PieChart, LineChart } from '@mui/x-charts';
import { tokens } from '../../theme/theme';
import LineChartCustom from '../../components/global/RiskAnalysisChart'
import { useRiskAnalysisWithUser } from '../../hooks/ManageRiskAnalysis';
import { Fragment } from 'react';

export default function DashBoard() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);


    const { riskAnalys } = useRiskAnalysisWithUser();


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
                flexDirection={'column'}
                minHeight={'30vh'}
            >
                <Typography variant='h5' fontWeight={'bold'} >
                    Overview
                </Typography>
                <Box>
                    <LineChartCustom riskAnalys={riskAnalys} />
                </Box>
            </Box>
        </Box>
    )
}


function CustomLine(props) {
    const { d, ownerState, className, ...other } = props;

    return (
        <Fragment>
            <path
                d={d}
                stroke={
                    ownerState.gradientId ? `url(#${ownerState.gradientId})` : ownerState.color
                }
                strokeWidth={ownerState.isHighlighted ? 4 : 2}
                strokeLinejoin="round"
                fill="none"
                filter={ownerState.isHighlighted ? 'brightness(120%)' : undefined}
                opacity={ownerState.isFaded ? 0.3 : 1}
                className={className}
            />
            <path d={d} stroke="transparent" strokeWidth={25} fill="none" {...other} />
        </Fragment>
    );
}