import { Box, Typography } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import SendIcon from '@mui/icons-material/Send';
import "./paymentHistory.css";

const getIconAndColor = (type) => {
    const icons = {
        salary: { icon: AccountBalanceIcon, color: '#22c55e', bg: '#dcfce7' },
        shopping: { icon: ShoppingCartIcon, color: '#3b82f6', bg: '#dbeafe' },
        fuel: { icon: LocalGasStationIcon, color: '#f59e0b', bg: '#fef3c7' },
        transfer: { icon: SendIcon, color: '#d946ef', bg: '#fce7f3' }
    };
    return icons[type] || icons.salary;
};

function PaymentHistory({ name = 'Salary Deposit', type = 'salary', category = 'Income', date = '9 Jun, 2026', amount = '+$2,000.00' }) {
    const iconData = getIconAndColor(type);
    const Icon = iconData.icon;
    const isPositive = amount.startsWith('+');

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            borderBottom: '1px solid #f0f0f0'
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '8px',
                    backgroundColor: iconData.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Icon sx={{ color: iconData.color, fontSize: 20 }} />
                </Box>
                <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#000' }}>{name}</Typography>
                    <Typography variant="caption" sx={{ color: '#999' }}>{category} • {date}</Typography>
                </Box>
            </Box>
            <Typography variant="body2" sx={{
                fontWeight: 600,
                color: isPositive ? '#22c55e' : '#ef4444'
            }}>
                {amount}
            </Typography>
        </Box>
    );
}

export default PaymentHistory;