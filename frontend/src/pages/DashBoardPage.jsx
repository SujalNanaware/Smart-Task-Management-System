
import React, { useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDashed,
  Clock3,
  Folder,
  ListTodo,
  Plus,
  Search,
  Target,
  Users,
  Zap,
} from "lucide-react";

// --------------------------------------------------
// Constants
// --------------------------------------------------

const STATUS_COLORS = {
  Completed: "#16A34A",
  "In Progress": "#4F46E5",
  Pending: "#D97706",
};

const PRIORITY_COLORS = {
  Critical: "#DC2626",
  High: "#EF4444",
  Medium: "#D97706",
  Low: "#2563EB",
};

const STATUS_ORDER = ["Completed", "In Progress", "Pending"];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// --------------------------------------------------
// Date and task helpers
// --------------------------------------------------

function toDateKey(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function formatDate(dateString, options = {}) {
  if (!dateString) return "No deadline";

  const date = new Date(`${dateString.slice(0, 10)}T00:00:00`);

  if (Number.isNaN(date.getTime())) return "No deadline";

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    ...options,
  }).format(date);
}

function getTaskStatus(task) {
  return task.status || "Pending";
}

function getTaskAssignee(task) {
  return (
    task.assignee ||
    task.assignedTo ||
    task.assigned_to ||
    ""
  );
}

function getTaskId(task, index = 0) {
  return (
    task.id ||
    task._id ||
    task.sys_id ||
    `${task.title || "task"}-${index}`
  );
}

