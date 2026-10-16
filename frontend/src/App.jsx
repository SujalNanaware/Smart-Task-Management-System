import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box, ThemeProvider, createTheme } from '@mui/material';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashBoardPage';
import TasksPage from './pages/TasksPage';
import TaskFormPage from './pages/TaskFormPage';
import AnalyticsPage from './pages/AnalyticsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [tasks, setTasks] = useState([]); // Shared global tasks array

  const handleAddTask = (newTask) => {
    setTasks([...tasks, { ...newTask, id: Date.now(), status: 'Pending' }]);
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      background: {
        default: darkMode ? '#0f172a' : '#f8fafc',
        paper: darkMode ? '#1e293b' : '#ffffff',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
          <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
          <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: '100vh', overflowX: 'hidden' }}>
            <Box sx={{ flexGrow: 1 }}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<DashboardPage tasks={tasks} />} />
                <Route path="/tasks" element={<TasksPage tasks={tasks} onDelete={handleDeleteTask} />} />
                <Route path="/tasks/new" element={<TaskFormPage onAdd={handleAddTask} />} />
                <Route path="/tasks/edit/:id" element={<TaskFormPage tasks={tasks} />} />
                <Route path="/analytics" element={<AnalyticsPage tasks={tasks} />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Routes>
            </Box>
            <Footer />
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}