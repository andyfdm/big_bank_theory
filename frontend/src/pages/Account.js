import { Container, Grid, Box, Typography, Button, Link } from '@mui/material';
import PaymentHistory from '../components/paymentHistory';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link as RouterLink } from 'react-router-dom';


function Account(props) {

    // mock data
    const isPositive = true;
    const change = 4;

    const transactions = [
        { name: 'Salary Deposit', type: 'salary', category: 'Income', date: '9 Jun, 2026', amount: '+$2,000.00' },
        { name: 'Woolworths', type: 'shopping', category: 'Grocery', date: '9 Jun, 2026', amount: '-$92.15' },
        { name: 'Shell Petrol Station', type: 'fuel', category: 'Petrol', date: '8 Jun, 2026', amount: '-$51.93' },
        { name: 'Amazon', type: 'shopping', category: 'Shopping', date: '8 Jun, 2026', amount: '-$132.97' },
        { name: 'Transfer Mia Lee food', type: 'transfer', category: 'Income', date: '8 Jun, 2026', amount: '+$50.00' }
    ];

    return (
        <>
            {/* background */}
            <Box minWidth="100%" minHeight="80%" sx={{bgcolor: "#004BBD", position: "absolute",  zIndex: -1}}></Box>
            
            <Container maxWidth="lg" sx={{py: 4}}>

                <Link component={RouterLink} to="/dashboard" sx={{display: "flex", gap: 1, color: "#91D0D7", cursor: "pointer"}}>
                    <ArrowBackIcon/>
                    Back to dashboard
                </Link>

                {/* account details */}
                <Box sx={{color: "#F5F5F5", mb: 8, mt: 4}}>
                    <Box sx={{mb: 4}}>
                        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1}}>Savings</Typography>
                        <Box sx={{display: "flex", gap: 3}}>
                            <Typography><strong>BSB:</strong> 123456</Typography>
                            <Typography><strong>Account number:</strong> 123456</Typography>
                        </Box>
                    </Box>

                    {/* account money stats */}
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box minWidth= "100%" sx={{bgcolor: "#1F61C5", borderRadius: '12px', p:4}}>
                                <Typography variant="h7" sx={{ fontWeight: 600}}> Monthly spending</Typography>
                                <Typography variant="h5" sx={{ fontSize:"2rem", fontWeight: 700, mt: 1, mb: 1 }}>$1,500.00</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    {isPositive ? <TrendingUpIcon sx={{ fontSize: 16, color: '#22c55e'}}/> : <TrendingDownIcon sx={{ fontSize: 16, color: '#ef4444'}}/>}
                                    <Typography variant="caption" sx={{ color: isPositive ? '#22c55e' : '#ef4444', fontWeight: 500 }}>
                                        {change} from last month
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box minWidth= "100%" sx={{bgcolor: "#1F61C5", borderRadius: '12px', p:3}}>
                                <Typography variant="h7" sx={{ fontWeight: 600}}> Money in</Typography>
                                <Typography variant="h5" sx={{ fontSize:"1.5rem", fontWeight: 500, mt: 1, color: '#22c55e'}}>+$1,500.00</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box minWidth= "100%" sx={{bgcolor: "#1F61C5", borderRadius: '12px', p:3}}>
                                <Typography variant="h7" sx={{ fontWeight: 600}}> Money out</Typography>
                                <Typography variant="h5" sx={{ fontSize:"1.5rem", fontWeight: 500, mt: 1, color: '#ef4444' }}>-$1,500.00</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

                {/* account transaction history */}
                    <Box sx={{
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                        border: '1px solid #f0f0f0',
                        backgroundColor: '#FFFFFF',
                        mb: 5
                    }}>
                        <Box sx={{borderBottom: '1px solid #f0f0f0', pb: 2, padding: 3}}>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>Recent Transactions</Typography>
                            <Typography variant="caption" sx={{ color: '#999' }}>All Accounts</Typography>
                        </Box>
                        {transactions.map((transaction, index) => (
                            <PaymentHistory
                                key={index}
                                name={transaction.name}
                                type={transaction.type}
                                category={transaction.category}
                                date={transaction.date}
                                amount={transaction.amount}
                            />
                        ))}
                    </Box>
            </Container>
        </>
    )

}

export default Account