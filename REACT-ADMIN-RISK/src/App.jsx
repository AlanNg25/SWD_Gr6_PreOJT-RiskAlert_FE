import { CssBaseline, ThemeProvider } from '@mui/material'
import { ColorModeContext, useMode } from "./theme/theme";
import { Route, Routes } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';

import ProtectedRoute from './utils/ProtectedRoute';
import DashBoard from './screens/Dashboard';
import People from './screens/People';
import Login from './screens/Login';
import Logout from './screens/Logout';
import Major from './screens/Major'
import Notify from './screens/Notify';
import Prediction from './screens/Prediction';
import Grade from './screens/Grade';
import Attendance from './screens/Attendance';
import RiskAnalysis from './screens/RiskAnalysis/';
import Suggestion from './screens/Suggestion';
import Course from './screens/Course';
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
            <Route path="/*" element={<MainLayout> <DashBoard /> </MainLayout>} />
            <Route path="/people" element={<MainLayout> <People /> </MainLayout>} />
            <Route path="/major" element={<MainLayout> <Major /> </MainLayout>} />
            <Route path="/notify" element={<MainLayout> <Notify /> </MainLayout>} />
            <Route path="/suggestion" element={<MainLayout> <Suggestion /> </MainLayout>} />
            <Route path="/prediction" element={<MainLayout> <Prediction /> </MainLayout>} />
            <Route path="/RiskAnalysis" element={<MainLayout> <RiskAnalysis /> </MainLayout>} />
            <Route path="/grade" element={<MainLayout> <Grade /> </MainLayout>} />
            <Route path="/attendance" element={<MainLayout> <Attendance /> </MainLayout>} />
            <Route path="/course" element={<MainLayout><Course /></MainLayout>} />
          </Route>

        </Routes>
      </ThemeProvider>
    </ColorModeContext>
  )
}

export default App
