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
import { useAuth } from '../context/AuthContext';
import './auth.css';

function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signup, loading } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.phone) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    const result = await signup({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      phone: formData.phone
    });

    if (result.success) {
      navigate('/verify-2fa-signup');
    } else {
      setError(result.error || 'Signup failed');
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
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, fontSize: { xs: '24px', md: '32px' } }}>Create Your Account</Typography>
          <Typography variant="body2" sx={{ color: '#999' }}>Join FDM Bank and secure your finances</Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="First Name"
            name="firstNmae"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            // disabled={loading}
            placeholder="John Doe"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px'
              }
            }}
          />
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            disabled={loading}
            placeholder="John Doe"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px'
              }
            }}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            disabled={loading}
            placeholder="your@email.com"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px'
              }
            }}
          />
          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            disabled={loading}
            placeholder="+1234567890"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px'
              }
            }}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            disabled={loading}
            placeholder="••••••••"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px'
              }
            }}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            disabled={loading}
            placeholder="••••••••"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px'
              }
            }}
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              textTransform: 'none',
              fontSize: '16px',
              backgroundColor: '#0891b2',
              '&:hover': { backgroundColor: '#0e7490' }
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Create account'}
          </Button>
        </form>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2">
            Already have an account?{' '}
            <MuiLink
              onClick={() => navigate('/login')}
              sx={{ cursor: 'pointer', color: '#0891b2', textDecoration: 'none' }}
            >
              Sign In
            </MuiLink>
          </Typography>
        </Box>
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

export default Signup;
