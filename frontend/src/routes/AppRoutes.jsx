import { Box } from '@mui/material';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';

import Footer from '../components/layout/Footer';
import Navbar from '../components/layout/Navbar';
import AnalyticsPage from '../pages/AnalyticsPage';
import DashboardPage from '../pages/DashBoardPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import TaskFormPage from '../pages/TaskFormPage';
import TasksPage from '../pages/TasksPage';

function ApplicationLayout({ darkMode, setDarkMode, onLogout }) {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
      }}
    >
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onLogout={onLogout}
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minWidth: 0,
          minHeight: '100vh',
          overflowX: 'hidden',
        }}
      >
        <Box sx={{ flex: 1, width: '100%' }}>
          <Outlet />
        </Box>
        <Footer />
      </Box>
    </Box>
  );
}

export default function AppRoutes({
  tasks,
  onAddTask,
  onDeleteTask,
  isAuthenticated,
  onLogin,
  onLogout,
  darkMode,
  setDarkMode,
}) {
  const publicPage = (page) =>
    isAuthenticated ? <Navigate to="/dashboard" replace /> : page;

  const protectedPage = isAuthenticated
    ? (
      <ApplicationLayout
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onLogout={onLogout}
      />
    )
    : <Navigate to="/login" replace />;

  return (
    <Routes>
      <Route
        path="/login"
        element={publicPage(<LoginPage onLogin={onLogin} />)}
      />
      <Route
        path="/register"
        element={publicPage(<RegisterPage />)}
      />

      <Route element={protectedPage}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage tasks={tasks} />} />
        <Route
          path="/tasks"
          element={<TasksPage tasks={tasks} onDelete={onDeleteTask} />}
        />
        <Route
          path="/tasks/new"
          element={<TaskFormPage onAdd={onAddTask} />}
        />
        <Route path="/tasks/edit/:id" element={<TaskFormPage tasks={tasks} />} />
        <Route path="/analytics" element={<AnalyticsPage tasks={tasks} />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
