import { useTheme } from "@emotion/react";
import { tokens } from "../../theme/theme";
import { useNavigate } from "react-router-dom";
import { MenuItem } from "react-pro-sidebar";
import { Badge, Box, Tooltip, Typography } from "@mui/material";

export const Item = ({ title, to, icon, badgeContentCount, maxBadge = 5, selected, setSelected, collapsed }) => {
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
            icon={badgeContentCount && !collapsed
                ? (icon)
                : (
                    <Badge
                        color='warning'
                        badgeContent={badgeContentCount}
                        max={maxBadge}
                        overlap="circular"
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}

                    >
                        <Tooltip title={title} arrow placement='right'>
                            {icon}
                        </Tooltip>
                    </Badge>
                )
            }
        >
            {!collapsed && (
                <Box
                    display={'flex'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    flexDirection={'row'}
                >
                    <Typography variant='h5'>{title}</Typography>
                    {badgeContentCount && (
                        <Badge
                            color='warning'
                            badgeContent={badgeContentCount}
                            max={maxBadge}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            sx={{
                                mr: 3
                            }}
                        />
                    )}
                </Box>
            )}
        </MenuItem >
    );
};