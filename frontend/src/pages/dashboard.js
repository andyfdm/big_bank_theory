import { Container, Grid, Box, Typography, CircularProgress, Alert } from '@mui/material';
import AccountCard from "../components/accountCard";
import PayCard from "../components/payCard";
import StatCard from "../components/statCard";
import PaymentHistory from "../components/paymentHistory";
import AlertsComponent from "../components/AlertsComponent";
import { useCallback, useEffect, useState } from 'react';
import PayPopup from '../components/PayPopup';
import CreateAccountPopup from '../components/CreateAccountPopup';
import { homeApi } from '../services/bankingApi';
import { getErrorMessage } from '../services/api';
import {
    computeDashboardStats,
    formatAccountForCard,
    formatTransactionForHistory,
} from '../utils/formatters';

function Dashboard() {
    const [payPopupOpen, setPayPopupOpen] = useState(false);
    const [createAccountPopupOpen, setCreateAccountPopupOpen] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadHomeData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const { data } = await homeApi.getHome();
            setAccounts(data.accounts);
            setTransactions(data.recent_transactions);
            setStats(computeDashboardStats(data.accounts, data.recent_transactions));
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadHomeData();
    }, [loadHomeData]);

    const accountCards = accounts.map((account, index) => formatAccountForCard(account, index));
    const transactionItems = transactions.map(formatTransactionForHistory);

    return (
        <Container maxWidth="lg" sx={{ py: 4, px: 30 }}>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {/* Pay Actions */}
            <Grid container spacing={3} sx={{ mb: 5, gap: 3, ml: 1, mt: 2 }}>
                <PayCard name="Pay via account" icon="bsb" onClick={() => setPayPopupOpen(true)}/>
                <PayCard name="Pay via PayID" icon="bsb" onClick={() => setPayPopupOpen(true)}/>
                <PayCard name="Transfer between accounts" icon="bsb" onClick={() => setPayPopupOpen(true)}/>
            </Grid>
            <PayPopup
                open={payPopupOpen}
                onClose={() => setPayPopupOpen(false)}
                accounts={accounts}
                onPaymentComplete={loadHomeData}
            />

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
                    {loading ? (
                        <CircularProgress size={28} />
                    ) : (
                        <>
                            {accountCards.map((account) => (
                                <AccountCard
                                    key={account.key}
                                    name={account.name}
                                    balance={account.balance}
                                    index={account.index}
                                />
                            ))}
                            <AccountCard type="new" onClick={() => setCreateAccountPopupOpen(true)}/>
                        </>
                    )}
                </Box>
                <CreateAccountPopup
                    open={createAccountPopupOpen}
                    onClose={() => setCreateAccountPopupOpen(false)}
                    onAccountCreated={loadHomeData}
                />
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
                        {loading ? (
                            <Box sx={{ p: 3 }}>
                                <CircularProgress size={24} />
                            </Box>
                        ) : (
                            transactionItems.map((transaction, index) => (
                                <PaymentHistory
                                    key={index}
                                    name={transaction.name}
                                    type={transaction.type}
                                    category={transaction.category}
                                    date={transaction.date}
                                    amount={transaction.amount}
                                />
                            ))
                        )}
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
