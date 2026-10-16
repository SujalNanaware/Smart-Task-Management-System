import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Paper, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError(true);
      return;
    }
    navigate('/login');
  };

  return (
    <Container maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '85vh' }}>
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box sx={{ display: 'inline-flex', p: 1.5, bgcolor: 'rgba(124, 58, 237, 0.15)', color: '#a78bfa', borderRadius: '50%', mb: 1.5 }}>
            <UserPlus size={28} />
          </Box>
          <Typography variant="h5" fontWeight="bold">Create Account</Typography>
          <Typography variant="body2" sx={{ opacity: 0.7, mt: 0.5 }}>Sign up to start managing your tasks</Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>Please fill in all fields.</Alert>}

        <Box component="form" onSubmit={handleRegister}>
          <TextField 
            fullWidth label="Full Name" margin="normal" variant="outlined"
            value={name} onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField 
            fullWidth label="Email Address" margin="normal" variant="outlined"
            value={email} onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField 
            fullWidth label="Password" type="password" margin="normal" variant="outlined"
            value={password} onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Button 
            type="submit" variant="contained" fullWidth size="large"
            sx={{ bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' }, fontWeight: 'bold', py: 1.4, borderRadius: 2 }}
          >
            Register
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}