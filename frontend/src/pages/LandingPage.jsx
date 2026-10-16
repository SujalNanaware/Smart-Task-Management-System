import React from 'react';
import { Container, Typography, Button, Box, Grid, Paper, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, TrendingUp, Zap, ListChecks, ShieldCheck, Sparkles, Star } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: '#0f172a', color: '#fff', minHeight: '100vh', overflowX: 'hidden' }}>
      
      {/* 1. Hero Section */}
      <Container maxWidth="md" sx={{ textAlign: 'center', pt: 12, pb: 10 }}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 0.5, mb: 3, bgcolor: 'rgba(124, 58, 237, 0.1)', border: '1px solid #7c3aed', borderRadius: 5, color: '#a78bfa', fontSize: '0.85rem', fontWeight: 'bold' }}>
          <Sparkles size={16} /> Next-Gen Task Management System
        </Box>
        <Typography 
          variant="h2" 
          fontWeight="bold" 
          gutterBottom 
          sx={{ 
            background: 'linear-gradient(45deg, #38bdf8, #818cf8)', 
            backgroundClip: 'text', 
            textFillColor: 'transparent', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            mb: 3
          }}
        >
          Manage Your Tasks Smart & Effortlessly
        </Typography>
        <Typography variant="h6" sx={{ color: '#94a3b8', mb: 5, maxWidth: 700, mx: 'auto', lineHeight: 1.6 }}>
          TaskFlow helps you organize, track, and complete your daily tasks with a modern, high-performance UI and real-time productivity analytics.
        </Typography>
        <Button 
          variant="contained" 
          size="large" 
          onClick={() => navigate('/dashboard')}
          sx={{ 
            bgcolor: '#7c3aed', 
            '&:hover': { bgcolor: '#6d28d9', transform: 'translateY(-2px)' }, 
            px: 5, 
            py: 1.8, 
            fontWeight: 'bold', 
            fontSize: '1rem', 
            borderRadius: 2,
            transition: 'all 0.3s ease'
          }}
        >
          Get Started
        </Button>
      </Container>

      {/* 2. Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" fontWeight="bold" align="center" gutterBottom sx={{ mb: 2 }}>
          Powerful Features for Peak Productivity
        </Typography>
        <Typography variant="body1" align="center" sx={{ color: '#94a3b8', mb: 6 }}>
          Everything you need to keep your projects and personal workflow on track.
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4, bgcolor: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: 3, height: '100%', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', borderColor: '#38bdf8' } }}>
              <Box sx={{ color: '#38bdf8', mb: 2 }}><CheckCircle2 size={32} /></Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>Smart Task Tracking</Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.6 }}>
                Easily categorize tasks by priority, set due dates, and track completion status in real-time.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4, bgcolor: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: 3, height: '100%', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', borderColor: '#818cf8' } }}>
              <Box sx={{ color: '#818cf8', mb: 2 }}><TrendingUp size={32} /></Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>Analytics & Insights</Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.6 }}>
                Visualize your performance with dynamic charts and progress metrics to stay ahead of deadlines.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4, bgcolor: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: 3, height: '100%', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', borderColor: '#34d399' } }}>
              <Box sx={{ color: '#34d399', mb: 2 }}><Zap size={32} /></Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>Lightning Fast UI</Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.6 }}>
                Built with React and Material-UI for a smooth, responsive experience across all your devices.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* 3. How It Works Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" fontWeight="bold" align="center" gutterBottom sx={{ mb: 6 }}>
          How It Works
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Box sx={{ width: 60, height: 60, mx: 'auto', mb: 2, bgcolor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 'bold', fontSize: '1.25rem' }}>1</Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>Create an Account</Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>Sign up quickly and access your personalized task control panel.</Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Box sx={{ width: 60, height: 60, mx: 'auto', mb: 2, bgcolor: 'rgba(129, 140, 248, 0.1)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 'bold', fontSize: '1.25rem' }}>2</Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>Add & Organize Tasks</Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>Set priorities, categories, and due dates to keep your work structured.</Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Box sx={{ width: 60, height: 60, mx: 'auto', mb: 2, bgcolor: 'rgba(52, 211, 153, 0.1)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 'bold', fontSize: '1.25rem' }}>3</Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>Track & Complete</Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>Monitor progress using visual analytics and mark items done as you go.</Typography>
          </Grid>
        </Grid>
      </Container>

      {/* 4. Testimonials Section */}
      <Container maxWidth="lg" sx={{ py: 8, mb: 8 }}>
        <Typography variant="h4" fontWeight="bold" align="center" gutterBottom sx={{ mb: 6 }}>
          What Our Users Say
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, bgcolor: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', color: '#fbbf24', mb: 2, gap: 0.5 }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#fbbf24" />)}
              </Box>
              <Typography variant="body1" sx={{ color: '#cbd5e1', mb: 3, fontStyle: 'italic' }}>
                "TaskFlow completely changed how I organize my daily development sprints. The UI is clean, lightning fast, and incredibly intuitive."
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#7c3aed' }}>SN</Avatar>
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">Sujal Nanaware</Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>Software Developer</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, bgcolor: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', color: '#fbbf24', mb: 2, gap: 0.5 }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#fbbf24" />)}
              </Box>
              <Typography variant="body1" sx={{ color: '#cbd5e1', mb: 3, fontStyle: 'italic' }}>
                "The analytics dashboard and priority filtering make managing multiple college projects and internship tasks a breeze!"
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#38bdf8' }}>AK</Avatar>
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">Aniket K.</Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>IT Student & Intern</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

    </Box>
  );
}