import { Container, Grid, Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AccountCard from "../components/accountCard";
import PayCard from "../components/payCard";
import StatCard from "../components/statCard";
import PaymentHistory from "../components/paymentHistory";
import AlertsComponent from "../components/AlertsComponent";
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import PayPopup from '../components/PayPopup';
import CreateAccountPopup from '../components/CreateAccountPopup';

function Dashboard() {
    // const { user } = useAuth();
    const [payPopupOpen, setPayPopupOpen] = useState(false);
    const [CreateAccountPopupOpen, setCreateAccountPopupOpen] = useState(false);

    // Mock data for stats
    const stats = [
        { title: 'Total Balance', amount: '$11,385.31', change: '+4%', isPositive: true },
        { title: 'Monthly Income', amount: '$1,462.01', change: '-12%', isPositive: false },
        { title: 'Monthly Spending', amount: '$531.87', change: '+8%', isPositive: true }
    ];

    // Mock transaction data
    const transactions = [
        { name: 'Salary Deposit', type: 'salary', category: 'Income', date: '9 Jun, 2026', amount: '+$2,000.00' },
        { name: 'Woolworths', type: 'shopping', category: 'Grocery', date: '9 Jun, 2026', amount: '-$92.15' },
        { name: 'Shell Petrol Station', type: 'fuel', category: 'Petrol', date: '8 Jun, 2026', amount: '-$51.93' },
        { name: 'Amazon', type: 'shopping', category: 'Shopping', date: '8 Jun, 2026', amount: '-$132.97' },
        { name: 'Transfer Mia Lee food', type: 'transfer', category: 'Income', date: '8 Jun, 2026', amount: '+$50.00' }
    ];

    return (
        <Container maxWidth="lg" sx={{ py: 4, px: 30 }}>
            {/* Pay Actions */}
            <Grid container spacing={3} sx={{ mb: 5, gap: 3, ml: 1, mt: 2 }}>
                <PayCard name="Pay via account" icon="bsb" onClick={() => setPayPopupOpen(true)}/>
                <PayCard name="Pay via PayID" icon="bsb" onClick={() => setPayPopupOpen(true)}/>
                <PayCard name="Transfer between accounts" icon="bsb" onClick={() => setPayPopupOpen(true)}/>
            </Grid>
            <PayPopup open={payPopupOpen} onClose={() => setPayPopupOpen(false)} />

            {/* Accounts Section */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Accounts</Typography>
                </Box>
                <Box sx={{
                    display: 'flex',
                    gap: 2, overflowX: 'auto',
                    scrollbarWidth: 'none', '&::-webkit-scrollbar': {display: 'none'},
                    maxWidth: '100%',
                    paddingBottom: 1,
                    paddingRight: 1
                }}>
                    <AccountCard key='1' name='checking' balance='5000' index='2'/>
                    <AccountCard key='1' name='checking' balance='5000' index='2'/> 
                    <AccountCard key='1' name='checking' balance='5000' index='2'/> 
                    <AccountCard key='1' name='checking' balance='5000' index='2'/> 
                    <AccountCard key='1' name='checking' balance='5000' index='2'/> 
                    <AccountCard key='1' name='checking' balance='5000' index='2'/> 
                    <AccountCard type="new" onClick={() => setCreateAccountPopupOpen(true)}/>
                </Box>
                <CreateAccountPopup open={CreateAccountPopupOpen} onClose={() => setCreateAccountPopupOpen(false)} />
            </Box>

            {/* Statistics Cards */}
            <Box sx={{ mb: 4 }}>
                <Grid container spacing={3}>
                    {stats.map((stat, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <StatCard
                                title={stat.title}
                                amount={stat.amount}
                                change={stat.change}
                                isPositive={stat.isPositive}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Transactions and Alerts */}
            <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={8}>
                    <Box sx={{
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                        border: '1px solid #f0f0f0'
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
                </Grid>

                <Grid item xs={12} md={6}>
                    <AlertsComponent />
                </Grid>
            </Grid>
        </Container>
    );
}

export default Dashboard;