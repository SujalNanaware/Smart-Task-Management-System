
import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { CheckSquare } from 'lucide-react';

export default function Footer({ darkMode }) {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: darkMode ? '#0d1117' : '#ffffff',
        color: darkMode ? '#9198a1' : '#64748b',
        borderTop: '1px solid',
        borderColor: darkMode ? '#30363d' : '#e5e7eb',
        py: 1.25,
        mt: 'auto',
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          px: { xs: 2, md: 3 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        {/* Logo and brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <CheckSquare
            size={17}
            color={darkMode ? '#38bdf8' : '#7054e8'}
          />

          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 700,
              color: darkMode ? '#f0f6fc' : '#29283e',
            }}
          >
            TaskFlow
          </Typography>

          <Typography
            component="span"
            sx={{
              fontSize: 12,
              color: darkMode ? '#64748b' : '#cbd5e1',
              mx: 0.5,
            }}
          >
            |
          </Typography>

          <Typography sx={{ fontSize: 11.5 }}>
            Smart task management
          </Typography>
        </Box>

        {/* Copyright */}
        <Typography
          sx={{
            fontSize: 11.5,
            textAlign: { xs: 'left', sm: 'right' },
          }}
        >
          © {currentYear} TaskFlow. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
