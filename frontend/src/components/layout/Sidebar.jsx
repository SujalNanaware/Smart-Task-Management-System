
import React from 'react';

import { Box, Tooltip } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  PanelsTopLeft,
  ListTodo,
  ChartNoAxesCombined,
  CalendarRange,
  Network,
  SlidersHorizontal,
} from 'lucide-react';

export default function Sidebar({ darkMode }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Theme colors
  const bg = darkMode ? '#07110d' : '#ffffff';
  const border = darkMode ? '#263c30' : '#e2ebe4';
  const iconColor = darkMode ? '#94a69a' : '#738479';
  const activeColor = darkMode ? '#6ee7b7' : '#087f5b';
  const activeBg = darkMode ? '#193527' : '#e7f5ec';
  const hoverBg = darkMode ? '#1b3024' : '#f0f8f2';

  // New modern icon collection
  const items = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: PanelsTopLeft,
    },
    {
      title: 'My Tasks',
      path: '/tasks',
      icon: ListTodo,
    },
    {
      title: 'Analytics',
      path: '/analytics',
      icon: ChartNoAxesCombined,
    },
    {
      title: 'Calendar',
      path: '/calendar',
      icon: CalendarRange,
    },
    {
      title: 'Team',
      path: '/team',
      icon: Network,
    },
    {
      title: 'Settings',
      path: '/settings',
      icon: SlidersHorizontal,
    },
  ];

  // Detect current route
  const isActive = (path) =>
    location.pathname === path ||
    (path === '/tasks' &&
      location.pathname.startsWith('/tasks/'));

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

        width: { xs: 48, sm: 54 },
        bgcolor: bg,
        borderRight: `1px solid ${border}`,

        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: { xs: 1.5, sm: 2.25 },
        gap: { xs: 0.75, sm: 1 },

        overflowY: 'auto',
        overflowX: 'hidden',
        boxSizing: 'border-box',
        scrollbarWidth: 'none',

        '&::-webkit-scrollbar': {
          display: 'none',
        },

        transition: 'background-color 0.2s ease',

        '@media (max-height: 520px)': {
          pt: 1,
          gap: 0.5,
        },
      }}
    >
      {items.map((item) => {
        const active = isActive(item.path);
        const Icon = item.icon;

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
                position: 'relative',

                width: { xs: 33, sm: 36 },
                height: { xs: 33, sm: 36 },
                flexShrink: 0,
                p: 0,

                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',

                color: active ? activeColor : iconColor,
                bgcolor: active ? activeBg : 'transparent',

                border: 'none',
                outline: 'none',
                borderRadius: '10px',
                cursor: 'pointer',

                transition:
                  'background-color 0.2s ease, color 0.2s ease, transform 0.2s ease',

                // Active indicator
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: { xs: -7, sm: -8 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '3px',
                  height: active ? '18px' : 0,
                  borderRadius: '0 4px 4px 0',
                  bgcolor: activeColor,
                  transition: 'height 0.2s ease',
                },

                // Hover
                '&:hover': {
                  bgcolor: active ? activeBg : hoverBg,
                  color: active
                    ? activeColor
                    : darkMode
                      ? '#e5eee8'
                      : '#26382c',
                  transform: 'scale(1.04)',
                },

                // Keyboard accessibility
                '&:focus-visible': {
                  outline: `2px solid ${activeColor}`,
                  outlineOffset: 2,
                },

                // Compact screens
                '@media (max-height: 520px)': {
                  width: 29,
                  height: 29,
                },
              }}
            >
              <Icon
                size={18}
                strokeWidth={active ? 2.1 : 1.7}
                absoluteStrokeWidth
              />
            </Box>
          </Tooltip>
        );
      })}
    </Box>
  );
}
