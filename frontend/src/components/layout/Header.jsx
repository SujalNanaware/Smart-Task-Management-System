
import React, { useState } from 'react';
import taskFlowLogo from '../../assets/images/TaskFlow logo.png';

import {
  Box,
  Typography,
  IconButton,
  Select,
  MenuItem,
  Tooltip,
  Divider,
  Menu,
} from '@mui/material';

import { useNavigate } from 'react-router-dom';

import {
  LogOut,
  UserRound,
} from 'lucide-react';

import ThemeToggle from './ThemeToggle';

export default function Header({
  darkMode,
  setDarkMode,
  username,
  onLogout,
  language,
  setLanguage,
}) {
  const navigate = useNavigate();

  const [selectedLanguage, setSelectedLanguage] = useState(
    language || 'en'
  );

  const [profileAnchor, setProfileAnchor] = useState(null);

  // Theme colors
  const bg = darkMode ? '#07110d' : '#ffffff';
  const color = darkMode ? '#f0f6f2' : '#1f2937';
  const muted = darkMode ? '#a5b5aa' : '#64756a';
  const border = darkMode ? '#263c30' : '#e2ebe4';
  const softGreen = darkMode ? '#193527' : '#e7f5ec';
  const hoverBg = darkMode ? '#254a35' : '#d5efdf';
  const accentGreen = darkMode ? '#6ee7b7' : '#087f5b';

  const displayName = username?.trim() || 'there';

  // User initials
  const initials =
    displayName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('') || 'U';

  // Language change
  const handleLanguageChange = (event) => {
    const value = event.target.value;

    setSelectedLanguage(value);
    setLanguage?.(value);
  };

  // Shared styling for the language selector
  const selectSx = {
    height: 30,
    minWidth: 30,
    fontSize: 12,
    fontWeight: 600,
    color,
    bgcolor: softGreen,
    borderRadius: '8px',
    boxShadow: 'none',
    transition: 'background-color 0.2s ease',

    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },

    '&:hover': {
      bgcolor: hoverBg,
      boxShadow: 'none',
    },

    '&:hover .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },

    '&.Mui-focused': {
      bgcolor: hoverBg,
      boxShadow: 'none',
    },

    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },

    '& .MuiSelect-icon': {
      color: accentGreen,
      fontSize: 18,
    },

    '& .MuiSelect-select': {
      py: 0.75,
      pl: 1.25,
      pr: '28px !important',
    },
  };

  // Close profile menu
  const closeProfile = () => {
    setProfileAnchor(null);
  };

  // Sign out
  const handleLogout = () => {
    closeProfile();
    onLogout?.();
  };

  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        width: '100%',
        minHeight: 45,
        bgcolor: bg,
        color,
        borderBottom: `1px solid ${border}`,
        boxSizing: 'border-box',
        transition: 'background-color 0.2s ease',
      }}
    >
      {/* Main Header */}
      <Box
        sx={{
          minHeight: 45,
          px: { xs: 1.25, sm: 1.5, md: 2.5 },
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 0.75, sm: 1.5 },
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* TaskFlow Logo */}
        <Box
          component="img"
          src={taskFlowLogo}
          alt="TaskFlow Logo"
          onClick={() => navigate('/dashboard')}
          sx={{
            height: { xs: 30, sm: 38, md: 42 },
            maxWidth: { xs: 100, sm: 145, md: 170 },
            width: 'auto',
            objectFit: 'contain',
            display: 'block',
            flexShrink: 0,
            cursor: 'pointer',
          }}
        />

        {/* Welcome Message */}
        <Typography
          sx={{
            display: { xs: 'none', sm: 'block' },
            fontSize: { sm: 12, md: 14 },
            fontWeight: 600,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            ml: { sm: 1, md: 1.5 },
            mr: 'auto',
            minWidth: 0,
            flex: 1,
          }}
        >
          Welcome to{' '}
          <Box
            component="span"
            sx={{
              color: accentGreen,
              fontWeight: 700,
            }}
          >
            {displayName}
          </Box>
        </Typography>

        {/* Right-Side Controls */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 0.5, sm: 1 },
            flexShrink: 0,
            ml: 'auto',
          }}
        >
          {/* Dark Mode Toggle */}
          <Tooltip
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <Box
              sx={{
                width: 30,
                height: 30,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                bgcolor: softGreen,
                border: 'none',
                outline: 'none',
                borderRadius: '8px',
                transition: 'background-color 0.2s ease',

                '&:hover': {
                  bgcolor: hoverBg,
                },
              }}
            >
              <ThemeToggle
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                className="header-theme-toggle"
                sx={{
                  width: 30,
                  height: 30,
                  minWidth: 30,
                  p: 0,
                  border: 'none',
                  outline: 'none',
                  boxShadow: 'none',
                  borderRadius: '8px',
                  color,
                  bgcolor: 'transparent',
                  transition: 'background-color 0.2s ease',

                  '&:hover': {
                    bgcolor: 'transparent',
                    boxShadow: 'none',
                  },

                  '&.Mui-focusVisible': {
                    outline: `2px solid ${accentGreen}`,
                    outlineOffset: 2,
                  },
                }}
              />
            </Box>
          </Tooltip>

          {/* Language Selector */}
          <Tooltip title="Select language">
            <Select
              value={selectedLanguage}
              onChange={handleLanguageChange}
              size="small"
              inputProps={{
                'aria-label': 'Select language',
              }}
              sx={selectSx}
            >
              <MenuItem value="en">EN</MenuItem>
              <MenuItem value="hi">HI</MenuItem>
            </Select>
          </Tooltip>

          {/* Profile Button */}
          <Tooltip title="Account">
            <IconButton
              aria-label="Account menu"
              onClick={(event) =>
                setProfileAnchor(event.currentTarget)
              }
              sx={{
                width: 30,
                height: 30,
                minWidth: 30,
                p: 0,
                flexShrink: 0,
                border: 'none',
                borderRadius: '8px',
                bgcolor: softGreen,
                color: accentGreen,
                fontSize: 13,
                fontWeight: 700,
                boxShadow: 'none',
                transition: 'background-color 0.2s ease',

                '&:hover': {
                  bgcolor: hoverBg,
                  boxShadow: 'none',
                },

                '&.Mui-focusVisible': {
                  outline: `2px solid ${accentGreen}`,
                  outlineOffset: 2,
                },
              }}
            >
              {initials}
            </IconButton>
          </Tooltip>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={profileAnchor}
          open={Boolean(profileAnchor)}
          onClose={closeProfile}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          slotProps={{
            paper: {
              sx: {
                mt: 1,
                minWidth: 190,
                bgcolor: bg,
                color,
                border: `1px solid ${border}`,
                borderRadius: '9px',
                boxShadow: darkMode
                  ? '0 8px 24px rgba(0,0,0,0.3)'
                  : '0 8px 24px rgba(15,23,42,0.1)',
              },
            },
          }}
        >
          {/* User Information */}
          <MenuItem
            disabled
            sx={{
              opacity: '1 !important',
              cursor: 'default',
            }}
          >
            <UserRound
              size={17}
              style={{
                marginRight: 10,
                flexShrink: 0,
              }}
            />

            <Box>
              <Typography
                fontSize={13}
                fontWeight={600}
                color={color}
              >
                {displayName}
              </Typography>

              <Typography
                fontSize={11}
                color={muted}
              >
                Signed in
              </Typography>
            </Box>
          </MenuItem>

          <Divider sx={{ borderColor: border }} />

          {/* Sign Out */}
          <MenuItem
            onClick={handleLogout}
            sx={{
              color: '#ef4444',
              gap: 1,
              fontSize: 13,
              borderRadius: '6px',
              mx: 0.5,
              my: 0.5,

              '&:hover': {
                bgcolor: darkMode ? '#351b23' : '#fef2f2',
              },
            }}
          >
            <LogOut size={17} />
            Sign out
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
