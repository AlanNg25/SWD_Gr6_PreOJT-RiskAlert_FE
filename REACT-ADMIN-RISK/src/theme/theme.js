import { createTheme } from '@mui/material'
import { createContext, useMemo, useState } from 'react';

// CUSTOM COLORS
export const tokens = (mode) => ({
    ...(mode == 'dark' ?
        {
            // DARK COLORS  
            primary: {
                100: "#cdcfd5",
                200: "#9c9faa",
                300: "#6a6f80",
                400: "#393f55",
                500: "#070f2b",
                600: "#060c22",
                700: "#04091a",
                800: "#030611",
                900: "#010309"
            },
            secondary: {
                100: "#d1d1dd",
                200: "#a4a3bb",
                300: "#767699",
                400: "#494877",
                500: "#1b1a55",
                600: "#161544",
                700: "#101033",
                800: "#0b0a22",
                900: "#050511"
            },
            greyAccent: {
                100: "#dddee9",
                200: "#babed3",
                300: "#989dbd",
                400: "#757da7",
                500: "#535c91",
                600: "#424a74",
                700: "#323757",
                800: "#21253a",
                900: "#11121d"
            },
            purpleAccent: {
                100: "#e9e9f3",
                200: "#d3d3e7",
                300: "#bebcdb",
                400: "#a8a6cf",
                500: "#9290c3",
                600: "#75739c",
                700: "#585675",
                800: "#3a3a4e",
                900: "#1d1d27"
            },
        } : { // LIGHT COLORS
            primary: {
                100: "#010309",
                200: "#030611",
                300: "#04091a",
                400: "#060c22",
                500: "#070f2b",
                600: "#393f55",
                700: "#6a6f80",
                800: "#9c9faa",
                900: "#cdcfd5",
            },
            secondary: {
                100: "#050511",
                200: "#0b0a22",
                300: "#101033",
                400: "#161544",
                500: "#1b1a55",
                600: "#494877",
                700: "#767699",
                800: "#a4a3bb",
                900: "#d1d1dd",
            },
            greyAccent: {
                100: "#11121d",
                200: "#21253a",
                300: "#323757",
                400: "#424a74",
                500: "#535c91",
                600: "#757da7",
                700: "#989dbd",
                800: "#babed3",
                900: "#dddee9",
            },
            purpleAccent: {
                100: "#1d1d27",
                200: "#3a3a4e",
                300: "#585675",
                400: "#75739c",
                500: "#9290c3",
                600: "#a8a6cf",
                700: "#bebcdb",
                800: "#d3d3e7",
                900: "#e9e9f3",
            },
        })
});

export const themeSettings = (mode) => {
    const colors = tokens(mode);
    return {
        palette: {
            mode: mode,
            ...(mode == 'dark'
                ? {
                    primary: {
                        main: colors.primary[400]
                    },
                    secondary: {
                        main: colors.secondary[500]
                    },
                    background: {
                        default: colors.greyAccent[900]
                    }
                }
                : {
                    primary: {
                        main: colors.primary[400]
                    },
                    secondary: {
                        main: colors.secondary[500]
                    },
                    background: {
                        default: colors.purpleAccent[900]
                    }
                }
            )
        },
        typography: {
            fontFamily: ["Roboto", "Arial", "sans-serif"].join(','),
            fontSize: 12,
            h1: {
                fontFamily: ["Roboto", "Arial", "sans-serif"].join(','),
                fontSize: 45,
            },
            h2: {
                fontFamily: ["Roboto", "Arial", "sans-serif"].join(','),
                fontSize: 35,
            },
            h3: {
                fontFamily: ["Roboto", "Arial", "sans-serif"].join(','),
                fontSize: 25,
            },
            h4: {
                fontFamily: ["Roboto", "Arial", "sans-serif"].join(','),
                fontSize: 20,
            },
            h5: {
                fontFamily: ["Roboto", "Arial", "sans-serif"].join(','),
                fontSize: 16,
            },
            h6: {
                fontFamily: ["Roboto", "Arial", "sans-serif"].join(','),
                fontSize: 14,
            },
        }
    }
}

export const ColorModeContext = createContext({
    toggleColorMode: () => { }
});

export const useMode = () => {
    const [mode, setMode] = useState('dark');

    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => setMode((prev) => (prev == 'dark' ? 'light' : 'dark'))
        })
        , []);

    return [theme, colorMode]
}