
import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import AppRoutes from "./routes/AppRoutes";

export default function App() {
  const [darkMode, setDarkModeState] = useState(
    () => localStorage.getItem("taskflow-dark-mode") === "true"
  );

  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("taskflow-authenticated") === "true"
  );

  const [tasks, setTasks] = useState([]);

  const setDarkMode = (nextMode) => {
    setDarkModeState(nextMode);
    localStorage.setItem("taskflow-dark-mode", String(nextMode));
  };

  const handleLogin = () => {
    localStorage.setItem("taskflow-authenticated", "true");
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("taskflow-authenticated");
    setIsAuthenticated(false);
  };

  const handleAddTask = (newTask) => {
    setTasks((prevTasks) => [
      ...prevTasks,
      {
        ...newTask,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        status: "Pending",
      },
    ]);
  };

  const handleDeleteTask = (id) => {
    setTasks((prevTasks) =>
      prevTasks.filter((task) => task.id !== id)
    );
  };

  const theme = createTheme({
    cssVariables: true,

    palette: {
      mode: darkMode ? "dark" : "light",

      primary: {
        main: "#7054e8",
      },

      background: {
        default: darkMode ? "#0f172a" : "#f8fafc",
        paper: darkMode ? "#1e293b" : "#ffffff",
      },
    },

    shape: {
      borderRadius: 10,
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <BrowserRouter>
        <AppRoutes
          tasks={tasks}
          onAddTask={handleAddTask}
          onDeleteTask={handleDeleteTask}
          isAuthenticated={isAuthenticated}
          onLogin={handleLogin}
          onLogout={handleLogout}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      </BrowserRouter>
    </ThemeProvider>
  );
}
