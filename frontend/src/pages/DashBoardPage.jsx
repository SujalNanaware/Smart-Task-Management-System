import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Container,
  FormControl,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Typography,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  CircleDashed,
  Clock3,
  Plus,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react';

const statusColors = {
  Completed: '#34d399',
  Pending: '#fbbf24',
  'In Progress': '#818cf8',
};

const priorityOrder = { High: 0, Medium: 1, Low: 2 };
const priorityColors = { High: '#fb7185', Medium: '#fbbf24', Low: '#38bdf8' };
const statusOrder = ['Completed', 'In Progress', 'Pending'];

function formatDueDate(dateString) {
  if (!dateString) return 'No deadline';

  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return 'No deadline';

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export default function DashboardPage({ tasks = [] }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState('all');
  const [today] = useState(() => new Date());
  const chartText = theme.palette.text.secondary;
  const chartGrid = theme.palette.divider;
  const tooltipStyle = {
    backgroundColor: theme.palette.background.paper,
    borderColor: chartGrid,
    borderRadius: 12,
    color: theme.palette.text.primary,
  };
  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-');

  const visibleTasks = useMemo(() => {
    if (timeRange === 'all') return tasks;

    const days = Number(timeRange);
    const cutoff = new Date(today);
    cutoff.setDate(cutoff.getDate() - days);
    cutoff.setHours(0, 0, 0, 0);

    return tasks.filter((task) => {
      if (!task.createdAt) return false;
      const createdAt = new Date(task.createdAt);
      return !Number.isNaN(createdAt.getTime()) && createdAt >= cutoff;
    });
  }, [tasks, timeRange, today]);

  const stats = useMemo(() => {
    const completed = visibleTasks.filter((task) => task.status === 'Completed').length;
    const inProgress = visibleTasks.filter((task) => task.status === 'In Progress').length;
    const pending = visibleTasks.filter((task) => task.status === 'Pending').length;
    const completion = visibleTasks.length
      ? Math.round((completed / visibleTasks.length) * 100)
      : 0;

    return { total: visibleTasks.length, completed, inProgress, pending, completion };
  }, [visibleTasks]);

  const activityData = useMemo(() => {
    const dates = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - index));
      const key = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
      ].join('-');

      return {
        key,
        day: new Intl.DateTimeFormat(undefined, { weekday: 'short' }).format(date),
        count: 0,
      };
    });
    const daysByKey = new Map(dates.map((date) => [date.key, date]));

    tasks.forEach((task) => {
      if (!task.createdAt) return;
      const createdAt = new Date(task.createdAt);
      if (Number.isNaN(createdAt.getTime())) return;
      const key = [
        createdAt.getFullYear(),
        String(createdAt.getMonth() + 1).padStart(2, '0'),
        String(createdAt.getDate()).padStart(2, '0'),
      ].join('-');
      const day = daysByKey.get(key);
      if (day) day.count += 1;
    });

    return dates;
  }, [tasks, today]);

  const statusData = useMemo(
    () => statusOrder.map((name) => ({
      name,
      value: visibleTasks.filter((task) => task.status === name).length,
      color: statusColors[name],
    })),
    [visibleTasks],
  );

  const priorityData = useMemo(
    () => ['High', 'Medium', 'Low'].map((name) => ({
      name,
      value: visibleTasks.filter((task) => task.priority === name).length,
      color: priorityColors[name],
    })),
    [visibleTasks],
  );

  const recentTasks = useMemo(
    () => [...visibleTasks]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 5),
    [visibleTasks],
  );

  const upcomingTasks = useMemo(
    () => {
      const deadlineLimit = new Date(today);
      deadlineLimit.setDate(deadlineLimit.getDate() + 7);
      const deadlineLimitString = [
        deadlineLimit.getFullYear(),
        String(deadlineLimit.getMonth() + 1).padStart(2, '0'),
        String(deadlineLimit.getDate()).padStart(2, '0'),
      ].join('-');

      return tasks
        .filter((task) => (
          task.status !== 'Completed'
          && task.dueDate
          && task.dueDate >= todayString
          && task.dueDate <= deadlineLimitString
        ))
        .sort((a, b) => (
          a.dueDate.localeCompare(b.dueDate)
          || (priorityOrder[a.priority] ?? 3) - (priorityOrder[b.priority] ?? 3)
        ))
        .slice(0, 4);
    },
    [tasks, today, todayString],
  );

  const statCards = [
    { label: 'Total tasks', value: stats.total, icon: <Target size={19} />, color: '#38bdf8', tint: 'rgba(56, 189, 248, 0.12)' },
    { label: 'Completed', value: stats.completed, icon: <CheckCircle2 size={19} />, color: '#34d399', tint: 'rgba(52, 211, 153, 0.12)' },
    { label: 'In progress', value: stats.inProgress, icon: <Zap size={19} />, color: '#818cf8', tint: 'rgba(129, 140, 248, 0.14)' },
    { label: 'To do', value: stats.pending, icon: <CircleDashed size={19} />, color: '#fbbf24', tint: 'rgba(251, 191, 36, 0.14)' },
  ];

  return (
    <Container maxWidth="xl" sx={{pt: { xs: 1, md: 1 },
    pb: 3,
    px: { xs: 2, sm: 3 }, }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 1.5, fontWeight: 700 }}>
            YOUR WORKSPACE
          </Typography>
          <Typography component="h1" variant="h4" fontWeight={800} sx={{ letterSpacing: '-0.04em' }}>
            Good to see you <Box component="span" sx={{ color: 'primary.main' }}>back.</Box>
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Here’s a clear view of what’s moving and what needs your attention.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              value={timeRange}
              onChange={(event) => setTimeRange(event.target.value)}
              aria-label="Filter dashboard time range"
              sx={{ borderRadius: 2, bgcolor: 'background.paper' }}
            >
              <MenuItem value="all">All time</MenuItem>
              <MenuItem value="7">Last 7 days</MenuItem>
              <MenuItem value="30">Last 30 days</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={() => navigate('/tasks/new')}
            sx={{ px: 2.25, py: 1.1, borderRadius: 2.5, textTransform: 'none', fontWeight: 700 }}
          >
            Create task
          </Button>
        </Box>
      </Box>

      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          p: { xs: 2.5, sm: 3.5 },
          mb: 3,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 4,
          background: (theme) => theme.palette.mode === 'dark'
            ? 'linear-gradient(115deg, #211d3b 0%, #172d3a 100%)'
            : 'linear-gradient(115deg, #f0edff 0%, #e8f7ff 100%)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ maxWidth: 580 }}>
            <Chip
              icon={<Sparkles size={14} />}
              label="Your productivity snapshot"
              size="small"
              sx={{ mb: 1.5, bgcolor: 'action.hover', fontWeight: 600 }}
            />
            <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: '-0.03em' }}>
              {stats.total === 0 ? 'A fresh start begins here.' : `${stats.completed} ${stats.completed === 1 ? 'task' : 'tasks'} completed. Keep the momentum.`}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.75 }}>
              {stats.total === 0
                ? 'Add a task and turn your plans into progress.'
                : `${stats.total - stats.completed} ${stats.total - stats.completed === 1 ? 'task is' : 'tasks are'} still in your queue.`}
            </Typography>
          </Box>
          <Box sx={{ minWidth: { xs: '100%', sm: 230 }, maxWidth: { sm: 280 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 1 }}>
              <Typography variant="body2" fontWeight={600}>Completion rate</Typography>
              <Typography variant="h5" fontWeight={800} sx={{ color: '#16a87a' }}>{stats.completion}%</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={stats.completion}
              sx={{
                height: 9,
                borderRadius: 8,
                bgcolor: 'action.hover',
                '& .MuiLinearProgress-bar': { borderRadius: 8, bgcolor: '#34d399' },
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              {stats.completed} of {stats.total} tasks completed
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' },
          gap: 2,
          mb: 3,
        }}
      >
        {statCards.map((stat) => (
          <Paper
            key={stat.label}
            elevation={0}
            sx={{ p: { xs: 2, sm: 2.5 }, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>{stat.label}</Typography>
              <Box sx={{ display: 'grid', placeItems: 'center', width: 36, height: 36, borderRadius: 2, color: stat.color, bgcolor: stat.tint }}>
                {stat.icon}
              </Box>
            </Box>
            <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: '-0.04em' }}>{stat.value}</Typography>
          </Paper>
        ))}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.45fr) minmax(300px, 0.85fr)' },
          gap: 2,
          mb: 3,
        }}
      >
        <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, border: '1px solid', borderColor: 'divider', borderRadius: 3, minWidth: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, mb: 2 }}>
            <Box>
              <Typography variant="h6" fontWeight={750}>Task activity</Typography>
              <Typography variant="body2" color="text.secondary">Tasks created over the last 7 days</Typography>
            </Box>
            <Chip label="7 DAYS" size="small" sx={{ fontWeight: 700, letterSpacing: 0.5 }} />
          </Box>
          <Box sx={{ height: 230, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="dashboardActivityFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke={chartGrid} strokeDasharray="4 6" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: chartText, fontSize: 12 }} dy={8} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: chartText, fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Tasks created"
                  stroke="#7c3aed"
                  strokeWidth={3}
                  fill="url(#dashboardActivityFill)"
                  activeDot={{ r: 5, strokeWidth: 0, fill: '#7c3aed' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Paper>

        <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, border: '1px solid', borderColor: 'divider', borderRadius: 3, minWidth: 0 }}>
          <Box sx={{ mb: 1 }}>
            <Typography variant="h6" fontWeight={750}>Workload overview</Typography>
            <Typography variant="body2" color="text.secondary">How your tasks are distributed</Typography>
          </Box>
          <Box sx={{ position: 'relative', height: 166 }}>
            {stats.total > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={52}
                      outerRadius={72}
                      paddingAngle={4}
                      stroke="none"
                    >
                      {statusData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
                <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                  <Typography variant="h5" fontWeight={800}>{stats.total}</Typography>
                  <Typography variant="caption" color="text.secondary">tasks</Typography>
                </Box>
              </>
            ) : (
              <Box sx={{ height: '100%', display: 'grid', placeItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">Add tasks to see your workload</Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 1, mt: 1 }}>
            {statusData.map((item) => (
              <Box key={item.name} sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={750}>{item.value}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.6 }}>
                  <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: item.color }} />
                  <Typography variant="caption" color="text.secondary" noWrap>{item.name}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>

      <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, mb: 2.5 }}>
          <Box>
            <Typography variant="h6" fontWeight={750}>Priority breakdown</Typography>
            <Typography variant="body2" color="text.secondary">Balance your focus across task priorities</Typography>
          </Box>
          <Button size="small" endIcon={<ArrowRight size={15} />} onClick={() => navigate('/tasks')} sx={{ textTransform: 'none', whiteSpace: 'nowrap' }}>
            Manage tasks
          </Button>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' }, gap: { xs: 2, sm: 3 } }}>
          {priorityData.map((item) => {
            const percentage = stats.total ? Math.round((item.value / stats.total) * 100) : 0;
            return (
              <Box key={item.name}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: item.color }} />
                    <Typography variant="body2" fontWeight={650}>{item.name} priority</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">{item.value}</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={percentage}
                  sx={{
                    height: 7,
                    borderRadius: 5,
                    bgcolor: 'action.hover',
                    '& .MuiLinearProgress-bar': { bgcolor: item.color, borderRadius: 5 },
                  }}
                />
              </Box>
            );
          })}
        </Box>
      </Paper>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.5fr) minmax(280px, 0.85fr)' },
          gap: 2,
          alignItems: 'start',
        }}
      >
        <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 2 }}>
            <Box>
              <Typography variant="h6" fontWeight={750}>Recent tasks</Typography>
              <Typography variant="body2" color="text.secondary">A quick look at your latest work</Typography>
            </Box>
            <Button
              size="small"
              endIcon={<ArrowRight size={15} />}
              onClick={() => navigate('/tasks')}
              sx={{ textTransform: 'none', whiteSpace: 'nowrap' }}
            >
              View all
            </Button>
          </Box>
          {recentTasks.length > 0 ? (
            <Box>
              {recentTasks.map((task, index) => (
                <Box
                  key={task.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    py: 1.5,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Box sx={{ width: 9, height: 9, flexShrink: 0, borderRadius: '50%', bgcolor: statusColors[task.status] || '#94a3b8' }} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography fontWeight={650} noWrap>{task.title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {task.category || 'General'}{task.dueDate ? ` · Due ${formatDueDate(task.dueDate)}` : ''}
                    </Typography>
                  </Box>
                  <Chip
                    label={task.status || 'Pending'}
                    size="small"
                    sx={{
                      display: { xs: index > 2 ? 'none' : 'inline-flex', sm: 'inline-flex' },
                      color: statusColors[task.status] || 'text.secondary',
                      bgcolor: `${statusColors[task.status] || '#94a3b8'}1c`,
                      fontWeight: 600,
                    }}
                  />
                  <ArrowUpRight size={16} style={{ color: '#94a3b8', flexShrink: 0 }} />
                </Box>
              ))}
            </Box>
          ) : (
            <Box sx={{ py: 5, textAlign: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
              <CheckCircle2 size={30} style={{ color: '#94a3b8', marginBottom: 8 }} />
              <Typography fontWeight={650}>Nothing on your list yet</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
                Create a task to see your progress take shape.
              </Typography>
              <Button onClick={() => navigate('/tasks/new')} startIcon={<Plus size={16} />} sx={{ textTransform: 'none' }}>
                Create your first task
              </Button>
            </Box>
          )}
        </Paper>

        <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <CalendarClock size={19} style={{ color: '#f59e0b' }} />
            <Typography variant="h6" fontWeight={750}>Coming up</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Deadlines in the next 7 days
          </Typography>
          {upcomingTasks.length > 0 ? (
            <Box>
              {upcomingTasks.map((task) => (
                <Box
                  key={task.id}
                  sx={{ py: 1.5, borderTop: '1px solid', borderColor: 'divider' }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, alignItems: 'flex-start' }}>
                    <Typography fontWeight={650} sx={{ overflowWrap: 'anywhere' }}>{task.title}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                      {task.dueDate === todayString ? 'Today' : formatDueDate(task.dueDate)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.75, color: 'text.secondary' }}>
                    <Clock3 size={13} />
                    <Typography variant="caption">{task.priority || 'Normal'} priority</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Box sx={{ py: 3, borderTop: '1px solid', borderColor: 'divider' }}>
              <Typography variant="body2" color="text.secondary">
                No deadlines coming up. You’re all caught up.
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
}
