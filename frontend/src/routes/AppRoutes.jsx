
import { Routes, Route } from 'react-router-dom';

import LandingPage from '../pages/LandingPage';
import DashboardPage from '../pages/DashBoardPage';
import TasksPage from '../pages/TasksPage';
import TaskFormPage from '../pages/TaskFormPage';
import AnalyticsPage from '../pages/AnalyticsPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

export default function AppRoutes({
  tasks,
  onAddTask,
  onDeleteTask,
}) {
  return (
    <Routes>
      {/* Landing page */}
      <Route
        path="/"
        element={<LandingPage />}
      />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={<DashboardPage tasks={tasks} />}
      />

      {/* Task list */}
      <Route
        path="/tasks"
        element={
          <TasksPage
            tasks={tasks}
            onDelete={onDeleteTask}
          />
        }
      />

      {/* Add new task */}
      <Route
        path="/tasks/new"
        element={
          <TaskFormPage
            onAdd={onAddTask}
          />
        }
      />

      {/* Edit existing task */}
      <Route
        path="/tasks/edit/:id"
        element={
          <TaskFormPage
            tasks={tasks}
          />
        }
      />

      {/* Analytics */}
      <Route
        path="/analytics"
        element={<AnalyticsPage tasks={tasks} />}
      />

      {/* Authentication pages */}
      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/register"
        element={<RegisterPage />}
      />
    </Routes>
  );
}
