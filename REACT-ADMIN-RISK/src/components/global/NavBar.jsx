import { Box, Breadcrumbs, IconButton, Input, InputBase, useTheme } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'


import React, { useContext } from 'react'
import { ColorModeContext, } from '../../theme/theme';
import { Link } from 'react-router-dom';

const NavBar = ({ children }) => {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);

    return (
        <Box display={'flex'} justifyContent={'space-between'} m={'.2em'}>
            {/* BreadBrumb */}
            <Box display={'flex'} justifyContent={'center'}>
                {/* <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small" />}
                    aria-label="breadcrumb">
                </Breadcrumbs> */}
            </Box>
            {/* BUTTON BOX */}
            <Box display={'flex'} p={'0.5em'} >
                {/* CHILDREN ... */}
                {children}
                <IconButton onClick={() => colorMode.toggleColorMode()} >
                    {theme.palette.mode == 'dark'
                        ? <DarkModeOutlinedIcon />
                        : <LightModeOutlinedIcon />
                    }
                </IconButton>
                <IconButton >
                    <SettingsOutlinedIcon />
                </IconButton>
                <IconButton >
                    <PeopleOutlinedIcon />
                </IconButton>
            </Box>
        </Box>
    )
}

// const LinkRoute(props) => {
//     // return <Link {...props} to={ } />
// }

// const ListItemsLink(props) => {
//     const { to, open, ...other } = props;
// }

export default NavBar;
