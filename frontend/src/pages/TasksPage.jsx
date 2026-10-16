import React, { useState } from 'react';
import { Container, Typography, TextField, Grid, Card, CardContent, Button, Box, Chip, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Trash2, Calendar, CheckSquare } from 'lucide-react';

export default function TasksPage({ tasks, onDelete }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Container sx={{ py: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" fontWeight="bold">My Tasks</Typography>
        <Button variant="contained" startIcon={<Plus size={16} />} onClick={() => navigate('/tasks/new')} sx={{ bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' } }}>
          Add Task
        </Button>
      </Box>

      {/* Search & Filter */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <TextField 
          placeholder="Search tasks..." 
          variant="outlined" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <Search size={18} style={{ marginRight: 8, opacity: 0.7 }} /> }}
          sx={{ flexGrow: 1 }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Grid */}
      <Grid container spacing={3}>
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <Grid item xs={12} md={4} key={task.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Chip label={task.category} size="small" />
                    <Chip label={task.priority} color={task.priority === 'High' ? 'error' : 'warning'} size="small" />
                  </Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>{task.title}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.7, mb: 2 }}>{task.desc}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.85rem' }}>
                    <Calendar size={14} /> Due: {task.dueDate}
                  </Box>
                </CardContent>
                <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip label={task.status} variant="outlined" size="small" />
                  <Button size="small" onClick={() => onDelete(task.id)} color="error" sx={{ minWidth: 'auto' }}><Trash2 size={16} /></Button>
                </Box>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12} sx={{ textAlign: 'center', py: 8 }}>
            <CheckSquare size={48} style={{ opacity: 0.3, marginBottom: 8 }} />
            <Typography variant="h6" sx={{ opacity: 0.7 }}>No tasks found</Typography>
            <Typography variant="body2" sx={{ opacity: 0.5, mb: 3 }}>Get started by creating your first task!</Typography>
            <Button variant="contained" onClick={() => navigate('/tasks/new')} sx={{ bgcolor: '#7c3aed' }}>
              Create Task
            </Button>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}