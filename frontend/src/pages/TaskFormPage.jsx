import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Paper, Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

export default function TaskFormPage({ onAdd }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('Frontend');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;

    // Call shared add function passed from App.jsx
    onAdd({ title, desc, category, priority, dueDate: dueDate || '2026-11-01' });
    navigate('/tasks');
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <PlusCircle color="#7c3aed" size={28} />
          <Typography variant="h5" fontWeight="bold">Create New Task</Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField 
            label="Task Title" fullWidth required 
            value={title} onChange={(e) => setTitle(e.target.value)} 
          />
          <TextField 
            label="Description" fullWidth multiline rows={3} 
            value={desc} onChange={(e) => setDesc(e.target.value)} 
          />
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select value={category} label="Category" onChange={(e) => setCategory(e.target.value)}>
              <MenuItem value="Frontend">Frontend</MenuItem>
              <MenuItem value="Backend">Backend</MenuItem>
              <MenuItem value="Database">Database</MenuItem>
              <MenuItem value="Security">Security</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select value={priority} label="Priority" onChange={(e) => setPriority(e.target.value)}>
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>
          <TextField 
            label="Due Date" type="date" fullWidth InputLabelProps={{ shrink: true }}
            value={dueDate} onChange={(e) => setDueDate(e.target.value)} 
          />
          <Button type="submit" variant="contained" size="large" sx={{ bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' }, py: 1.5, fontWeight: 'bold' }}>
            Save Task
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}