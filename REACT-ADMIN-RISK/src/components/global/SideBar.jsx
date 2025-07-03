import { Sidebar, MenuItem, Menu } from 'react-pro-sidebar';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
    Avatar,
    Box,
    Button,
    ButtonBase,
    IconButton,
    Typography,
    useTheme,
} from '@mui/material';
import { tokens } from '../../theme/theme';
import { getFirstAvatarUrl, uploadImageWithProgress } from '../../services/firebase/ImageGgUpload';

import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';


const Item = ({ title, to, icon, selected, setSelected, collapsed }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();

    return (
        <MenuItem
            active={selected === title}
            style={{
                color: colors.greyAccent[100],
                backgroundColor: selected === title ? colors.purpleAccent[800] : 'transparent',
                height: '3em',
                borderRadius: !collapsed ? ".5em" : "3em",
            }}
            onClick={() => {
                setSelected(title);
                navigate(to);
            }}
            icon={icon}
        >
            {!collapsed && (
                <Typography variant='h5'>{title}</Typography>
            )}
        </MenuItem >
    );
};


const SideBar = () => {
    const userAuthen = localStorage.getItem("AUTHENTICATED_USER");
    const userData = JSON.parse(userAuthen);

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [collapsed, isCollapsed] = useState(false);
    const [avatarSrc, setAvatarSrc] = useState(undefined);
    const [selected, setSelected] = useState("Dashboard");


    const handleAvatarChange = async (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const uploadedUrl = await uploadImageWithProgress(file, userData.fullName, (progress) => {
                console.log(`Upload progress: ${progress}%`);
            });
            setAvatarSrc(uploadedUrl);
        }
    };

    useEffect(() => {
        const fetchAvatarUrl = async () => {
            try {
                const url = await getFirstAvatarUrl(userData.fullName);
                setAvatarSrc(url);
            } catch (error) {
                console.error('Error fetching avatar URL:', error);
            }
        };
        fetchAvatarUrl();
    }, []);

    return (
        <Box
            sx={{
                display: 'flex',
                '& .ps-sidebar-container, .ps-sidebar-root': {
                    background: colors.greyAccent[800],
                    borderRight: 'none !important',
                    borderRadius: 'none'
                },
                '& .ps-menu-button:hover': {
                    background: `${colors.primary[400]}!important`,
                    transition: 'background-color 0.5s ease',
                },
                '& .ps-menu-button': {
                    margin: collapsed ? "2% 1.4em" : "2%",
                    padding: collapsed ? "0 .25em !important" : ""
                }
            }}
        >
            <Sidebar collapsed={collapsed}
                width='240px'
                style={{ height: '100vh' }}>
                <Menu>
                    {/* TopSidebar */}
                    {collapsed && (
                        <MenuItem
                            icon={<MenuOutlinedIcon />}
                            onClick={() => isCollapsed((prev) => !prev)}
                            style={{
                                margin: '.5em 26% 10em 25%',
                                borderRadius: '3em',
                                height: '3em'
                            }}
                        />
                    )}

                    {!collapsed && (
                        <Box display="flex" flexDirection="column" alignItems="center"
                            justifyContent={"center"}
                            m={"1em 2%"}
                        >
                            <Button
                                variant="text"
                                onClick={() => isCollapsed((prev) => !prev)}
                                endIcon={<MenuOutlinedIcon />}
                                sx={{
                                    borderRadius: '.5em',
                                    width: '100%',
                                    color: colors.greyAccent[100],
                                    textTransform: 'none',
                                    gap: '0.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mb: 1,
                                    '&:hover': {
                                        background: `${colors.primary[400]}!important`,
                                    },
                                }}
                            >
                                <Typography variant="h4">Risk Alert</Typography>
                            </Button>

                            <ButtonBase
                                component="label"
                                role={undefined}
                                tabIndex={-1}
                                aria-label="Avatar image"
                                sx={{
                                    borderRadius: '50%',
                                    mt: 2,
                                    mb: 1,
                                    boxShadow: 2,
                                    overflow: 'hidden',
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: 120, height: 120,
                                    }}
                                    alt="Upload new avatar"
                                    src={avatarSrc}
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    style={{
                                        border: 0,
                                        clip: 'rect(0 0 0 0)',
                                        height: '1px',
                                        margin: '-1px',
                                        overflow: 'hidden',
                                        padding: 0,
                                        position: 'absolute',
                                        whiteSpace: 'nowrap',
                                        width: '1px',
                                    }}
                                    onChange={handleAvatarChange}
                                />
                            </ButtonBase>

                            <Box mt={1} mb={2} display="flex" flexDirection="column" alignItems="center">
                                <Typography variant="h3" fontWeight="bold" color={colors.greyAccent[100]}>
                                    Group 6
                                </Typography>
                                <Typography variant="h6" color={colors.purpleAccent[200]} sx={{ whiteSpace: 'pre-line' }} align='center' textOverflow={'revert'}>
                                    {"Welcome back\n" + userData.fullName}
                                </Typography>
                            </Box>
                        </Box>
                    )}


                    <Box>
                        <Item
                            title="Dashboard"
                            to="/"
                            icon={<HomeOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                            collapsed={collapsed}
                        />
                        <Item
                            title="People"
                            to="/people"
                            icon={<PeopleOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                            collapsed={collapsed}
                        />
                        <Item
                            title={"Login"}
                            to={"/login"}
                            icon={<LoginOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                            collapsed={collapsed}
                        />
                        <Item
                            title={"Logout"}
                            to={"/logout"}
                            icon={<LogoutOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                            collapsed={collapsed}
                        />
                    </Box>

                </Menu>
            </Sidebar>
        </Box >
    );
};

export default SideBar;
