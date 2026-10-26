
import React, { useState } from 'react';

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
  CheckSquare,
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
  const [organization, setOrganization] = useState('TaskFlow Workspace');
  const [profileAnchor, setProfileAnchor] = useState(null);

  const bg = darkMode ? '#0d1117' : '#ffffff';
  const color = darkMode ? '#f0f6fc' : '#1f2937';
  const muted = darkMode ? '#9ca3af' : '#64748b';
  const border = darkMode ? '#30363d' : '#e5e7eb';
  const softBlue = darkMode ? '#172554' : '#e0efff';
  const iconBlue = '#0969da';

  const displayName = username || 'there';

  const initials =
    displayName
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('') || 'U';

  const handleLanguageChange = (event) => {
    const value = event.target.value;
    setSelectedLanguage(value);
    setLanguage?.(value);
  };

  const selectSx = {
    height: 34,
    fontSize: 12,
    fontWeight: 600,
    color,
    borderRadius: '7px',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'transparent',
    },
    '& .MuiSelect-icon': {
      color: iconBlue,
      fontSize: 18,
    },
    '& .MuiSelect-select': {
      py: 0.75,
      pl: 1.25,
      pr: '28px !important',
    },
  };

  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        height: 50,
        zIndex: 1100,
        width: '100%',
        bgcolor: bg,
        color,
        borderBottom: `1px solid ${border}`,
      }}
    >
      <Box
        sx={{
          minHeight: 56,
          px: { xs: 1.5, md: 2.5 },
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 1, sm: 1.5 },
        }}
      >
        {/* TaskFlow logo */}
        <Box
          onClick={() => navigate('/dashboard')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 40,
            flexShrink: 0,
            cursor: 'pointer',
          }}
        >
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              bgcolor: '#e0f2fe',
              display: 'grid',
              placeItems: 'center',
              border: '2px solid #38bdf8',
            }}
          >
            <CheckSquare size={22} color="#0284c7" />
          </Box>
        </Box>

        

        {/* Welcome message */}
        <Typography
          sx={{
            fontSize: { xs: 12, sm: 14 },
            fontWeight: 600,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            mr: 'auto',
            minWidth: 0,
          }}
        >
          Welcome to {'  '}
          <Box
            component="span"
            sx={{ color: iconBlue, fontWeight: 700 }}
          >
            {displayName}
          </Box>
        </Typography>
        <ThemeToggle
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          className="header-theme-toggle"
          sx={{
            width: 30,
            height: 30,
            borderRadius: '8px',
            color,
            '&:hover': { bgcolor: softBlue },
          }}
        />
        {/* Language */}
        <Select
          value={selectedLanguage}
          onChange={handleLanguageChange}
          size="small"
          inputProps={{ 'aria-label': 'Select language' }}
          sx={{
            ...selectSx,
            width: 30,
            height: 30,
            bgcolor: softBlue,
          }}
        >
          <MenuItem value="en">EN</MenuItem>
          <MenuItem value="hi">HI</MenuItem>
        </Select>

        {/* Profile */}
        <Tooltip title="Account">
          <IconButton
            aria-label="Account menu"
            onClick={(e) => setProfileAnchor(e.currentTarget)}
            sx={{
              width: 36,
              height: 36,
              borderRadius: '8px',
              bgcolor: softBlue,
              color: iconBlue,
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {initials}
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={profileAnchor}
          open={Boolean(profileAnchor)}
          onClose={() => setProfileAnchor(null)}
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
              },
            },
          }}
        >
          <MenuItem disabled sx={{ opacity: '1 !important' }}>
            <UserRound size={17} style={{ marginRight: 10 }} />
            <Box>
              <Typography fontSize={13} fontWeight={600} color={color}>
                {displayName}
              </Typography>
              <Typography fontSize={11} color={muted}>
                Signed in
              </Typography>
            </Box>
          </MenuItem>

          <Divider sx={{ borderColor: border }} />

          <MenuItem
            onClick={() => {
              setProfileAnchor(null);
              onLogout?.();
            }}
            sx={{ color: '#ef4444', gap: 1, fontSize: 13 }}
          >
            <LogOut size={17} />
            Sign out
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
