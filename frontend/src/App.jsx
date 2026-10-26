
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

  const [username, setUsername] = useState(
    () => localStorage.getItem("taskflow-username") || ""
  );

  // Language selection: English by default, or Hindi
  const [language, setLanguage] = useState(
    () => localStorage.getItem("taskflow-language") || "en"
  );

  const [tasks, setTasks] = useState([]);

  // Dark/light mode
  const setDarkMode = (nextMode) => {
    setDarkModeState(nextMode);
    localStorage.setItem("taskflow-dark-mode", String(nextMode));
  };

  // Language selection
  const handleLanguageChange = (nextLanguage) => {
    setLanguage(nextLanguage);
    localStorage.setItem("taskflow-language", nextLanguage);
  };

  // Login
  const handleLogin = (email) => {
    const emailName = email?.trim().split("@")[0] || "";

    const nextUsername =
      emailName
        .split(/[._-]+/)
        .filter(Boolean)
        .map(
          (part) =>
            part.charAt(0).toUpperCase() + part.slice(1)
        )
        .join(" ") || "there";

    localStorage.setItem("taskflow-authenticated", "true");
    localStorage.setItem("taskflow-username", nextUsername);

    setUsername(nextUsername);
    setIsAuthenticated(true);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("taskflow-authenticated");
    localStorage.removeItem("taskflow-username");

    setUsername("");
    setIsAuthenticated(false);
  };

  // Add task
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

  // Delete task
  const handleDeleteTask = (id) => {
    setTasks((prevTasks) =>
      prevTasks.filter((task) => task.id !== id)
    );
  };

  // MUI theme
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
          username={username}
          onLogin={handleLogin}
          onLogout={handleLogout}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          language={language}
          setLanguage={handleLanguageChange}
        />
      </BrowserRouter>
    </ThemeProvider>
  );
}
