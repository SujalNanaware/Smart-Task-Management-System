
import React from 'react';

import { Box, Tooltip } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  LayoutDashboard,
  CheckCircle,
  BarChart3,
  CalendarDays,
  Users,
  Settings,
} from 'lucide-react';

export default function Sidebar({ darkMode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const bg = darkMode ? '#0d1117' : '#ffffff';
  const border = darkMode ? '#30363d' : '#edf0f4';
  const iconColor = darkMode ? '#9198a1' : '#9ca3af';
  const activeBg = darkMode ? '#172554' : '#dceeff';
  const hoverBg = darkMode ? '#161b22' : '#f1f5f9';

  const items = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard size={19} />,
    },
    {
      title: 'My Tasks',
      path: '/tasks',
      icon: <CheckCircle size={19} />,
    },
    {
      title: 'Analytics',
      path: '/analytics',
      icon: <BarChart3 size={19} />,
    },
    {
      title: 'Calendar',
      path: '/calendar',
      icon: <CalendarDays size={19} />,
    },
    {
      title: 'Team',
      path: '/team',
      icon: <Users size={19} />,
    },
    {
      title: 'Settings',
      path: '/settings',
      icon: <Settings size={19} />,
    },
  ];

  const isActive = (path) =>
    location.pathname === path ||
    (path === '/tasks' && location.pathname.startsWith('/tasks/'));

  return (
    <Box
      component="aside"
      aria-label="Main sidebar"
      sx={{
        position: 'fixed',
        top: 56,
        left: 0,
        bottom: 0,
        zIndex: 1000,
        width: 55,
        bgcolor: bg,
        borderRight: `1px solid ${border}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: { xs: 1.5, sm: 2.5 },
        gap: { xs: 0.75, sm: 1.25 },
        overflowY: 'auto',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
        transition: 'background-color 0.2s ease, width 0.2s ease',
        '@media (max-height: 520px)': {
          pt: 1,
          gap: 0.5,
        },
      }}
    >
      {items.map((item) => {
        const active = isActive(item.path);

        return (
          <Tooltip
            key={item.path}
            title={item.title}
            placement="right"
            arrow
          >
            <Box
              component="button"
              type="button"
              aria-label={item.title}
              aria-current={active ? 'page' : undefined}
              onClick={() => navigate(item.path)}
              sx={{
                width: { xs: 40, sm: 42 },
                height: { xs: 40, sm: 42 },
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                bgcolor: active ? activeBg : 'transparent',
                color: active ? '#0878ee' : iconColor,
                transition: 'all 0.18s ease',
                '@media (max-height: 520px)': {
                  width: 36,
                  height: 36,
                },
                '&:hover': {
                  bgcolor: active ? activeBg : hoverBg,
                  color: active
                    ? '#0878ee'
                    : darkMode
                      ? '#f0f6fc'
                      : '#475569',
                },
              }}
            >
              {item.icon}
            </Box>
          </Tooltip>
        );
      })}
    </Box>
  );
}