function getInitials(name) {
  if (!name) return "?";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function getPriorityColor(priority) {
  return PRIORITY_COLORS[priority] || "#64748B";
}

function getStatusColor(status) {
  return STATUS_COLORS[status] || "#64748B";
}

// --------------------------------------------------
// Reusable UI styles
// --------------------------------------------------

const cardSx = {
  minWidth: 0,
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 3,
  boxShadow: "0 3px 16px rgba(15, 23, 42, 0.025)",
  backgroundImage: "none",
};

const sectionTitleSx = {
  fontSize: { xs: 15, sm: 16 },
  fontWeight: 750,
  letterSpacing: "-0.35px",
};

const sectionSubtitleSx = {
  fontSize: 11.5,
  color: "text.secondary",
  mt: 0.4,
};

const compactButtonSx = {
  textTransform: "none",
  fontSize: 12,
  fontWeight: 650,
  borderRadius: 2,
  whiteSpace: "nowrap",
};

// --------------------------------------------------
// Dashboard component
// --------------------------------------------------

export default function DashboardPage({ tasks = [] }) {
  const navigate = useNavigate();
  const theme = useTheme();

  const isDark = theme.palette.mode === "dark";

  const [timeRange, setTimeRange] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [today] = useState(() => new Date());

  const [calendarMonth, setCalendarMonth] = useState(
    () =>
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      )
  );

  const [selectedCalendarDate, setSelectedCalendarDate] =
    useState(() => toDateKey(new Date()));

  const todayKey = toDateKey(today);

  const currentDateLabel = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(today);

  const greeting =
    today.getHours() < 12
      ? "Good morning"
      : today.getHours() < 17
        ? "Good afternoon"
        : "Good evening";

  const chartText = theme.palette.text.secondary;
  const chartGrid = theme.palette.divider;

  const tooltipStyle = {
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 10,
    color: theme.palette.text.primary,
    fontSize: 12,
  };

  // ------------------------------------------------
  // Time range filter
  // ------------------------------------------------

  const visibleTasks = useMemo(() => {
    if (timeRange === "all") return tasks;

    const days = Number(timeRange);
    const cutoff = new Date(today);

    cutoff.setDate(cutoff.getDate() - days);
    cutoff.setHours(0, 0, 0, 0);

    return tasks.filter((task) => {
      if (!task.createdAt) return false;

      const createdAt = new Date(task.createdAt);

      return (
        !Number.isNaN(createdAt.getTime()) &&
        createdAt >= cutoff
      );
    });
  }, [tasks, timeRange, today]);

  // ------------------------------------------------
  // KPI calculations
  // ------------------------------------------------

  const stats = useMemo(() => {
    const total = visibleTasks.length;

    const completed = visibleTasks.filter(
      (task) => getTaskStatus(task) === "Completed"
    ).length;

    const inProgress = visibleTasks.filter(
      (task) => getTaskStatus(task) === "In Progress"
    ).length;

    const pending = visibleTasks.filter(
      (task) => getTaskStatus(task) === "Pending"
    ).length;

    const completion = total
      ? Math.round((completed / total) * 100)
      : 0;

    return {
      total,
      completed,
      inProgress,
      pending,
      completion,
    };
  }, [visibleTasks]);

  // ------------------------------------------------
  // Task activity chart: last 30 days
  // ------------------------------------------------

  const activityData = useMemo(() => {
    const days = Array.from({ length: 30 }, (_, index) => {
      const date = new Date(today);

      date.setDate(date.getDate() - (29 - index));

      const key = toDateKey(date);

      return {
        key,
        label: new Intl.DateTimeFormat(undefined, {
          month: "short",
          day: "numeric",
        }).format(date),
        count: 0,
      };
    });

    const countsByDate = new Map(
      days.map((day) => [day.key, day])
    );

    tasks.forEach((task) => {
      if (!task.createdAt) return;

      const createdAt = new Date(task.createdAt);

      if (Number.isNaN(createdAt.getTime())) return;

      const day = countsByDate.get(toDateKey(createdAt));

      if (day) day.count += 1;
    });

    return days;
  }, [tasks, today]);

  // ------------------------------------------------
  // Task status chart
  // ------------------------------------------------

  const statusData = useMemo(
    () =>
      STATUS_ORDER.map((name) => ({
        name,
        value: visibleTasks.filter(
          (task) => getTaskStatus(task) === name
        ).length,
        color: STATUS_COLORS[name],
      })),
    [visibleTasks]
  );

  // ------------------------------------------------
  // Project and team data
  // ------------------------------------------------

  const projectData = useMemo(() => {
    const projectTasks = visibleTasks.filter(
      (task) =>
        typeof task.project === "string" &&
        task.project.trim() !== ""
    );

    const projectNames = [
      ...new Set(
        projectTasks.map((task) => task.project.trim())
      ),
    ];

    const completedProjectTasks = projectTasks.filter(
      (task) => getTaskStatus(task) === "Completed"
    ).length;

    const progress = projectTasks.length
      ? Math.round(
          (completedProjectTasks / projectTasks.length) * 100
        )
      : 0;

    return {
      count: projectNames.length,
      progress,
      taskCount: projectTasks.length,
    };
  }, [visibleTasks]);

  const teamMembers = useMemo(() => {
    return [
      ...new Set(
        visibleTasks
          .map((task) => getTaskAssignee(task).trim())
          .filter(Boolean)
      ),
    ];
  }, [visibleTasks]);

  // ------------------------------------------------
  // Overdue and today's tasks
  // ------------------------------------------------

  const overdueTasks = useMemo(
    () =>
      tasks.filter(
        (task) =>
          task.dueDate &&
          task.dueDate.slice(0, 10) < todayKey &&
          getTaskStatus(task) !== "Completed"
      ),
    [tasks, todayKey]
  );

  const todayTasks = useMemo(
    () =>
      tasks.filter(
        (task) =>
          task.dueDate &&
          task.dueDate.slice(0, 10) === todayKey &&
          getTaskStatus(task) !== "Completed"
      ),
    [tasks, todayKey]
  );

  // ------------------------------------------------
  // Search and recent tasks
  // ------------------------------------------------

  const recentTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return [...visibleTasks]
      .filter((task) => {
        if (!query) return true;

        const searchableFields = [
          task.title,
          task.description,
          task.desc,
          task.project,
          task.category,
          task.priority,
          task.status,
          getTaskAssignee(task),
        ];

        return searchableFields.some((value) =>
          String(value || "").toLowerCase().includes(query)
        );
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      )
      .slice(0, 5);
  }, [visibleTasks, searchQuery]);

  // ------------------------------------------------
  // Upcoming deadlines
  // ------------------------------------------------

  const upcomingTasks = useMemo(() => {
    const limit = new Date(today);

    limit.setDate(limit.getDate() + 7);

    const limitKey = toDateKey(limit);

    return tasks
      .filter((task) => {
        const dueDate = task.dueDate?.slice(0, 10);

        return (
          getTaskStatus(task) !== "Completed" &&
          dueDate &&
          dueDate >= todayKey &&
          dueDate <= limitKey
        );
      })
      .sort((a, b) => {
        const dateComparison = a.dueDate.localeCompare(b.dueDate);

        if (dateComparison !== 0) return dateComparison;

        const priorityOrder = {
          Critical: 0,
          High: 1,
          Medium: 2,
          Low: 3,
        };

        return (
          (priorityOrder[a.priority] ?? 4) -
          (priorityOrder[b.priority] ?? 4)
        );
      })
      .slice(0, 5);
  }, [tasks, today, todayKey]);

  // ------------------------------------------------
  // Calendar deadline markers
  // ------------------------------------------------

  const deadlinesByDate = useMemo(() => {
    const result = {};

    tasks.forEach((task) => {
      if (!task.dueDate) return;

      const key = task.dueDate.slice(0, 10);

      if (!result[key]) result[key] = [];

      result[key].push(task);
    });

    return result;
  }, [tasks]);

  const calendarCells = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const startOffset = firstDay.getDay();

    return Array.from({ length: 42 }, (_, index) => {
      return new Date(year, month, index - startOffset + 1);
    });
  }, [calendarMonth]);

  const monthLabel = new Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric",
  }).format(calendarMonth);

  const changeMonth = (offset) => {
    setCalendarMonth(
      (current) =>
        new Date(
          current.getFullYear(),
          current.getMonth() + offset,
          1
        )
    );
  };

  // ------------------------------------------------
  // KPI card definitions
  // ------------------------------------------------

  const statCards = [
    {
      label: "Total tasks",
      value: stats.total,
      caption: "Across your workspace",
      icon: <ListTodo size={20} />,
      color: "#6366F1",
      tint: isDark ? "#312E81" : "#EEF2FF",
    },
    {
      label: "Completed",
      value: stats.completed,
      caption: `${stats.completion}% completion rate`,
      icon: <CheckCircle2 size={20} />,
      color: "#16A34A",
      tint: isDark ? "#14532D" : "#DCFCE7",
    },
    {
      label: "In progress",
      value: stats.inProgress,
      caption: "Currently being worked on",
      icon: <Zap size={20} />,
      color: "#2563EB",
      tint: isDark ? "#1E3A8A" : "#DBEAFE",
    },
    {
      label: "Pending",
      value: stats.pending,
      caption: "Waiting to be started",
      icon: <CircleDashed size={20} />,
      color: "#D97706",
      tint: isDark ? "#78350F" : "#FEF3C7",
    },
  ];

  // ------------------------------------------------
  // Render
  // ------------------------------------------------

  return (
    <Container
      maxWidth="xl"
      sx={{
        pt: { xs: 2, md: 3 },
        pb: 4,
        px: { xs: 1.5, sm: 2.5, md: 3 },
        minWidth: 0,
      }}
    >
      {/* ===========================================
          HEADER
      =========================================== */}

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", md: "center" },
          gap: 2,
          mb: 3,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: 24, sm: 29, md: 32 },
              fontWeight: 800,
              letterSpacing: "-1.1px",
              lineHeight: 1.2,
            }}
          >
            {greeting},{" "}
            <Box component="span" sx={{ color: "primary.main" }}>
              let's get things moving.
            </Box>
          </Typography>

          <Typography
            sx={{
              mt: 0.8,
              fontSize: 12.5,
              color: "text.secondary",
            }}
          >
            Your work, team workload, and deadlines in one place.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: { xs: "space-between", md: "flex-end" },
            gap: 1.2,
          }}
        >
          

          <Button
            variant="contained"
            onClick={() => navigate("/tasks/new")}
            sx={{
              ...compactButtonSx,
              minHeight: 30,
              px: 1,
              boxShadow: "0 5px 14px rgba(99, 102, 241, 0.18)",
            }}
          >
            Create task
          </Button>
        </Box>
      </Box>

      {/* ===========================================
          TIME FILTER
      =========================================== */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
          flexWrap: "wrap",
          mb: 1.5,
        }}
      >
      </Box>

      {/* ===========================================
          KPI CARDS
      =========================================== */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))",
          },
          gap: { xs: 1.2, md: 1.7 },
          mb: 2.5,
        }}
      >
       
