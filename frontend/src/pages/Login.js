import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Link as MuiLink
} from '@mui/material';
// import { useAuth } from '../context/AuthContext';
import './auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  // const { login, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/verify-2fa');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left Side - Form */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: { xs: '30px 20px', md: '40px 60px' },
        backgroundColor: '#fff'
      }}>
        <Typography variant="h5" sx={{ mb: 1, fontWeight: 700 }}>FDM Bank</Typography>
        <Box sx={{ mb: 5 }}>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, fontSize: { xs: '24px', md: '32px' } }}>Sign in to FDM Online Banking</Typography>
          <Typography variant="body2" sx={{ color: '#999' }}>Protecting you one step at a time</Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            variant="outlined"
            // disabled={loading}
            placeholder="your@email.com"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px'
              }
            }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            variant="outlined"
            // disabled={loading}
            placeholder="••••••••"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px'
              }
            }}
          />

          <Box sx={{ mt: 1, mb: 3 }}>
            <MuiLink href="#" sx={{ color: '#0891b2', textDecoration: 'none', fontSize: '14px' }}>
              Forgot your password?
            </MuiLink>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              onClick={() => navigate('/dashboard')}
              // disabled={loading}
              sx={{
                py: 1.5,
                textTransform: 'none',
                fontSize: '16px',
                backgroundColor: '#0891b2',
                '&:hover': { backgroundColor: '#0e7490' }
              }}
            >
              {/* {loading ? <CircularProgress size={24} /> : 'Login'} */}
              Login
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/signup')}
              // disabled={loading}
              sx={{
                py: 1.5,
                textTransform: 'none',
                fontSize: '16px',
                borderColor: '#0891b2',
                color: '#0891b2'
              }}
            >
              Sign up
            </Button>
          </Box>
        </form>
      </Box>

      {/* Right Side - Decorative Pattern */}
      <Box sx={{
        flex: 1,
        background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
        display: { xs: 'none', md: 'block' },
        position: 'relative',
        overflow: 'hidden'
      }} />
    </Box>
  );
}

export default Login;
