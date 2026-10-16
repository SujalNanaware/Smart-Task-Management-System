import React from 'react';
import { Container, Typography, Grid, Paper, Box, Button, LinearProgress, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, Clock, AlertCircle, Plus, ArrowRight, Sparkles, Flame, CheckCircle } from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  
  // Set all metrics to 0 for a clean fresh start
  const totalTasks = 0;
  const completedTasks = 0;
  const pendingTasks = 0;
  const inProgressTasks = 0;
  const completionPercentage = 0;

  const recentTasks = []; // Empty recent tasks list

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      
      {/* Welcome Banner */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          mb: 5, 
          background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(56, 189, 248, 0.15) 100%)', 
          border: '1px solid rgba(124, 58, 237, 0.3)', 
          borderRadius: 4, 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 3
        }}
      >
        <Box>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.5, mb: 1.5, bgcolor: 'rgba(124, 58, 237, 0.2)', borderRadius: 4, color: '#c084fc', fontSize: '0.75rem', fontWeight: 'bold' }}>
            <Sparkles size={14} /> Workspace Active
          </Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Welcome back, Creator! 👋
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            You have completed <strong style={{ color: '#34d399' }}>{completedTasks} out of {totalTasks}</strong> tasks today. Let's get started!
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<Plus size={18} />} 
          onClick={() => navigate('/tasks/new')} 
          sx={{ 
            bgcolor: '#7c3aed', 
            '&:hover': { bgcolor: '#6d28d9' }, 
            px: 3, 
            py: 1.2,
            fontWeight: 'bold',
            borderRadius: 2.5
          }}
        >
          New Task
        </Button>
      </Paper>

      {/* Stats Cards Grid */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, borderRadius: 3, position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ color: '#38bdf8', mb: 1.5, display: 'inline-block', p: 1, bgcolor: 'rgba(56, 189, 248, 0.1)', borderRadius: 2 }}><CheckSquare size={22} /></Box>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5 }}>{totalTasks}</Typography>
            <Typography variant="body2" sx={{ opacity: 0.7, fontWeight: 500 }}>Total Tasks</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, borderRadius: 3, position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ color: '#34d399', mb: 1.5, display: 'inline-block', p: 1, bgcolor: 'rgba(52, 211, 153, 0.1)', borderRadius: 2 }}><CheckCircle size={22} /></Box>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5 }}>{completedTasks}</Typography>
            <Typography variant="body2" sx={{ opacity: 0.7, fontWeight: 500 }}>Completed</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, borderRadius: 3, position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ color: '#fbbf24', mb: 1.5, display: 'inline-block', p: 1, bgcolor: 'rgba(251, 191, 36, 0.1)', borderRadius: 2 }}><Clock size={22} /></Box>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5 }}>{pendingTasks}</Typography>
            <Typography variant="body2" sx={{ opacity: 0.7, fontWeight: 500 }}>Pending</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, borderRadius: 3, position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ color: '#818cf8', mb: 1.5, display: 'inline-block', p: 1, bgcolor: 'rgba(129, 140, 248, 0.1)', borderRadius: 2 }}><Flame size={22} /></Box>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5 }}>{inProgressTasks}</Typography>
            <Typography variant="body2" sx={{ opacity: 0.7, fontWeight: 500 }}>In Progress</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* Progress Bar Widget */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 4, borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">Productivity Goal</Typography>
              <Typography variant="h6" fontWeight="bold" sx={{ color: '#34d399' }}>{completionPercentage}%</Typography>
            </Box>
            <LinearProgress variant="determinate" value={completionPercentage} sx={{ height: 12, borderRadius: 6, mb: 3 }} />
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              🚀 Add your first task to start tracking your productivity metrics!
            </Typography>
          </Paper>
        </Grid>

        {/* Recent Task Snapshot */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, borderRadius: 3, minHeight: 200, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">Recent Tasks</Typography>
              <Button size="small" endIcon={<ArrowRight size={14} />} onClick={() => navigate('/tasks')} sx={{ color: '#38bdf8', textTransform: 'none' }}>
                View All
              </Button>
            </Box>
            {recentTasks.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* mapped tasks here */}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4, opacity: 0.6 }}>
                <CheckSquare size={32} style={{ marginBottom: 6, opacity: 0.5 }} />
                <Typography variant="body2">No recent tasks found.</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}