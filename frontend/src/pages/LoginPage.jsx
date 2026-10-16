import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Paper, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LogIn, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError(true);
      return;
    }
    // Simulate successful login and redirect to dashboard
    navigate('/dashboard');
  };

  return (
    <Container maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '80vh', color: '#fff' }}>
      <Paper sx={{ p: 4, bgcolor: '#1e293b', border: '1px solid #334155', borderRadius: 3, boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box sx={{ display: 'inline-flex', p: 1.5, bgcolor: 'rgba(124, 58, 237, 0.15)', color: '#a78bfa', borderRadius: '50%', mb: 1.5 }}>
            <LogIn size={28} />
          </Box>
          <Typography variant="h5" fontWeight="bold">Welcome Back</Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>Sign in to continue to TaskFlow</Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>Please fill in all fields.</Alert>}

        <Box component="form" onSubmit={handleLogin}>
          <TextField 
            fullWidth label="Email Address" margin="normal" variant="outlined"
            value={email} onChange={(e) => setEmail(e.target.value)}
            InputLabelProps={{ style: { color: '#94a3b8' } }}
            InputProps={{ style: { color: '#fff', backgroundColor: '#0f172a' } }}
            sx={{ mb: 2 }}
          />
          <TextField 
            fullWidth label="Password" type="password" margin="normal" variant="outlined"
            value={password} onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={{ style: { color: '#94a3b8' } }}
            InputProps={{ style: { color: '#fff', backgroundColor: '#0f172a' } }}
            sx={{ mb: 3 }}
          />
          <Button 
            type="submit" variant="contained" fullWidth size="large"
            sx={{ bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' }, fontWeight: 'bold', py: 1.4, borderRadius: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}