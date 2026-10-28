
import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { ArrowLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const categories = [
  "Development",
  "Design",
  "Planning",
  "Marketing",
  "Personal",
  "Other",
];

const taskTypes = [
  "Task",
  "Feature",
  "Bug",
  "Improvement",
  "Research",
];

const priorities = ["Low", "Medium", "High", "Critical"];

const todayString = () => {
  const date = new Date();

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

// Compact styling for text fields
const inputSx = (darkMode) => ({
  "& .MuiOutlinedInput-root": {
    minHeight: 36,
    backgroundColor: darkMode ? "#101d17" : "#FAFCFA",
    borderRadius: "5px",
    color: darkMode ? "#e5e7ef" : "#353535",
    fontSize: 12,
    "& fieldset": {
      borderColor: darkMode ? "#344b3d" : "#d8e4da",
    },
    "&:hover fieldset": {
      borderColor: darkMode ? "#16835d" : "#91b49b",
    },
    "&.Mui-focused": {
      backgroundColor: darkMode ? "#12251a" : "#f4faf5",
    },
    "&.Mui-focused fieldset": {
      borderColor: darkMode ? "#34d399" : "#0f9f6e",
      borderWidth: 1,
    },
  },
  "& .MuiOutlinedInput-input": {
    padding: "8px 10px",
    "&::placeholder": {
      color: darkMode ? "#7e899e" : "#AAA18F",
      opacity: 1,
    },
  },
  "& .MuiInputBase-inputMultiline": {
    padding: 0,
    lineHeight: 1.5,
  },
  "& .MuiOutlinedInput-root.MuiInputBase-multiline": {
    padding: "8px 10px",
  },
  "& input[type='date']::-webkit-calendar-picker-indicator": {
    filter: darkMode ? "invert(1)" : "none",
  },
});

// Compact styling for dropdowns
const selectSx = (darkMode) => ({
  "& .MuiOutlinedInput-root": {
    minHeight: 36,
    backgroundColor: darkMode ? "#101d17" : "#FAFCFA",
    borderRadius: "5px",
    color: darkMode ? "#e5e7ef" : "#353535",
    fontSize: 12,
    "& fieldset": {
      borderColor: darkMode ? "#344b3d" : "#d8e4da",
    },
    "&:hover fieldset": {
      borderColor: darkMode ? "#16835d" : "#91b49b",
    },
    "&.Mui-focused fieldset": {
      borderColor: darkMode ? "#34d399" : "#0f9f6e",
      borderWidth: 1,
    },
  },
  "& .MuiSelect-select": {
    padding: "8px 10px",
  },
  "& .MuiSelect-icon": {
    color: darkMode ? "#9ca6b9" : "#77705F",
  },
});

// Shared layout styles
const sectionSx = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
  mb: 2.5,
  pb: 2.5,
};

const twoColumnSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "minmax(0, 1fr)",
    sm: "repeat(2, minmax(0, 1fr))",
  },
  gap: { xs: 1.8, sm: 2.5 },
  alignItems: "start",
};

