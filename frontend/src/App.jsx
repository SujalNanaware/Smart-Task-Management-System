
import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import AppRoutes from "./routes/AppRoutes";
import {
  AUTH_TOKEN_KEY,
  createTask,
  deleteTask,
  getCurrentUser,
  getTasks,
  login,
  logout,
  register,
} from "./api";

export default function App() {
  const [darkMode, setDarkModeState] = useState(
    () => localStorage.getItem("taskflow-dark-mode") === "true"
  );

  const [isAuthenticated, setIsAuthenticated] = useState(
    () => Boolean(localStorage.getItem(AUTH_TOKEN_KEY))
  );

  const [username, setUsername] = useState(
    () => localStorage.getItem("taskflow-username") || ""
  );

  // Language selection: English by default, or Hindi
  const [language, setLanguage] = useState(
    () => localStorage.getItem("taskflow-language") || "en"
  );

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return undefined;

    let active = true;
    Promise.all([getCurrentUser(token), getTasks(token)])
      .then(([result, userTasks]) => {
        if (!active) return;
        setUsername(result.user.name);
        localStorage.setItem("taskflow-username", result.user.name);
        setTasks(userTasks);
        setIsAuthenticated(true);
      })
      .catch((error) => {
        console.error("Unable to restore the TaskFlow session:", error);
        if (!active) return;
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem("taskflow-username");
        setUsername("");
        setTasks([]);
        setIsAuthenticated(false);
      });

    return () => {
      active = false;
    };
  }, []);

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
  const handleLogin = async (email, password) => {
    const result = await login(email, password);
    const userTasks = await getTasks(result.token);
    localStorage.setItem(AUTH_TOKEN_KEY, result.token);
    localStorage.setItem("taskflow-username", result.user.name);
    setTasks(userTasks);
    setUsername(result.user.name);
    setIsAuthenticated(true);
  };

  const handleRegister = async (name, email, password) => {
    await register(name, email, password);
  };

  const handleLogout = () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem("taskflow-username");
    setTasks([]);
    setUsername("");
    setIsAuthenticated(false);
    if (token) {
      logout(token).catch((error) => {
        console.error("Unable to revoke the TaskFlow session:", error);
      });
    }
  };

  const handleAddTask = async (newTask) => {
    const savedTask = await createTask(newTask);
    setTasks((prevTasks) => [savedTask, ...prevTasks]);
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id);
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
          onRegister={handleRegister}
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
