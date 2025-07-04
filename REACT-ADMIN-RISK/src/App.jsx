import { CssBaseline, ThemeProvider } from '@mui/material'
import { ColorModeContext, useMode } from "./theme/theme";
import { Route, Routes } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';

import DashBoard from './screens/Dashboard';
import People from './screens/People';
import Login from './screens/Login';
import ProtectedRoute from './utils/ProtectedRoute';
import Logout from './screens/Logout';
// import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext value={colorMode}>
      <ThemeProvider theme={theme} >
        <CssBaseline />
        <Routes>
          {/* PUBLIC PAGE */}
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />

          <Route element={<ProtectedRoute />} >
            <Route path="/" element={<MainLayout> <DashBoard /> </MainLayout>} />
            <Route path="/people" element={<MainLayout> <People /> </MainLayout>} />
          </Route>

        </Routes>
      </ThemeProvider>
    </ColorModeContext>
  )
}

export default App
