import React, { useState } from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { CheckSquare } from 'lucide-react';

export default function Footer({ darkMode }) {
  const [currentYear] = useState(() => new Date().getFullYear());

  return (
    <Box sx={{
      bgcolor: darkMode ? '#0b1220' : '#ffffff',
      color: darkMode ? '#94a3b8' : '#70758a',
      borderTop: '1px solid',
      borderColor: darkMode ? '#263247' : '#e8eaf0',
      py: 5,
      mt: 'auto',
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between" alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <CheckSquare color={darkMode ? '#38bdf8' : '#7054e8'} size={22} />
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: darkMode ? '#fff' : '#29283e' }}>
                TaskFlow
              </Typography>
            </Box>
            <Typography variant="body2">
              Your smart task management system for peak daily productivity and effortless tracking.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Typography variant="body2">
              © {currentYear} TaskFlow. All rights reserved.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}