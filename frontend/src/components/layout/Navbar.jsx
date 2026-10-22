import React from 'react';
import { Box, Typography, Button, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckSquare, LayoutDashboard, CheckCircle, BarChart3, PlusCircle, LogOut, Sun, Moon } from 'lucide-react';

export default function Sidebar({ darkMode, setDarkMode, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { title: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { title: 'My Tasks', path: '/tasks', icon: <CheckCircle size={20} /> },
    { title: 'Analytics', path: '/analytics', icon: <BarChart3 size={20} /> },
  ];

  return (
    <Box 
      sx={{ 
        width: 260, 
        bgcolor: darkMode ? '#090d16' : '#ffffff', 
        borderRight: '1px solid',
        borderColor: darkMode ? '#1e293b' : '#e2e8f0',
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh',
        position: 'sticky',
        top: 0,
        left: 0,
        flexShrink: 0
      }}
    >
      {/* App Branding */}
      <Box 
        sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: darkMode ? '#1e293b' : '#e2e8f0' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
          <CheckSquare color="#38bdf8" size={26} />
          <Typography variant="h6" fontWeight="bold" sx={{ color: darkMode ? '#fff' : '#0f172a' }}>
            Task<span style={{ color: '#38bdf8' }}>Flow</span>
          </Typography>
        </Box>
        {/* Dark/Light Mode Button */}
        <Button 
          onClick={() => setDarkMode(!darkMode)} 
          sx={{ minWidth: 'auto', p: 1, borderRadius: 2, color: darkMode ? '#fbbf24' : '#64748b' }}
          title="Toggle Theme"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
      </Box>

      {/* Navigation Menu List */}
      <List sx={{ px: 2, py: 3, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.title} disablePadding sx={{ mb: 1 }}>
              <ListItemButton 
                onClick={() => navigate(item.path)}
                sx={{ 
                  borderRadius: 2, 
                  bgcolor: isActive ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                  color: isActive ? '#38bdf8' : (darkMode ? '#94a3b8' : '#475569'),
                  '&:hover': { bgcolor: 'rgba(56, 189, 248, 0.05)', color: '#38bdf8' },
                  py: 1.2,
                  px: 2
                }}
              >
                <ListItemIcon sx={{ color: isActive ? '#38bdf8' : (darkMode ? '#94a3b8' : '#475569'), minWidth: 38 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.title} 
                  primaryTypographyProps={{ fontWeight: isActive ? 'bold' : 'medium', fontSize: '0.95rem' }} 
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Bottom Quick Action Button */}
      <Box sx={{ p: 3, borderTop: '1px solid', borderColor: darkMode ? '#1e293b' : '#e2e8f0' }}>
        <Button 
          variant="contained" 
          fullWidth
          startIcon={<PlusCircle size={18} />}
          onClick={() => navigate('/tasks/new')}
          sx={{ 
            bgcolor: '#7c3aed', 
            '&:hover': { bgcolor: '#6d28d9' }, 
            fontWeight: 'bold', 
            py: 1.2,
            borderRadius: 2,
            textTransform: 'none'
          }}
        >
          New Task
        </Button>
        <Button
          fullWidth
          startIcon={<LogOut size={18} />}
          onClick={onLogout}
          sx={{
            mt: 1,
            color: darkMode ? '#94a3b8' : '#475569',
            textTransform: 'none',
          }}
        >
          Sign Out
        </Button>
      </Box>
    </Box>
  );
}