import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import {
  Plus,
  Search,
  Trash2,
  CalendarDays,
  CircleDashed,
  Clock3,
  CheckCircle2,
  ListTodo,
  ArrowUpDown,
  RotateCcw,
} from "lucide-react";

const BRAND_GREEN = "#0f9f6e";

const priorityStyles = {
  High: {
    color: "#dc2626",
    background: "#fee2e2",
  },
  Medium: {
    color: "#b45309",
    background: "#fef3c7",
  },
  Low: {
    color: "#087f5b",
    background: "#e7f5ec",
  },
};

const statusStyles = {
  Pending: {
    color: "#b45309",
    background: "#fef3c7",
  },
  "In Progress": {
    color: "#087f5b",
    background: "#e7f5ec",
  },
  Completed: {
    color: "#15803d",
    background: "#dcfce7",
  },
};

const categoryStyles = {
  Work: {
    color: "#087f5b",
    background: "#e7f5ec",
  },
  Personal: {
    color: "#0f9f6e",
    background: "#e2f5ee",
  },
  Learning: {
    color: "#15803d",
    background: "#dcfce7",
  },
  Health: {
    color: "#15803d",
    background: "#dcfce7",
  },
};

function getStatus(status) {
  if (status === "Completed") return "Completed";

  if (
    status === "In Progress" ||
    status === "In progress"
  ) {
    return "In Progress";
  }

  return "Pending";
}

function getProgress(task) {
  if (typeof task.progress === "number") {
    return Math.max(0, Math.min(100, task.progress));
  }

  switch (getStatus(task.status)) {
    case "Completed":
      return 100;
    case "In Progress":
      return 55;
    default:
      return 0;
  }
}

