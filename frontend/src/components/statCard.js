import { Box, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import "./statCard.css";

function StatCard({ title = 'Total Balance', amount = '$11,385.32', change = '+4%', isPositive = true }) {
    return (
        <Box sx={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            border: '1px solid #f0f0f0'
        }}>
            <Typography variant="body2" sx={{ color: '#999', mb: 1 }}>{title}</Typography>
            <Typography variant="h5" sx={{ fontSize: '24px', fontWeight: 700, mb: 1 }}>{amount}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {isPositive ? <TrendingUpIcon sx={{ fontSize: 16, color: '#22c55e'}}/> : <TrendingDownIcon sx={{ fontSize: 16, color: '#ef4444'}}/>}
                <Typography variant="caption" sx={{ color: isPositive ? '#22c55e' : '#ef4444', fontWeight: 500 }}>
                    {change} from last month
                </Typography>
            </Box>
        </Box>
    );
}

export default StatCard;