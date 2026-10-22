import React from 'react';
import { Container, Typography, Grid, Paper, useTheme } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

const data = [
  { name: 'Pending', count: 4 },
  { name: 'In Progress', count: 3 },
  { name: 'Completed', count: 5 },
];

const priorityData = [
  { name: 'High', value: 4 },
  { name: 'Medium', value: 5 },
  { name: 'Low', value: 3 },
];

const COLORS = ['#f87171', '#fbbf24', '#34d399'];

export default function AnalyticsPage() {
  const theme = useTheme();
  const chartText = theme.palette.text.secondary;
  const chartGrid = theme.palette.divider;
  const tooltipBackground = theme.palette.background.paper;

  return (
    <Container sx={{ py: 6, color: 'text.primary' }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 4 }}>Task Analytics & Insights</Typography>
      
      <Grid container spacing={4}>
        {/* Bar Chart */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 4, bgcolor: 'background.paper', color: 'text.primary', border: '1px solid', borderColor: 'divider', borderRadius: 3, height: 400 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>Tasks Status Breakdown</Typography>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} />
                <XAxis dataKey="name" stroke={chartText} />
                <YAxis stroke={chartText} />
                <Tooltip contentStyle={{ backgroundColor: tooltipBackground, borderColor: chartGrid, color: theme.palette.text.primary }} />
                <Bar dataKey="count" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 4, bgcolor: 'background.paper', color: 'text.primary', border: '1px solid', borderColor: 'divider', borderRadius: 3, height: 400, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ width: '100%', textAlign: 'left' }}>Tasks by Priority</Typography>
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie data={priorityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: tooltipBackground, borderColor: chartGrid, color: theme.palette.text.primary }} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}