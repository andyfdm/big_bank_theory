import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Avatar,
  Link as MuiLink
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import { useAuth } from '../context/AuthContext';
import './Profile.css';

function Profile() {
  // const { user, updateProfile, logout } = useAuth();
  const user = {}
  // const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '123 Maple Street, Sydney, NSW, 2000'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!formData.name || !formData.email || !formData.phone) {
        setError('Please fill in all required fields');
        return;
      }

      const result = updateProfile(formData);
      
      if (result.success) {
        setSuccess('Profile updated successfully');
        setIsEditing(false);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>

      {/* Title */}
      <Box sx={{ textAlign: 'center', mb: 4, mt: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Profile settings</Typography>
        <Typography variant="body2" sx={{ color: '#999' }}>Manage your personal information and security</Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

      {/* Profile Card */}
      <Card sx={{ p: { xs: 2, md: 4 }, mb: 3, border: '1px solid #f0f0f0', borderRadius: '12px' }}>
        {/* User Info Section */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              margin: '0 auto',
              mb: 2,
              fontSize: 32,
              backgroundColor: '#1976d2'
            }}
          >
            {user?.name?.charAt(0) || 'U'}
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>{user?.name}</Typography>
          <Typography variant="caption" sx={{ color: '#999' }}>Member since January 2020</Typography>
        </Box>

        {/* Edit Button */}
        {!isEditing && (
          <Box sx={{ textAlign: 'right', mb: 3 }}>
            <Button
              startIcon={<EditIcon />}
              onClick={() => setIsEditing(true)}
              variant="outlined"
              size="small"
            >
              Edit
            </Button>
          </Box>
        )}

        {/* Form */}
        <form onSubmit={handleSave}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ color: '#999', mb: 1 }}>Email</Typography>
            <TextField
              fullWidth
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing || loading}
              variant={isEditing ? "outlined" : "standard"}
              inputProps={{ style: { fontSize: '16px' } }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ color: '#999', mb: 1 }}>Phone number</Typography>
            <TextField
              fullWidth
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing || loading}
              variant={isEditing ? "outlined" : "standard"}
              inputProps={{ style: { fontSize: '16px' } }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ color: '#999', mb: 1 }}>Address</Typography>
            <TextField
              fullWidth
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={!isEditing || loading}
              variant={isEditing ? "outlined" : "standard"}
              inputProps={{ style: { fontSize: '16px' } }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ color: '#999', mb: 1 }}>Password</Typography>
            <TextField
              fullWidth
              type="password"
              value="••••••••••••"
              disabled
              variant="standard"
              inputProps={{ style: { fontSize: '16px' } }}
            />
          </Box>

          {isEditing && (
            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Save Changes'}
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<CancelIcon />}
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    name: user?.name || '',
                    email: user?.email || '',
                    phone: user?.phone || '',
                    address: user?.address || ''
                  });
                }}
                disabled={loading}
              >
                Cancel
              </Button>
            </Box>
          )}
        </form>
      </Card>
    </Container>
  );
}

export default Profile;
