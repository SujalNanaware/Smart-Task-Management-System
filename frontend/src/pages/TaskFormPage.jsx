
import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Folder,
  Plus,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./TaskFormPage.css";

const categories = [
  "Development",
  "Design",
  "Planning",
  "Marketing",
  "Personal",
  "Other",
];

const priorities = [
  {
    value: "Low",
    label: "Low",
    description: "Whenever you have time",
    className: "low",
  },
  {
    value: "Medium",
    label: "Medium",
    description: "Important, but flexible",
    className: "medium",
  },
  {
    value: "High",
    label: "High",
    description: "Needs your focus soon",
    className: "high",
  },
];

function getLocalDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function TaskFormPage({ onAdd }) {
  const navigate = useNavigate();

  const [today] = useState(() => getLocalDateString(new Date()));
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Development");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("Add a task name before saving.");
      return;
    }

    if (dueDate && dueDate < today) {
      setError("Choose today or a future date for the deadline.");
      return;
    }

    if (typeof onAdd !== "function") {
      setError("Task creation is unavailable right now. Please try again.");
      return;
    }

    onAdd({
      title: trimmedTitle,
      desc: description.trim(),
      description: description.trim(),
      category,
      priority,
      dueDate,
      status: "Pending",
    });

    navigate("/tasks");
  };

  return (
    <Box className="task-form-page">
      <Box className="task-form-shell">
        <Button
          className="task-form-back"
          startIcon={<ArrowLeft size={16} />}
          onClick={() => navigate("/tasks")}
        >
          Back to tasks
        </Button>

        <Box className="task-form-heading">
          <span className="task-form-heading-icon">
            <Sparkles size={20} />
          </span>

          <Typography
            component="h1"
            className="task-form-title"
          >
            Create a new task
          </Typography>
        </Box>

        <Box className="task-form-layout">
          <Box
            component="form"
            className="task-form-card"
            onSubmit={handleSubmit}
            noValidate
          >
            {/* Task details */}
            <Box className="form-section">
              {error && (
                <Alert
                  className="task-form-error"
                  severity="error"
                  onClose={() => setError("")}
                >
                  {error}
                </Alert>
              )}

              <label className="task-field-label" htmlFor="task-title">
                Task name <span>*</span>
              </label>

              <TextField
                id="task-title"
                className="task-form-input task-title-input"
                fullWidth
                placeholder="e.g. Prepare the project presentation"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  setError("");
                }}
                inputProps={{ maxLength: 100 }}
              />

              <Box className="task-input-helper">
                <Typography>
                  Make it clear and action-oriented.
                </Typography>
                <Typography>{title.length}/100</Typography>
              </Box>

              <label
                className="task-field-label"
                htmlFor="task-description"
              >
                Description <span>Optional</span>
              </label>

              <TextField
                id="task-description"
                className="task-form-input task-description-input"
                fullWidth
                multiline
                minRows={4}
                maxRows={8}
                placeholder="Add context, notes, or what success looks like..."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                inputProps={{ maxLength: 500 }}
              />

              <Box className="task-input-helper">
                <Typography>
                  {description.length}/500
                </Typography>
              </Box>
            </Box>

            {/* Category and priority */}
            <Box className="form-section form-section-separated">
              <label
                className="task-field-label"
                htmlFor="task-category"
              >
                Category
              </label>

              <FormControl
                className="task-form-select"
                fullWidth
              >
                <Select
                  id="task-category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <Folder size={17} />
                    </InputAdornment>
                  }
                  inputProps={{ "aria-label": "Task category" }}
                >
                  {categories.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography className="task-field-label">
                Priority
              </Typography>

              <Box
                className="priority-options"
                role="group"
                aria-label="Task priority"
              >
                {priorities.map((item) => (
                  <button
                    className={`priority-option priority-${item.className}${
                      priority === item.value ? " is-selected" : ""
                    }`}
                    key={item.value}
                    type="button"
                    aria-pressed={priority === item.value}
                    onClick={() => setPriority(item.value)}
                  >
                    <span className="priority-option-top">
                      <span className="priority-dot" />
                      <span>{item.label}</span>
                      {priority === item.value && <Check size={15} />}
                    </span>

                    <span className="priority-description">
                      {item.description}
                    </span>
                  </button>
                ))}
              </Box>
            </Box>

            {/* Deadline */}
            <Box className="form-section form-section-separated">
              <label
                className="task-field-label"
                htmlFor="task-due-date"
              >
                Due date <span>Optional</span>
              </label>

              <TextField
                id="task-due-date"
                className="task-form-input task-date-input"
                type="date"
                fullWidth
                value={dueDate}
                onChange={(event) => {
                  setDueDate(event.target.value);
                  setError("");
                }}
                inputProps={{ min: today }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarDays size={17} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Actions */}
            <Box className="task-form-actions">
              <Button
                className="task-cancel-button"
                onClick={() => navigate("/tasks")}
              >
                Cancel
              </Button>

              <Button
                className="task-save-button"
                type="submit"
                startIcon={<Plus size={17} />}
                endIcon={<ArrowRight size={16} />}
              >
                Create task
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
