import React, { useMemo, useState } from 'react';
import {
  Box,
  Chip,
  Container,
  FormControl,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  AlertTriangle,
  CalendarCheck2,
  FolderKanban,
  Target,
  TrendingUp,
} from 'lucide-react';

const priorityConfig = [
  { name: 'High', color: '#fb7185' },
  { name: 'Medium', color: '#fbbf24' },
  { name: 'Low', color: '#34d399' },
];

const deadlineConfig = [
  { name: 'Overdue', color: '#fb7185' },
  { name: 'Next 7 days', color: '#fbbf24' },
  { name: 'Later', color: '#34d399' },
  { name: 'No deadline', color: '#94a69a' },
];

function getDateKey(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

export default function AnalyticsPage({ tasks = [] }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [timeRange, setTimeRange] = useState('all');
  const [today] = useState(() => new Date());
  const todayKey = getDateKey(today);
  const weekLimit = new Date(today);
  weekLimit.setDate(weekLimit.getDate() + 7);
  const weekLimitKey = getDateKey(weekLimit);
  const chartText = theme.palette.text.secondary;
  const chartGrid = theme.palette.divider;
  const tooltipStyle = {
    backgroundColor: theme.palette.background.paper,
    borderColor: chartGrid,
    borderRadius: 12,
    color: theme.palette.text.primary,
  };

  const filteredTasks = useMemo(() => {
    if (timeRange === 'all') return tasks;

    const cutoff = new Date(today);
    cutoff.setDate(cutoff.getDate() - Number(timeRange));
    cutoff.setHours(0, 0, 0, 0);

    return tasks.filter((task) => {
      if (!task.createdAt) return false;
      const createdAt = new Date(task.createdAt);
      return !Number.isNaN(createdAt.getTime()) && createdAt >= cutoff;
    });
  }, [tasks, timeRange, today]);

  const categoryData = useMemo(() => {
    const categories = new Map();

    filteredTasks.forEach((task) => {
      const name = task.category || 'General';
      const current = categories.get(name) || { name, total: 0, completed: 0 };
      current.total += 1;
      if (task.status === 'Completed') current.completed += 1;
      categories.set(name, current);
    });

    return [...categories.values()]
      .map((category) => ({
        ...category,
        completion: category.total
          ? Math.round((category.completed / category.total) * 100)
          : 0,
      }))
      .sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));
  }, [filteredTasks]);

  const deadlineData = useMemo(() => {
    const counts = Object.fromEntries(deadlineConfig.map(({ name }) => [name, 0]));

    filteredTasks.forEach((task) => {
      if (task.status === 'Completed') return;
      if (!task.dueDate) {
        counts['No deadline'] += 1;
      } else if (task.dueDate < todayKey) {
        counts.Overdue += 1;
      } else if (task.dueDate <= weekLimitKey) {
        counts['Next 7 days'] += 1;
      } else {
        counts.Later += 1;
      }
    });

    return deadlineConfig.map((item) => ({ ...item, count: counts[item.name] }));
  }, [filteredTasks, todayKey, weekLimitKey]);

  const priorityData = useMemo(
    () => priorityConfig.map((priority) => {
      const priorityTasks = filteredTasks.filter((task) => task.priority === priority.name);
      const completed = priorityTasks.filter((task) => task.status === 'Completed').length;
      const open = priorityTasks.length - completed;

      return {
        ...priority,
        total: priorityTasks.length,
        completed,
        open,
        completion: priorityTasks.length
          ? Math.round((completed / priorityTasks.length) * 100)
          : 0,
      };
    }),
    [filteredTasks],
  );

  const openTasks = filteredTasks.filter((task) => task.status !== 'Completed');
  const overdueTasks = openTasks.filter((task) => task.dueDate && task.dueDate < todayKey);
  const missingDeadlineTasks = openTasks.filter((task) => !task.dueDate);
  const largestCategory = categoryData[0];
  const completedTotal = filteredTasks.filter((task) => task.status === 'Completed').length;
  const completionRate = filteredTasks.length
    ? Math.round((completedTotal / filteredTasks.length) * 100)
    : 0;
  const deadlineAttention = overdueTasks.length + missingDeadlineTasks.length;

  const summary = [
    {
      label: 'Categories in use',
      value: categoryData.length,
      detail: largestCategory ? `Most active: ${largestCategory.name}` : 'Create tasks to see category data',
      icon: <FolderKanban size={19} />,
      color: '#34d399',
    },
    {
      label: 'Overdue tasks',
      value: overdueTasks.length,
      detail: overdueTasks.length ? 'Open tasks past their due date' : 'No overdue open tasks',
      icon: <AlertTriangle size={19} />,
      color: overdueTasks.length ? '#fb7185' : '#34d399',
    },
    {
      label: 'Missing deadlines',
      value: missingDeadlineTasks.length,
      detail: 'Open tasks without a due date',
      icon: <CalendarCheck2 size={19} />,
      color: '#fbbf24',
    },
    {
      label: 'Overall completion',
      value: `${completionRate}%`,
      detail: `${completedTotal} of ${filteredTasks.length} tasks completed`,
      icon: <Target size={19} />,
      color: '#6ee7b7',
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 }, px: { xs: 2, sm: 3 }, pt: { xs: 1, md: 1 } }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))' },
          gap: 2,
          alignItems: 'stretch',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            p: { xs: 2, sm: 3 },
            minHeight: { xs: 340, sm: 390 },
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            minWidth: 0,
            overflow: 'hidden',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, mb: 2 }}>
            <Box>
              <Typography variant="h6" fontWeight={750}>Category performance</Typography>
              <Typography variant="body2" color="text.secondary">Task volume and completion by category</Typography>
            </Box>
            <Chip label={`${categoryData.length} categories`} size="small" sx={{ fontWeight: 600 }} />
          </Box>
          {categoryData.length ? (
            <Box sx={{ width: '100%', height: Math.max(220, categoryData.length * (isSmallScreen ? 42 : 48)), minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  layout="vertical"
                  margin={{ top: 4, right: 8, left: 0, bottom: 4 }}
                  barCategoryGap={12}
                >
                  <CartesianGrid horizontal={false} stroke={chartGrid} strokeDasharray="4 6" />
                  <XAxis type="number" allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: chartText, fontSize: isSmallScreen ? 10 : 12 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={isSmallScreen ? 72 : 88}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: chartText, fontSize: isSmallScreen ? 10 : 12 }}
                  />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: theme.palette.action.hover }} />
                  <Bar dataKey="total" name="Tasks" radius={[0, 6, 6, 0]} maxBarSize={24}>
                    {categoryData.map((entry, index) => (
                      <Cell key={entry.name} fill={index === 0 ? '#087f5b' : '#34d399'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          ) : (
            <Box sx={{ minHeight: 260, display: 'grid', placeItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">Create tasks to see category performance.</Typography>
            </Box>
          )}
        </Paper>

        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            p: { xs: 2, sm: 3 },
            minHeight: { xs: 340, sm: 390 },
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            minWidth: 0,
            overflow: 'hidden',
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" fontWeight={750}>Deadline health</Typography>
            <Typography variant="body2" color="text.secondary">Open tasks grouped by due date</Typography>
          </Box>
          <Box sx={{ flex: 1, minHeight: 230, width: '100%', minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={deadlineData}
                layout="vertical"
                margin={{ top: 4, right: 8, left: 0, bottom: 4 }}
                barCategoryGap={12}
              >
                <CartesianGrid horizontal={false} stroke={chartGrid} strokeDasharray="4 6" />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: chartText, fontSize: isSmallScreen ? 10 : 12 }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={isSmallScreen ? 82 : 100}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: chartText, fontSize: isSmallScreen ? 10 : 12 }}
                />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: theme.palette.action.hover }} />
                <Bar dataKey="count" name="Open tasks" radius={[0, 6, 6, 0]} maxBarSize={28}>
                  {deadlineData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
          <Typography variant="caption" color="text.secondary">
            Completed tasks are excluded from deadline health.
          </Typography>
        </Paper>
      </Box>

    </Container>
  );
}