export default function TaskFormPage({ onAdd }) {
  const navigate = useNavigate();
  const darkMode = useTheme().palette.mode === "dark";
  const today = todayString();

  const [form, setForm] = useState({
    title: "",
    taskType: "Task",
    category: "Development",
    project: "",
    description: "",
    assignee: "",
    priority: "Medium",
    estimatedHours: "",
    startDate: today,
    dueDate: "",
    tags: "",
    acceptanceCriteria: "",
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("Please enter a task name.");
      return;
    }

    if (form.startDate && form.startDate < today) {
      setError("The start date cannot be in the past.");
      return;
    }

    if (form.dueDate && form.dueDate < today) {
      setError("The due date must be today or a future date.");
      return;
    }

    if (
      form.startDate &&
      form.dueDate &&
      form.dueDate < form.startDate
    ) {
      setError("The due date cannot be earlier than the start date.");
      return;
    }

    if (
      form.estimatedHours !== "" &&
      (!Number.isFinite(Number(form.estimatedHours)) ||
        Number(form.estimatedHours) <= 0)
    ) {
      setError("Estimated effort must be greater than zero.");
      return;
    }

    if (typeof onAdd !== "function") {
      setError("Task creation is unavailable. Check your app setup.");
      return;
    }

    const taskData = {
      title: form.title.trim(),
      desc: form.description.trim(),
      description: form.description.trim(),
      taskType: form.taskType,
      category: form.category,
      project: form.project.trim(),
      assignee: form.assignee.trim(),
      priority: form.priority,
      estimatedHours:
        form.estimatedHours === ""
          ? null
          : Number(form.estimatedHours),
      startDate: form.startDate,
      dueDate: form.dueDate,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      acceptanceCriteria: form.acceptanceCriteria.trim(),
      status: "Pending",
    };

    setSaving(true);
    setError("");

    try {
      await onAdd(taskData);
      navigate("/tasks");
    } catch (saveError) {
      setError(
        saveError?.message ||
          "Unable to create the task. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // Reusable text input
  const renderInput = ({
    id,
    label,
    field,
    placeholder = "",
    type = "text",
    optional = false,
    multiline = false,
    rows = 2,
    helperText = "",
    inputProps = {},
  }) => (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      <Typography
        component="label"
        htmlFor={id}
        sx={{
          display: "block",
          mb: 0.7,
          color: darkMode ? "#d6dbe6" : "#555555",
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        {label}

        {!optional && (
          <Box component="span" sx={{ color: "#C75B4B" }}>
            {" "}*
          </Box>
        )}

        {optional && (
          <Box
            component="span"
            sx={{
              ml: 0.5,
              color: darkMode ? "#9aa4b7" : "#999999",
              fontSize: 10,
              fontWeight: 400,
            }}
          >
            (Optional)
          </Box>
        )}
      </Typography>

      <TextField
        id={id}
        name={field}
        fullWidth
        size="small"
        type={type}
        multiline={multiline}
        minRows={multiline ? rows : undefined}
        placeholder={placeholder}
        value={form[field]}
        onChange={(event) =>
          updateField(field, event.target.value)
        }
        sx={inputSx(darkMode)}
        inputProps={inputProps}
      />

      {helperText && (
        <Typography
          sx={{
            mt: 0.5,
            color: darkMode ? "#9aa4b7" : "#969086",
            fontSize: 10,
          }}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  );

  // Reusable dropdown
  const renderSelect = (id, label, field, options) => (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      <Typography
        component="label"
        htmlFor={id}
        sx={{
          display: "block",
          mb: 0.7,
          color: darkMode ? "#d6dbe6" : "#555555",
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        {label}
        <Box component="span" sx={{ color: "#C75B4B" }}>
          {" "}*
        </Box>
      </Typography>

      <FormControl fullWidth size="small" sx={selectSx(darkMode)}>
        <Select
          id={id}
          name={field}
          value={form[field]}
          onChange={(event) =>
            updateField(field, event.target.value)
          }
          inputProps={{ "aria-label": label }}
        >
          {options.map((option) => (
            <MenuItem
              key={option}
              value={option}
              sx={{ fontSize: 12 }}
            >
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: darkMode ? "#07110d" : "#FFFFFF",
        color: darkMode ? "#e5eee8" : "#292929",
        boxSizing: "border-box",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, md: 3 },
        "& *, & *::before, & *::after": {
          boxSizing: "border-box",
        },
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 1100, mx: "auto" }}>
        {/* Back navigation */}
        <Button
          startIcon={<ArrowLeft size={16} />}
          onClick={() => navigate("/tasks")}
          sx={{
            mb: 2,
            ml: -1,
            px: 1.2,
            py: 0.6,
            color: darkMode ? "#b0b7c6" : "#777777",
            textTransform: "none",
            fontSize: 12,
            borderRadius: "5px",
            "&:hover": {
              backgroundColor: darkMode ? "#1c2740" : "#F6F3ED",
              color: darkMode ? "#6ee7b7" : "#292929",
            },
          }}
        >
          Back to tasks
        </Button>

        {/* Page heading */}
        <Box sx={{ mb: 3, textAlign: "center" }}>
          <Typography
            component="h1"
            sx={{
              color: darkMode ? "#f0f1f6" : "#292929",
              fontSize: { xs: 22, sm: 26, md: 29 },
              fontWeight: 600,
              letterSpacing: -0.8,
              lineHeight: 1.3,
              mb: 0.6,
            }}
          >
            Create New Task
          </Typography>

          <Typography
            sx={{
              maxWidth: 560,
              mx: "auto",
              color: darkMode ? "#a1a9ba" : "#838383",
              fontSize: 12,
              lineHeight: 1.6,
            }}
          >
            Add the details below to organize your next piece of work.
          </Typography>
        </Box>

        {/* Main form */}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          {error && (
            <Alert
              severity="error"
              onClose={() => setError("")}
              sx={{
                mb: 2,
                borderRadius: "5px",
                fontSize: 12,
              }}
            >
              {error}
            </Alert>
          )}

          <Box sx={sectionSx}>
            {/* Row 1: Task Name | Task Type */}
            <Box sx={twoColumnSx}>
              {renderInput({
                id: "task-title",
                label: "Task Name",
                field: "title",
                placeholder: "Enter task name",
                inputProps: { maxLength: 100 },
              })}

              {renderSelect(
                "task-type",
                "Task Type",
                "taskType",
                taskTypes
              )}
            </Box>

            {/* Row 2: Category | Project */}
            <Box sx={twoColumnSx}>
              {renderSelect(
                "task-category",
                "Category",
                "category",
                categories
              )}

              {renderInput({
                id: "task-project",
                label: "Project",
                field: "project",
                placeholder: "Enter project name",
                optional: true,
                inputProps: { maxLength: 100 },
              })}
            </Box>

            {/* Row 3: Description */}
            {renderInput({
              id: "task-description",
              label: "Description",
              field: "description",
              placeholder: "Describe the task and expected outcome",
              optional: true,
              multiline: true,
              rows: 2,
              inputProps: { maxLength: 500 },
            })}

            {/* Row 4: Assigned To | Priority */}
            <Box sx={twoColumnSx}>
              {renderInput({
                id: "task-assignee",
                label: "Assigned To",
                field: "assignee",
                placeholder: "Enter team member name",
                optional: true,
                inputProps: { maxLength: 100 },
              })}

              {renderSelect(
                "task-priority",
                "Priority",
                "priority",
                priorities
              )}
            </Box>

            {/* Row 5: Estimated Effort | Start Date */}
            <Box sx={twoColumnSx}>
              {renderInput({
                id: "estimated-hours",
                label: "Estimated Effort (Hours)",
                field: "estimatedHours",
                placeholder: "e.g. 4",
                type: "number",
                optional: true,
                inputProps: {
                  min: 0.25,
                  step: 0.25,
                },
              })}

              {renderInput({
                id: "start-date",
                label: "Start Date",
                field: "startDate",
                type: "date",
                inputProps: {
                  min: today,
                  max: form.dueDate || undefined,
                },
              })}
            </Box>

            {/* Row 6: Due Date | Tags */}
            <Box sx={twoColumnSx}>
              {renderInput({
                id: "due-date",
                label: "Due Date",
                field: "dueDate",
                type: "date",
                optional: true,
                inputProps: {
                  min: form.startDate || today,
                },
              })}

              {renderInput({
                id: "task-tags",
                label: "Tags",
                field: "tags",
                placeholder: "Frontend, API, Testing",
                optional: true,
                inputProps: { maxLength: 250 },
              })}
            </Box>

            {/* Row 7: Acceptance Criteria */}
            {renderInput({
              id: "acceptance-criteria",
              label: "Acceptance Criteria",
              field: "acceptanceCriteria",
              placeholder:
                "Describe what must be completed for this task to be considered done...",
              optional: true,
              multiline: true,
              rows: 2,
              inputProps: { maxLength: 1000 },
            })}
          </Box>

          {/* Footer actions */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "stretch", sm: "center" },
              pt: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
                order: { xs: 1, sm: 2 },
              }}
            >
              <Button
                type="button"
                disabled={saving}
                onClick={() => navigate("/tasks")}
                sx={{
                  minHeight: 25,
                  px: 2.2,
                  color: darkMode ? "#c4cad6" : "#555555",
                  backgroundColor: darkMode ? "#101d17" : "#FFFFFF",
                  border: `1px solid ${darkMode ? "#3a455b" : "#DED8CC"}`,
                  borderRadius: "5px",
                  textTransform: "none",
                  fontSize: 12,
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: darkMode ? "#1c2436" : "#F8F6F1",
                    borderColor: darkMode ? "#66599e" : "#C7BBA5",
                  },
                }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={saving}
                startIcon={<Plus size={5} />}
                sx={{
                  minHeight: 25,
                  px: 1,
                  color: "#FFFFFF",
                  backgroundColor: "#0f9f6e",
                  border: "1px solid #0f9f6e",
                  borderRadius: "5px",
                  textTransform: "none",
                  fontSize: 12,
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: darkMode ? "#8068ee" : "#514633",
                    borderColor: darkMode ? "#8068ee" : "#514633",
                  },
                  "&.Mui-disabled": {
                    color: "#FFFFFF",
                    backgroundColor: "#A5A098",
                  },
                }}
              >
                {saving ? "Creating..." : "Create Task"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
