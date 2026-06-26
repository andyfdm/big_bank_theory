import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CardActionArea, Card } from '@mui/material';

function AccountCard(props) {
    const accountColors = {
        checking: '#1976d2',
        savings: '#22c55e',
        holidays: '#9333ea',
        creditcard: '#ea580c',
        car: '#0891b2'
    };

    const getColorForAccount = (name, index) => {
        const typeMap = {
            'Checking': 'checking',
            'Savings': 'savings',
            'Holidays': 'holidays',
            'Credit Card': 'creditcard',
            'Car': 'car'
        };
        const type = typeMap[name] || Object.values(accountColors)[index % 5];
        return Object.values(accountColors)[index % 5];
    };

    const navigate = useNavigate();

    if (props.type === "new") {
        return (
            <Card sx={{
                        minWidth: 200,
                        background: 'white',
                        border: '2px dashed #e5e7eb',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '140px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            borderColor: '#1976d2',
                            backgroundColor: '#f0f7ff'
                        }
                    }}>
                <CardActionArea onClick={props.onClick} sx={{display: 'flex', flexDirection: 'column', width: '100%', height: '100%'}}>
                    <AddIcon sx={{ fontSize: 32, color: '#1976d2', mb: 1 }} />
                    <Typography variant="body2" sx={{ color: '#666' }}>Add new account</Typography>
                </CardActionArea>
            </Card>
        );
    } else {
        const cardColor = getColorForAccount(props.name, props.index);
        return (
            <Box className="account-card" 
            onClick={() => navigate('/account')}
            sx={{
                minWidth: 200,
                background: cardColor,
                borderRadius: '12px',
                padding: '24px',
                color: 'white',
                minHeight: '140px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer'
            }}>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>{props.name}</Typography>
                <Typography variant="h5" sx={{ fontSize: '24px', fontWeight: 700 }}>${Number(props.balance).toFixed(2)}</Typography>
            </Box>
        );
    }
}

export default AccountCard;