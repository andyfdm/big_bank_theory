import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import './auth.css';

function Verify2FA({ isSignup = false }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { verifyEmail, loading, pendingEmail } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!code || code.length !== 6) {
      setError('Please enter the 6-digit verification code');
      return;
    }

    const result = await verifyEmail(code);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Verification failed');
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
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
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, fontSize: { xs: '24px', md: '32px' } }}>
            {isSignup ? 'Verify your email' : 'Verify your identity'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#999' }}>
            Enter the 6-digit code sent to {pendingEmail || 'your email'}
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Verification code"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            margin="normal"
            variant="outlined"
            disabled={loading}
            placeholder="123456"
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
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
              py: 1.5,
              textTransform: 'none',
              fontSize: '16px',
              backgroundColor: '#0891b2',
              '&:hover': { backgroundColor: '#0e7490' }
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Verify'}
          </Button>
        </form>
      </Box>

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

export default Verify2FA;
