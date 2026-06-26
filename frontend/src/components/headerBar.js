import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import './headerBar.css';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ContrastIcon from '@mui/icons-material/Contrast';
// import { useAuth } from '../context/AuthContext';

function HeaderBar() {
    // const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    // const location = useLocation();

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
        setIsMenuOpen(true);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setIsMenuOpen(false);
    };

    const handleProfileClick = () => {
        handleMenuClose();
        navigate('/profile');
    };

    const handleDashboardClick = () => {
        navigate('/dashboard');
    };

    const handleLogout = () => {
        handleMenuClose();
        // logout();
        navigate('/login');
    };

    return (
        <header className="header-bar">
            <Button 
                onClick={handleDashboardClick}
                sx={{ 
                    textDecoration: 'none',
                    color: 'inherit',
                    fontSize: '24px',
                    fontWeight: 700,
                    '&:hover': { opacity: 0.8 }
                }}
            >
                FDM Bank
            </Button>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <FormGroup sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <ContrastIcon sx={{ mr: 1 }} />
                    <FormControlLabel control={<Switch />} 
                    // label="Dark Mode" 
                    />
                </FormGroup>
                <Button onClick={handleMenuOpen}>
                {/* Welcome, <strong>{user?.name || 'Customer'}</strong> */}
                    Welcome, <strong>Customer</strong>
                {isMenuOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </Button>
            </Box>
            <Menu
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={handleMenuClose}
                PaperProps={{
                    style: {
                        width: anchorEl?.offsetWidth,
                    },
                }}
            >
                <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </header>
    );
}

export default HeaderBar;