{statCards.map((stat, index) => (
  <Paper
    key={stat.label}
    elevation={0}
    sx={{
      ...cardSx,
      position: "relative",
      overflow: "hidden",
      p: { xs: 1.8, sm: 2.2 },
      minHeight: { xs: 100, sm: 160 },
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      border: "1px solid",
      borderColor: "divider",
      borderRadius: "16px",
      background: (theme) =>
        theme.palette.mode === "dark"
          ? `linear-gradient(145deg, ${stat.tint}30 0%, ${theme.palette.background.paper} 65%)`
          : `linear-gradient(145deg, ${stat.tint}65 0%, #FFFFFF 72%)`,
      transition:
        "transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease",
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "3px",
        backgroundColor: stat.color,
        opacity: 0.85,
      },
      "&::after": {
        content: '""',
        position: "absolute",
        width: 95,
        height: 95,
        borderRadius: "50%",
        backgroundColor: stat.color,
        opacity: 0.045,
        right: -35,
        bottom: -40,
        pointerEvents: "none",
      },
      "&:hover": {
        transform: "translateY(-4px)",
        borderColor: stat.color,
        boxShadow: `0 12px 28px ${stat.color}18`,
      },
    }}
  >
    {/* Card header */}
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
        position: "relative",
        zIndex: 1,
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: 11, sm: 12 },
          fontWeight: 650,
          color: "text.secondary",
          letterSpacing: "0.1px",
        }}
      >
        {stat.label}
      </Typography>

      <Box
        sx={{
          width: 39,
          height: 39,
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
          color: stat.color,
          backgroundColor: stat.tint,
          border: `1px solid ${stat.color}22`,
          borderRadius: "12px",
          "& svg": {
            width: 20,
            height: 20,
            strokeWidth: 2.2,
          },
        }}
      >
        {stat.icon}
      </Box>
    </Box>

    {/* Main metric */}
    <Box sx={{ mt: 1.2, position: "relative", zIndex: 1 }}>
      <Typography
        sx={{
          fontSize: { xs: 29, sm: 34 },
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: "-1.4px",
          color: "text.primary",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {stat.value}
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.7,
          mt: 1.2,
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: stat.color,
            flexShrink: 0,
          }}
        />

        <Typography
          sx={{
            fontSize: { xs: 9.5, sm: 10.5 },
            color: "text.secondary",
            lineHeight: 1.4,
            overflowWrap: "anywhere",
          }}
        >
          {stat.caption}
        </Typography>
      </Box>
    </Box>
  </Paper>
))}

      </Box>

      {/* ===========================================
          ANALYTICS + STATUS + CALENDAR
      =========================================== */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            lg: "minmax(0, 1.35fr) minmax(270px, 1fr)",
            xl: "minmax(0, 1.3fr) minmax(270px, 1fr) minmax(260px, 0.88fr)",
          },
          gap: 1.8,
          mb: 2,
        }}
      >
        {/* Task activity chart */}
        <Paper
          elevation={0}
          sx={{
            ...cardSx,
            p: { xs: 1.8, sm: 2.3 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1.2,
              mb: 2,
            }}
          >
            <Box
              sx={{
                width: 35,
                height: 35,
                display: "grid",
                placeItems: "center",
                color: "primary.main",
                backgroundColor: "action.hover",
                borderRadius: 2,
                flexShrink: 0,
              }}
            >
              <Activity size={19} />
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography sx={sectionTitleSx}>
                Task activity
              </Typography>

              <Typography sx={sectionSubtitleSx}>
                Tasks created over the last 30 days
              </Typography>
            </Box>
          </Box>

          <Box sx={{ width: "100%", height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={activityData}
                margin={{ top: 8, right: 8, left: -22, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="taskFlowActivityFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#6366F1"
                      stopOpacity={0.27}
                    />
                    <stop
                      offset="95%"
                      stopColor="#6366F1"
                      stopOpacity={0.01}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  vertical={false}
                  stroke={chartGrid}
                  strokeDasharray="4 5"
                />

                <XAxis
                  dataKey="label"
                  interval={4}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: chartText, fontSize: 10 }}
                  dy={8}
                />

                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: chartText, fontSize: 10 }}
                />

                <ChartTooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => [value, "Tasks created"]}
                />

                <Area
                  type="monotone"
                  dataKey="count"
                  name="Tasks created"
                  stroke="#6366F1"
                  strokeWidth={2.5}
                  fill="url(#taskFlowActivityFill)"
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Paper>

        {/* Status distribution */}
        <Paper
          elevation={0}
          sx={{
            ...cardSx,
            p: { xs: 1.8, sm: 2.3 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1.2,
              mb: 1,
            }}
          >
            <Box
              sx={{
                width: 35,
                height: 35,
                display: "grid",
                placeItems: "center",
                color: "primary.main",
                backgroundColor: "action.hover",
                borderRadius: 2,
                flexShrink: 0,
              }}
            >
              <Target size={19} />
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography sx={sectionTitleSx}>
                Task status
              </Typography>

              <Typography sx={sectionSubtitleSx}>
                Current workload distribution
              </Typography>
            </Box>
          </Box>

          <Box sx={{ position: "relative", width: "100%", height: 175 }}>
            {stats.total > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData.filter((item) => item.value > 0)}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={49}
                      outerRadius={73}
                      paddingAngle={4}
                      stroke="none"
                    >
                      {statusData
                        .filter((item) => item.value > 0)
                        .map((item) => (
                          <Cell
                            key={item.name}
                            fill={item.color}
                          />
                        ))}
                    </Pie>

                    <ChartTooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>

                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    pointerEvents: "none",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 27,
                      fontWeight: 800,
                      lineHeight: 1.1,
                    }}
                  >
                    {stats.total}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 10,
                      color: "text.secondary",
                    }}
                  >
                    Total tasks
                  </Typography>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  height: "100%",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Typography
                  sx={{ fontSize: 11.5, color: "text.secondary" }}
                >
                  Create tasks to see the distribution.
                </Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
            {statusData.map((item) => {
              const percentage = stats.total
                ? Math.round((item.value / stats.total) * 100)
                : 0;

              return (
                <Box
                  key={item.name}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: item.color,
                      flexShrink: 0,
                    }}
                  />

                  <Typography
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      fontSize: 11,
                      color: "text.secondary",
                    }}
                  >
                    {item.name}
                  </Typography>

                  <Typography
                    sx={{ fontSize: 11.5, fontWeight: 750 }}
                  >
                    {item.value}
                  </Typography>

                  <Typography
                    sx={{
                      width: 34,
                      textAlign: "right",
                      fontSize: 10,
                      color: "text.secondary",
                    }}
                  >
                    {percentage}%
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Paper>

        {/* Interactive calendar */}
      </Box>

      {/* ===========================================
          OPERATIONAL SUMMARY CARDS
      =========================================== */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))",
          },
          gap: 1.5,
          mb: 2.5,
        }}
      >
        {/* Project completion */}
        <Paper
          elevation={0}
          sx={{
            ...cardSx,
            p: 1.8,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 42,
              height: 42,
              display: "grid",
              placeItems: "center",
              borderRadius: 2.5,
              color: "#6366F1",
              backgroundColor: isDark ? "#312E81" : "#EEF2FF",
              flexShrink: 0,
            }}
          >
            <Folder size={20} />
          </Box>

          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography sx={{ fontSize: 10.5, color: "text.secondary" }}>
              Project task completion
            </Typography>

            <Typography sx={{ fontSize: 21, fontWeight: 800 }}>
              {projectData.taskCount
                ? `${projectData.progress}%`
                : "—"}
            </Typography>

            <LinearProgress
              variant="determinate"
              value={projectData.progress}
              sx={{
                mt: 0.8,
                height: 4,
                borderRadius: 4,
                bgcolor: "action.hover",
                "& .MuiLinearProgress-bar": {
                  bgcolor: "#6366F1",
                  borderRadius: 4,
                },
              }}
            />

            <Typography
              sx={{ mt: 0.6, fontSize: 9.5, color: "text.secondary" }}
            >
              {projectData.count} named project(s)
            </Typography>
          </Box>
        </Paper>

        {/* Team members */}
        <Paper
          elevation={0}
          sx={{
            ...cardSx,
            p: 1.8,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 42,
              height: 42,
              display: "grid",
              placeItems: "center",
              borderRadius: 2.5,
              color: "#059669",
              backgroundColor: isDark ? "#064E3B" : "#D1FAE5",
              flexShrink: 0,
            }}
          >
            <Users size={20} />
          </Box>

          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography sx={{ fontSize: 10.5, color: "text.secondary" }}>
              Assigned team members
            </Typography>

            <Typography sx={{ fontSize: 21, fontWeight: 800 }}>
              {teamMembers.length}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mt: 0.7 }}>
              {teamMembers.slice(0, 3).map((member) => (
                <Tooltip key={member} title={member}>
                  <Avatar
                    sx={{
                      width: 23,
                      height: 23,
                      ml: -0.3,
                      fontSize: 9,
                      fontWeight: 700,
                      color: "text.primary",
                      bgcolor: "action.selected",
                      border: "2px solid",
                      borderColor: "background.paper",
                    }}
                  >
                    {getInitials(member)}
                  </Avatar>
                </Tooltip>
              ))}

              {teamMembers.length > 3 && (
                <Typography
                  sx={{
                    ml: 0.8,
                    fontSize: 9.5,
                    color: "text.secondary",
                  }}
                >
                  +{teamMembers.length - 3} more
                </Typography>
              )}

              {teamMembers.length === 0 && (
                <Typography
                  sx={{ fontSize: 9.5, color: "text.secondary" }}
                >
                  No assignees yet
                </Typography>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Overdue tasks */}
        <Paper
          elevation={0}
          sx={{
            ...cardSx,
            p: 1.8,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 42,
              height: 42,
              display: "grid",
              placeItems: "center",
              borderRadius: 2.5,
              color: "#DC2626",
              backgroundColor: isDark ? "#7F1D1D" : "#FEE2E2",
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={20} />
          </Box>

          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography sx={{ fontSize: 10.5, color: "text.secondary" }}>
              Overdue tasks
            </Typography>

            <Typography
              sx={{
                fontSize: 21,
                fontWeight: 800,
                color: overdueTasks.length ? "#DC2626" : "success.main",
              }}
            >
              {overdueTasks.length}
            </Typography>

            <Typography
              sx={{ mt: 0.5, fontSize: 9.5, color: "text.secondary" }}
            >
              {overdueTasks.length
                ? "Require attention"
                : "No overdue tasks"}
            </Typography>
          </Box>
        </Paper>

        {/* Due today */}
        <Paper
          elevation={0}
          sx={{
            ...cardSx,
            p: 1.8,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 42,
              height: 42,
              display: "grid",
              placeItems: "center",
              borderRadius: 2.5,
              color: "#2563EB",
              backgroundColor: isDark ? "#1E3A8A" : "#DBEAFE",
              flexShrink: 0,
            }}
          >
            <CalendarClock size={20} />
          </Box>

          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography sx={{ fontSize: 10.5, color: "text.secondary" }}>
              Due today
            </Typography>

            <Typography sx={{ fontSize: 21, fontWeight: 800 }}>
              {todayTasks.length}
            </Typography>

            <Typography
              sx={{ mt: 0.5, fontSize: 9.5, color: "text.secondary" }}
            >
              Uncompleted deadlines
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* ===========================================
          RECENT TASKS + UPCOMING DEADLINES
      =========================================== */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            lg: "minmax(0, 1.65fr) minmax(280px, 0.9fr)",
          },
          gap: 1.8,
          alignItems: "start",
        }}
      >
        {/* Recent tasks table */}
        <Paper
          elevation={0}
          sx={{
            ...cardSx,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "stretch", sm: "center" },
              justifyContent: "space-between",
              gap: 1.5,
              p: { xs: 1.8, sm: 2.3 },
              pb: 1.8,
            }}
          >
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <ListTodo
                  size={19}
                  color={theme.palette.primary.main}
                />

                <Typography sx={sectionTitleSx}>
                  Recent tasks
                </Typography>
              </Box>

              <Typography sx={sectionSubtitleSx}>
                The latest work across your workspace
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <TextField
                size="small"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search tasks..."
                inputProps={{ "aria-label": "Search tasks" }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={15} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: { xs: "100%", sm: 190 },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    fontSize: 11,
                    backgroundColor: "background.paper",
                  },
                  "& .MuiOutlinedInput-input": {
                    py: 1,
                  },
                }}
              />

              <Button
                size="small"
                endIcon={<ArrowRight size={14} />}
                onClick={() => navigate("/tasks")}
                sx={compactButtonSx}
              >
                View all
              </Button>
            </Box>
          </Box>

          <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
            <Table
              size="small"
              aria-label="Recent tasks"
              sx={{
                minWidth: 700,
                "& th": {
                  py: 1.2,
                  px: 1.5,
                  fontSize: 10,
                  fontWeight: 750,
                  color: "text.secondary",
                  backgroundColor: "action.hover",
                  borderColor: "divider",
                  whiteSpace: "nowrap",
                },
                "& td": {
                  py: 1.3,
                  px: 1.5,
                  borderColor: "divider",
                  fontSize: 11,
                },
                "& tbody tr:hover": {
                  backgroundColor: "action.hover",
                },
                "& tbody tr:last-child td": {
                  borderBottom: 0,
                },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>Task</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Due date</TableCell>
                  <TableCell>Assignee</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {recentTasks.length > 0 ? (
                  recentTasks.map((task, index) => {
                    const status = getTaskStatus(task);
                    const statusColor = getStatusColor(status);
                    const priorityColor = getPriorityColor(task.priority);

                    const isOverdue =
                      task.dueDate &&
                      task.dueDate.slice(0, 10) < todayKey &&
                      status !== "Completed";

                    return (
                      <TableRow key={getTaskId(task, index)}>
                        <TableCell sx={{ minWidth: 155, maxWidth: 230 }}>
                          <Typography
                            sx={{
                              fontSize: 11.5,
                              fontWeight: 700,
                              overflowWrap: "anywhere",
                            }}
                          >
                            {task.title || "Untitled task"}
                          </Typography>

                          {(task.description || task.desc) && (
                            <Typography
                              sx={{
                                mt: 0.35,
                                fontSize: 10,
                                color: "text.secondary",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                maxWidth: 210,
                              }}
                            >
                              {task.description || task.desc}
                            </Typography>
                          )}
                        </TableCell>

                        <TableCell sx={{ minWidth: 100 }}>
                          <Typography
                            sx={{
                              fontSize: 10.5,
                              overflowWrap: "anywhere",
                            }}
                          >
                            {task.project || task.category || "—"}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Chip
                            size="small"
                            label={task.priority || "Not set"}
                            sx={{
                              height: 23,
                              fontSize: 9.5,
                              fontWeight: 700,
                              color: priorityColor,
                              backgroundColor: `${priorityColor}18`,
                              borderRadius: 1.5,
                            }}
                          />
                        </TableCell>

                        <TableCell>
                          <Chip
                            size="small"
                            label={status}
                            sx={{
                              height: 23,
                              fontSize: 9.5,
                              fontWeight: 700,
                              color: statusColor,
                              backgroundColor: `${statusColor}18`,
                              borderRadius: 1.5,
                            }}
                          />
                        </TableCell>

                        <TableCell>
                          <Typography
                            sx={{
                              fontSize: 10.5,
                              whiteSpace: "nowrap",
                              fontWeight: isOverdue ? 750 : 500,
                              color: isOverdue
                                ? "error.main"
                                : "text.secondary",
                            }}
                          >
                            {formatDate(task.dueDate)}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          {getTaskAssignee(task) ? (
                            <Tooltip title={getTaskAssignee(task)}>
                              <Avatar
                                sx={{
                                  width: 26,
                                  height: 26,
                                  fontSize: 9,
                                  fontWeight: 700,
                                  color: "text.primary",
                                  bgcolor: "action.selected",
                                }}
                              >
                                {getInitials(getTaskAssignee(task))}
                              </Avatar>
                            </Tooltip>
                          ) : (
                            <Typography
                              sx={{
                                fontSize: 10,
                                color: "text.secondary",
                              }}
                            >
                              Unassigned
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Box
                        sx={{
                          py: 5,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          textAlign: "center",
                          gap: 1,
                        }}
                      >
                        <ListTodo
                          size={28}
                          color={theme.palette.text.secondary}
                        />

                        <Typography
                          sx={{ fontWeight: 700, fontSize: 12 }}
                        >
                          {searchQuery
                            ? "No matching tasks"
                            : "No tasks to display"}
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: 10.5,
                            color: "text.secondary",
                          }}
                        >
                          {searchQuery
                            ? "Try another search term."
                            : "Create a task to get your workspace started."}
                        </Typography>

                        {!searchQuery && (
                          <Button
                            size="small"
                            startIcon={<Plus size={15} />}
                            onClick={() => navigate("/tasks/new")}
                            sx={compactButtonSx}
                          >
                            Create task
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Divider />

          <Box
            sx={{
              px: 2.3,
              py: 1.2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography
              sx={{ fontSize: 10, color: "text.secondary" }}
            >
              Showing {recentTasks.length} of {visibleTasks.length} matching tasks
            </Typography>

            <Button
              size="small"
              onClick={() => navigate("/tasks")}
              endIcon={<ArrowRight size={13} />}
              sx={compactButtonSx}
            >
              Open task list
            </Button>
          </Box>
        </Paper>

        {/* Upcoming deadlines */}
        <Paper
          elevation={0}
          sx={{
            ...cardSx,
            p: { xs: 1.8, sm: 2.3 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 1,
              mb: 0.7,
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarClock
                  size={19}
                  color={theme.palette.primary.main}
                />

                <Typography sx={sectionTitleSx}>
                  Upcoming deadlines
                </Typography>
              </Box>

              <Typography sx={sectionSubtitleSx}>
                Uncompleted tasks due in the next 7 days
              </Typography>
            </Box>

            <Chip
              size="small"
              label={upcomingTasks.length}
              sx={{
                fontWeight: 750,
                fontSize: 10,
                bgcolor: "action.hover",
              }}
            />
          </Box>

          {upcomingTasks.length > 0 ? (
            <Box sx={{ mt: 1.5 }}>
              {upcomingTasks.map((task, index) => {
                const priorityColor = getPriorityColor(task.priority);
                const dueDate = task.dueDate?.slice(0, 10);

                return (
                  <Box
                    key={getTaskId(task, index)}
                    sx={{
                      py: 1.5,
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1.2,
                      borderTop: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Box
                      sx={{
                        width: 43,
                        minWidth: 43,
                        minHeight: 43,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 2,
                        bgcolor: "action.hover",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 15,
                          fontWeight: 800,
                          lineHeight: 1.1,
                        }}
                      >
                        {dueDate?.slice(8, 10)}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: 9,
                          color: "text.secondary",
                        }}
                      >
                        {formatDate(dueDate, {
                          month: "short",
                        }).split(" ")[0]}
                      </Typography>
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontSize: 11.5,
                          fontWeight: 700,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {task.title || "Untitled task"}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: 10,
                          mt: 0.4,
                          color: "text.secondary",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {task.project || task.category || "General"}
                      </Typography>

                      {getTaskAssignee(task) && (
                        <Typography
                          sx={{
                            fontSize: 9.5,
                            mt: 0.6,
                            color: "text.secondary",
                          }}
                        >
                          Assigned to {getTaskAssignee(task)}
                        </Typography>
                      )}

                      <Chip
                        size="small"
                        label={task.priority || "Not set"}
                        sx={{
                          mt: 0.8,
                          height: 19,
                          fontSize: 9,
                          fontWeight: 700,
                          color: priorityColor,
                          bgcolor: `${priorityColor}18`,
                          borderRadius: 1.2,
                        }}
                      />
                    </Box>
                  </Box>
                );
              })}
            </Box>
          ) : (
            <Box
              sx={{
                mt: 2,
                py: 4,
                px: 1,
                textAlign: "center",
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <CheckCircle2
                size={28}
                color={theme.palette.success.main}
              />

              <Typography
                sx={{ mt: 1, fontSize: 12, fontWeight: 700 }}
              >
                No upcoming deadlines
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: 10.5,
                  color: "text.secondary",
                }}
              >
                You have no uncompleted tasks due in the next 7 days.
              </Typography>
            </Box>
          )}

          <Divider sx={{ mt: 1 }} />

          <Button
            fullWidth
            endIcon={<ArrowRight size={14} />}
            onClick={() => navigate("/tasks")}
            sx={{
              ...compactButtonSx,
              mt: 1.2,
              justifyContent: "space-between",
            }}
          >
            Manage all tasks
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}