function formatDueDate(dateString) {
  if (!dateString) return "No deadline";

  const date = new Date(
    `${String(dateString).slice(0, 10)}T00:00:00`
  );

  if (Number.isNaN(date.getTime())) {
    return "No deadline";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getChipStyle(styles, value) {
  return (
    styles[value] || {
      color: "#64756a",
      background: "#f1f8f3",
    }
  );
}

// Summary card
function SummaryCard({ title, value, subtitle, icon, color }) {
  return (
    <Card
      elevation={0}
      sx={{
        minWidth: 0,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 0.5,
        height: "100%",
      }}
    >
      <CardContent
        sx={{
          p: 2.25,
          "&:last-child": { pb: 2.25 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
            mb: 1.5,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            fontWeight={600}
          >
            {title}
          </Typography>

          <Box
            sx={{
              display: "grid",
              placeItems: "center",
              width: 38,
              height: 38,
              borderRadius: 0.5,
              color,
              bgcolor: `${color}18`,
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        </Box>

        <Typography
          variant="h4"
          fontWeight={800}
          sx={{ letterSpacing: "-1px" }}
        >
          {value}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
        >
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function TasksPage({
  tasks = [],
  onDelete,
}) {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("latest");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [deleteError, setDeleteError] = useState("");

  // Dynamically get the categories from the tasks
  const categories = useMemo(
    () =>
      [
        ...new Set(
          tasks.map((task) => task.category).filter(Boolean)
        ),
      ].sort(),
    [tasks]
  );

  // Summary statistics
  const stats = useMemo(
    () => ({
      total: tasks.length,

      pending: tasks.filter(
        (task) => getStatus(task.status) === "Pending"
      ).length,

      inProgress: tasks.filter(
        (task) => getStatus(task.status) === "In Progress"
      ).length,

      completed: tasks.filter(
        (task) => getStatus(task.status) === "Completed"
      ).length,
    }),
    [tasks]
  );

  // Reset pagination when the filters change
  useEffect(() => {
    setPage(0);
  }, [search, statusFilter, priorityFilter, categoryFilter]);

  // Search, filter, and sort tasks
  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = tasks.filter((task) => {
      const searchableValues = [
        task.title,
        task.desc,
        task.category,
        task.priority,
      ];

      const matchesSearch =
        !query ||
        searchableValues
          .filter((value) => value != null)
          .some((value) =>
            String(value).toLowerCase().includes(query)
          );

      const matchesStatus =
        statusFilter === "All" ||
        getStatus(task.status) === statusFilter;

      const matchesPriority =
        priorityFilter === "All" ||
        (task.priority || "Low") === priorityFilter;

      const matchesCategory =
        categoryFilter === "All" ||
        task.category === categoryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesCategory
      );
    });

    return result.sort((a, b) => {
      if (sortBy === "dueDate") {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;

        return a.dueDate.localeCompare(b.dueDate);
      }

      if (sortBy === "priority") {
        const order = { High: 0, Medium: 1, Low: 2 };

        return (
          (order[a.priority] ?? 3) -
          (order[b.priority] ?? 3)
        );
      }

      return (
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
      );
    });
  }, [
    tasks,
    search,
    statusFilter,
    priorityFilter,
    categoryFilter,
    sortBy,
  ]);

  // Tasks displayed on the current page
  const paginatedTasks = filteredTasks.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Reset all filters
  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setPriorityFilter("All");
    setCategoryFilter("All");
    setSortBy("latest");
    setPage(0);
  };

  // Delete task
  const handleDelete = async (task) => {
    try {
      setDeleteError("");

      if (typeof onDelete !== "function") {
        throw new Error(
          "Delete handler is not configured in the parent component."
        );
      }

      await onDelete(task.id);
    } catch (error) {
      setDeleteError(
        error.message || "Unable to delete the task."
      );
    }
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        pt: { xs: 2, md: 3 },
        pb: 5,
        px: { xs: 1.5, sm: 3 },
      }}
    >
      {/* Error message */}
      {deleteError && (
        <Alert
          severity="error"
          onClose={() => setDeleteError("")}
          sx={{ mb: 2 }}
        >
          {deleteError}
        </Alert>
      )}

      {/* Page header */}
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            component="h1"
            variant="h4"
            fontWeight={800}
            sx={{
              letterSpacing: "-1px",
              fontSize: { xs: 20, md: 25 },
            }}
          >
            My Tasks
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.75 }}
          >
            Manage your tasks, priorities, and deadlines in one place.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={() => navigate("/tasks/new")}
          sx={{
            bgcolor: BRAND_GREEN,
            borderRadius: 0.5,
            px: 1,
            py: 0.5,
            fontWeight: 700,
            textTransform: "none",
            boxShadow: "none",
            "&:hover": {
              bgcolor: "#5526d9",
              boxShadow: "none",
            },
          }}
        >
          Add Task
        </Button>
      </Box>

      
      {/* Search and filters */}
      <Card
        elevation={0}
        sx={{
          p: 1,
          mb: 1,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 0.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          {/* Search */}
          <TextField
            size="small"
            placeholder="Search tasks..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            sx={{
              flex: { xs: "1 1 100%", sm: "1 1 220px" },
              maxWidth: { sm: 170 },
              "& .MuiOutlinedInput-root": {
                height: 30,
                borderRadius: 0.5,
                fontSize: 13,
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={17} />
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Status filter */}
          <FormControl
            size="small"
            sx={{
              minWidth: { xs: "calc(50% - 8px)", sm: 100 },
              flexGrow: { xs: 1, sm: 0 },
              "& .MuiOutlinedInput-root": {
                height: 30,
                borderRadius: 0.5,
                fontSize: 13,
              },
            }}
          >
            <Select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              displayEmpty
              inputProps={{ "aria-label": "Filter by status" }}
            >
              <MenuItem value="All">All Status</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>

          {/* Priority filter */}
          <FormControl
            size="small"
            sx={{
              minWidth: { xs: "calc(50% - 8px)", sm: 100 },
              flexGrow: { xs: 1, sm: 0 },
              "& .MuiOutlinedInput-root": {
                height: 30,
                borderRadius: 0.5,
                fontSize: 13,
              },
            }}
          >
            <Select
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(event.target.value)
              }
              displayEmpty
              inputProps={{ "aria-label": "Filter by priority" }}
            >
              <MenuItem value="All">All Priority</MenuItem>
              <MenuItem value="High">High Priority</MenuItem>
              <MenuItem value="Medium">Medium Priority</MenuItem>
              <MenuItem value="Low">Low Priority</MenuItem>
            </Select>
          </FormControl>

          {/* Category filter */}
          <FormControl
            size="small"
            sx={{
              minWidth: { xs: "100%", sm: 120 },
              flexGrow: { xs: 1, sm: 0 },
              "& .MuiOutlinedInput-root": {
                height: 30,
                borderRadius: 0.5,
                fontSize: 13,
              },
            }}
          >
            <Select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(event.target.value)
              }
              displayEmpty
              inputProps={{ "aria-label": "Filter by category" }}
            >
              <MenuItem value="All">All Categories</MenuItem>

              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ flex: 1 }} />

          {/* Reset */}
          <Tooltip title="Reset filters">
            <IconButton
              aria-label="Reset filters"
              onClick={resetFilters}
              sx={{
                width: 35,
                height: 30,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 0.5,
              }}
            >
              <RotateCcw size={17} />
            </IconButton>
          </Tooltip>

          {/* Sorting */}
          <FormControl
            size="small"
            sx={{
              minWidth: { xs: "100%", sm: 120 },
              "& .MuiOutlinedInput-root": {
                height: 30,
                borderRadius: 0.5,
                fontSize: 13,
              },
            }}
          >
            <Select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <ArrowUpDown size={15} />
                </InputAdornment>
              }
              inputProps={{ "aria-label": "Sort tasks" }}
            >
              <MenuItem value="latest">Latest First</MenuItem>
              <MenuItem value="dueDate">Due Date</MenuItem>
              <MenuItem value="priority">Priority</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Card>

      {/* Tasks table */}
      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 0.5,
          overflow: "hidden",
        }}
      >
        <TableContainer
          sx={{
            width: "100%",
            overflowX: "auto",
          }}
        >
          <Table
            sx={{
              minWidth: 1000,
              "& .MuiTableCell-root": {
                borderColor: "divider",
              },
            }}
            aria-label="Tasks table"
          >
            {/* Table header */}
            <TableHead>
              <TableRow
                sx={{
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "action.hover"
                      : "#eef2ff",
                }}
              >
                {[
                  "Task Name",
                  "Category",
                  "Priority",
                  "Due Date",
                  "Status",
                  "Progress",
                  "Actions",
                ].map((heading) => (
                  <TableCell
                    key={heading}
                    sx={{
                      py: 1.75,
                      fontWeight: 800,
                      fontSize: 12.5,
                      whiteSpace: "nowrap",
                      color: "text.primary",
                    }}
                  >
                    {heading}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            {/* Table rows */}
            <TableBody>
              {paginatedTasks.map((task) => {
                const status = getStatus(task.status);
                const progress = getProgress(task);

                const categoryStyle = getChipStyle(
                  categoryStyles,
                  task.category
                );

                const priorityStyle = getChipStyle(
                  priorityStyles,
                  task.priority || "Low"
                );

                const statusStyle = getChipStyle(
                  statusStyles,
                  status
                );

                return (
                  <TableRow
                    hover
                    key={task.id}
                    sx={{
                      "&:last-child td": {
                        borderBottom: 0,
                      },
                      "&:hover": {
                        bgcolor: "action.hover",
                      },
                    }}
                  >
                    {/* Task name and description */}
                    <TableCell
                      sx={{
                        py: 1.5,
                        minWidth: 230,
                        maxWidth: 320,
                      }}
                    >
                      <Typography
                        variant="body2"
                        fontWeight={750}
                        sx={{
                          overflowWrap: "anywhere",
                          mb: 0.5,
                        }}
                      >
                        {task.title || "Untitled task"}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          lineHeight: 1.5,
                        }}
                      >
                        {task.desc || "No description provided."}
                      </Typography>
                    </TableCell>

                    {/* Category */}
                    <TableCell>
                      <Chip
                        label={task.category || "General"}
                        size="small"
                        sx={{
                          color: categoryStyle.color,
                          bgcolor: categoryStyle.background,
                          borderRadius: 0.5,
                          fontWeight: 700,
                          fontSize: 11,
                        }}
                      />
                    </TableCell>

                    {/* Priority */}
                    <TableCell>
                      <Chip
                        label={task.priority || "Low"}
                        size="small"
                        sx={{
                          color: priorityStyle.color,
                          bgcolor: priorityStyle.background,
                          borderRadius: 0.5,
                          fontWeight: 700,
                          fontSize: 11,
                        }}
                      />
                    </TableCell>

                    {/* Due date */}
                    <TableCell sx={{ minWidth: 140 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.8,
                          whiteSpace: "nowrap",
                        }}
                      >
                        <CalendarDays
                          size={15}
                          color="#64756a"
                        />

                        <Typography variant="body2">
                          {formatDueDate(task.dueDate)}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Chip
                        label={status}
                        size="small"
                        icon={
                          status === "Completed" ? (
                            <CheckCircle2 size={14} />
                          ) : status === "In Progress" ? (
                            <Clock3 size={14} />
                          ) : (
                            <CircleDashed size={14} />
                          )
                        }
                        sx={{
                          color: statusStyle.color,
                          bgcolor: statusStyle.background,
                          borderRadius: 0.5,
                          fontSize: 11,
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                          "& .MuiChip-icon": {
                            color: statusStyle.color,
                            ml: 0.75,
                          },
                        }}
                      />
                    </TableCell>

                    {/* Progress */}
                    <TableCell sx={{ minWidth: 135 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Box
                          sx={{
                            width: 65,
                            height: 6,
                            overflow: "hidden",
                            borderRadius: 0.5,
                            bgcolor: "action.selected",
                          }}
                        >
                          <Box
                            sx={{
                              width: `${progress}%`,
                              height: "100%",
                              borderRadius: 0.5,
                              bgcolor:
                                status === "Completed"
                                  ? "#079669"
                                  : status === "In Progress"
                                    ? BRAND_GREEN
                                    : "#9ca3af",
                              transition: "width 250ms ease",
                            }}
                          />
                        </Box>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          fontWeight={700}
                        >
                          {progress}%
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <Tooltip title="Delete task">
                          <IconButton
                            size="small"
                            aria-label={`Delete ${task.title}`}
                            onClick={() => handleDelete(task)}
                            sx={{
                              color: "#087f5b",
                              "&:hover": {
                                color: "error.main",
                                bgcolor: "action.hover",
                              },
                            }}
                          >
                            <Trash2 size={17} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}

              {/* Empty state */}
              {filteredTasks.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    sx={{
                      py: 8,
                      textAlign: "center",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <ListTodo
                        size={38}
                        color="#94a69a"
                      />

                      <Typography
                        variant="subtitle1"
                        fontWeight={750}
                      >
                        {tasks.length === 0
                          ? "No tasks yet"
                          : "No tasks found"}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {tasks.length === 0
                          ? "Create your first task to get started."
                          : "Try changing your search or filters."}
                      </Typography>

                      {tasks.length > 0 ? (
                        <Button
                          onClick={resetFilters}
                          startIcon={<RotateCcw size={16} />}
                          sx={{
                            mt: 1,
                            textTransform: "none",
                          }}
                        >
                          Reset filters
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          startIcon={<Plus size={17} />}
                          onClick={() => navigate("/tasks/new")}
                          sx={{
                            mt: 1,
                            bgcolor: BRAND_GREEN,
                            textTransform: "none",
                            "&:hover": {
                              bgcolor: "#5526d9",
                            },
                          }}
                        >
                          Create Task
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
  component="div"
  count={filteredTasks.length}
  page={page}
  onPageChange={(_, newPage) => setPage(newPage)}
  rowsPerPage={rowsPerPage}
  onRowsPerPageChange={(event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  }}
  rowsPerPageOptions={[5, 10, 25]}
  sx={{
    borderTop: '1px solid',
    borderColor: 'divider',

    '& .MuiTablePagination-toolbar': {
      minHeight: 20,
      flexWrap: 'wrap',
      justifyContent: 'flex-end',
    },

    '& .MuiTablePagination-spacer': {
      display: 'none',
    },

    '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
      fontSize: 10,
    },
  }}
/>
      </Card>

      
    </Container>
  );
}