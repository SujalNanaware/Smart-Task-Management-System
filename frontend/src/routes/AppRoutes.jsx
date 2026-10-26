
import { Box } from '@mui/material';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';

import Footer from '../components/layout/Footer';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';

import AnalyticsPage from '../pages/AnalyticsPage';
import DashboardPage from '../pages/DashBoardPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import TaskFormPage from '../pages/TaskFormPage';
import TasksPage from '../pages/TasksPage';

function ApplicationLayout({
  darkMode,
  setDarkMode,
  username,
  onLogout,
  language,
  setLanguage,
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
      }}
    >
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        username={username}
        onLogout={onLogout}
        language={language}
        setLanguage={setLanguage}
      />

      <Sidebar darkMode={darkMode} />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          ml: '64px',
          overflowX: 'hidden',
        }}
      >
        <Box sx={{ flex: 1, width: '100%' }}>
          <Outlet />
        </Box>

        <Footer darkMode={darkMode} />
      </Box>
    </Box>
  );
}

export default function AppRoutes({
  tasks,
  onAddTask,
  onDeleteTask,
  isAuthenticated,
  username,
  onLogin,
  onRegister,
  onLogout,
  darkMode,
  setDarkMode,
  language,
  setLanguage,
}) {
  const publicPage = (page) =>
    isAuthenticated
      ? <Navigate to="/dashboard" replace />
      : page;

  const protectedPage = isAuthenticated ? (
    <ApplicationLayout
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      username={username}
      onLogout={onLogout}
      language={language}
      setLanguage={setLanguage}
    />
  ) : (
    <Navigate to="/login" replace />
  );

  return (
    <Box
      className={`app-theme-root${darkMode ? ' app-theme-dark' : ''}`}
      sx={{ minHeight: '100vh', width: '100%' }}
    >
      <Routes>
        <Route
          path="/login"
          element={publicPage(
            <LoginPage
              onLogin={onLogin}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          )}
        />

        <Route
          path="/register"
          element={publicPage(
            <RegisterPage
              onRegister={onRegister}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          )}
        />

        <Route element={protectedPage}>
          <Route
            index
            element={<Navigate to="/dashboard" replace />}
          />

          <Route
            path="/dashboard"
            element={<DashboardPage tasks={tasks} />}
          />

          <Route
            path="/tasks"
            element={
              <TasksPage
                tasks={tasks}
                onDelete={onDeleteTask}
              />
            }
          />

          <Route
            path="/tasks/new"
            element={<TaskFormPage onAdd={onAddTask} />}
          />

          <Route
            path="/tasks/edit/:id"
            element={<TaskFormPage tasks={tasks} />}
          />

          <Route
            path="/analytics"
            element={<AnalyticsPage tasks={tasks} />}
          />

          <Route
            path="*"
            element={<Navigate to="/dashboard" replace />}
          />
        </Route>
      </Routes>
    </Box>
  );
}
