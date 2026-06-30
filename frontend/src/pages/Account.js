import { useCallback, useEffect, useMemo, useState } from 'react';
import { Container, Grid, Box, Typography, Button, Link, Alert, CircularProgress, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import PaymentHistory from '../components/paymentHistory';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { accountsApi, transactionsApi } from '../services/bankingApi';
import { getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
    capitalizeAccountType,
    computeAccountStats,
    formatBsb,
    formatTransactionForHistory,
} from '../utils/formatters';

function Account() {
    const { accountId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [account, setAccount] = useState(null);
    const [userAccounts, setUserAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionError, setActionError] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [amountDialog, setAmountDialog] = useState(null);
    const [amountValue, setAmountValue] = useState('');
    const [amountDescription, setAmountDescription] = useState('');

    const profilePhone = user?.phone?.trim() || '';
    const payIdLinkedAccount = useMemo(
        () => userAccounts.find((item) => item.payid_phone),
        [userAccounts]
    );
    const isPayIdLinkedHere = Boolean(account?.payid_phone);
    const payIdLinkedElsewhere = payIdLinkedAccount && String(payIdLinkedAccount.id) !== String(accountId);

    const loadAccountData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const [accountResponse, transactionsResponse, accountsResponse] = await Promise.all([
                accountsApi.get(accountId),
                transactionsApi.listByAccount(accountId),
                accountsApi.list(),
            ]);
            setAccount(accountResponse.data);
            setTransactions(transactionsResponse.data);
            setUserAccounts(accountsResponse.data);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, [accountId]);

    useEffect(() => {
        loadAccountData();
    }, [loadAccountData]);

    const stats = computeAccountStats(transactions);
    const transactionItems = transactions.map(formatTransactionForHistory);
    const isPositive = stats.monthlySpending <= stats.moneyIn;

    const handleDelete = async () => {
        setActionLoading(true);
        setActionError('');
        try {
            await accountsApi.delete(accountId);
            navigate('/dashboard');
        } catch (err) {
            setActionError(getErrorMessage(err));
        } finally {
            setActionLoading(false);
        }
    };

    const handleLinkPayId = async () => {
        if (!profilePhone) {
            setActionError('Add a phone number to your profile before linking PayID');
            return;
        }

        setActionLoading(true);
        setActionError('');
        try {
            await accountsApi.setPayId(accountId);
            await loadAccountData();
        } catch (err) {
            setActionError(getErrorMessage(err));
        } finally {
            setActionLoading(false);
        }
    };

    const handleAmountAction = async () => {
        if (!amountValue || !amountDescription) {
            setActionError('Enter an amount and description');
            return;
        }

        setActionLoading(true);
        setActionError('');
        try {
            const payload = {
                account_id: Number(accountId),
                amount: Number(amountValue),
                for: amountDescription,
            };

            if (amountDialog === 'deposit') {
                await transactionsApi.deposit(payload);
            } else {
                await transactionsApi.withdraw(payload);
            }

            setAmountDialog(null);
            setAmountValue('');
            setAmountDescription('');
            await loadAccountData();
        } catch (err) {
            setActionError(getErrorMessage(err));
        } finally {
            setActionLoading(false);
        }
    };

    const renderPayIdSection = () => {
        if (isPayIdLinkedHere) {
            return (
                <Alert severity="success" sx={{ mt: 3 }}>
                    PayID linked to this account: {account.payid_phone}
                </Alert>
            );
        }

        if (!profilePhone) {
            return (
                <Alert severity="info" sx={{ mt: 3 }}>
                    Add a phone number in your{' '}
                    <Link component={RouterLink} to="/profile" sx={{ color: 'inherit', fontWeight: 600 }}>
                        profile
                    </Link>{' '}
                    to link PayID to an account.
                </Alert>
            );
        }

        if (payIdLinkedElsewhere) {
            return (
                <Box sx={{ mt: 3 }}>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        PayID ({payIdLinkedAccount.payid_phone}) is linked to your{' '}
                        {capitalizeAccountType(payIdLinkedAccount.account_type)} account. You can only have one PayID
                        account at a time. Linking here will move PayID to this account.
                    </Alert>
                    <Button variant="contained" onClick={handleLinkPayId} disabled={actionLoading}>
                        {actionLoading ? <CircularProgress size={20} color="inherit" /> : 'Move PayID to this account'}
                    </Button>
                </Box>
            );
        }

        return (
            <Box sx={{ mt: 3 }}>
                <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                    Link your profile phone number ({profilePhone}) as PayID for this account.
                </Typography>
                <Button variant="contained" onClick={handleLinkPayId} disabled={actionLoading}>
                    {actionLoading ? <CircularProgress size={20} color="inherit" /> : 'Link PayID to account'}
                </Button>
            </Box>
        );
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !account) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error">{error || 'Account not found'}</Alert>
            </Container>
        );
    }

    return (
        <>
            <Box minWidth="100%" minHeight="80%" sx={{ bgcolor: "#004BBD", position: "absolute", zIndex: -1 }} />

            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Link component={RouterLink} to="/dashboard" sx={{ display: "flex", gap: 1, color: "#91D0D7", cursor: "pointer" }}>
                    <ArrowBackIcon />
                    Back to dashboard
                </Link>

                {actionError && <Alert severity="error" sx={{ mt: 3 }}>{actionError}</Alert>}

                <Box sx={{ color: "#F5F5F5", mb: 8, mt: 4 }}>
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                            {capitalizeAccountType(account.account_type)}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 3, flexWrap: 'wrap' }}>
                            <Typography><strong>BSB:</strong> {formatBsb(account.bsb)}</Typography>
                            <Typography><strong>Account number:</strong> {account.account_number}</Typography>
                        </Box>
                    </Box>

                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box minWidth="100%" sx={{ bgcolor: "#1F61C5", borderRadius: '12px', p: 4 }}>
                                <Typography variant="h7" sx={{ fontWeight: 600 }}>Balance</Typography>
                                <Typography variant="h5" sx={{ fontSize: "2rem", fontWeight: 700, mt: 1, mb: 1 }}>
                                    ${Number(account.balance).toFixed(2)}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    {isPositive ? <TrendingUpIcon sx={{ fontSize: 16, color: '#22c55e' }} /> : <TrendingDownIcon sx={{ fontSize: 16, color: '#ef4444' }} />}
                                    <Typography variant="caption" sx={{ color: isPositive ? '#22c55e' : '#ef4444', fontWeight: 500 }}>
                                        This month
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box minWidth="100%" sx={{ bgcolor: "#1F61C5", borderRadius: '12px', p: 3 }}>
                                <Typography variant="h7" sx={{ fontWeight: 600 }}> Money in</Typography>
                                <Typography variant="h5" sx={{ fontSize: "1.5rem", fontWeight: 500, mt: 1, color: '#22c55e' }}>
                                    +${stats.moneyIn.toFixed(2)}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box minWidth="100%" sx={{ bgcolor: "#1F61C5", borderRadius: '12px', p: 3 }}>
                                <Typography variant="h7" sx={{ fontWeight: 600 }}> Money out</Typography>
                                <Typography variant="h5" sx={{ fontSize: "1.5rem", fontWeight: 500, mt: 1, color: '#ef4444' }}>
                                    -${stats.moneyOut.toFixed(2)}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap' }}>
                        <Button variant="contained" onClick={() => setAmountDialog('deposit')} disabled={actionLoading}>
                            Deposit
                        </Button>
                        <Button variant="outlined" sx={{ color: '#fff', borderColor: '#fff' }} onClick={() => setAmountDialog('withdraw')} disabled={actionLoading}>
                            Withdraw
                        </Button>
                        <Button variant="outlined" sx={{ color: '#fff', borderColor: '#fff' }} onClick={handleDelete} disabled={actionLoading}>
                            Delete account
                        </Button>
                    </Box>

                    {renderPayIdSection()}
                </Box>

                <Box sx={{
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    border: '1px solid #f0f0f0',
                    backgroundColor: '#FFFFFF',
                    mb: 5
                }}>
                    <Box sx={{ borderBottom: '1px solid #f0f0f0', pb: 2, padding: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>Recent Transactions</Typography>
                        <Typography variant="caption" sx={{ color: '#999' }}>{capitalizeAccountType(account.account_type)}</Typography>
                    </Box>
                    {transactionItems.length === 0 ? (
                        <Box sx={{ p: 3 }}>
                            <Typography color="text.secondary">No transactions yet</Typography>
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
            </Container>

            <Dialog open={Boolean(amountDialog)} onClose={() => setAmountDialog(null)} maxWidth="xs" fullWidth>
                <DialogTitle>{amountDialog === 'deposit' ? 'Deposit funds' : 'Withdraw funds'}</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Amount"
                        value={amountValue}
                        onChange={(e) => setAmountValue(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="For"
                        value={amountDescription}
                        onChange={(e) => setAmountDescription(e.target.value)}
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAmountDialog(null)}>Cancel</Button>
                    <Button variant="contained" onClick={handleAmountAction} disabled={actionLoading}>
                        {actionLoading ? <CircularProgress size={20} /> : 'Confirm'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default Account;
