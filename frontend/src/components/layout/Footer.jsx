import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { CheckSquare } from 'lucide-react';

export default function Footer() {
  return (
    <Box sx={{ bgcolor: '#0f172a', color: '#94a3b8', borderTop: '1px solid #334155', py: 6, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between" alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <CheckSquare color="#38bdf8" size={22} />
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#fff' }}>
                TaskFlow
              </Typography>
            </Box>
            <Typography variant="body2">
              Your smart task management system for peak daily productivity and effortless tracking.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Typography variant="body2">
              © {new Date().getFullYear()} TaskFlow. All rights reserved.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}