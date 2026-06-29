import { format } from 'date-fns';

const TRANSACTION_TYPE_MAP = {
  deposit: 'salary',
  spend: 'shopping',
  withdraw: 'fuel',
  transfer_in: 'transfer',
  transfer_out: 'transfer',
  payid_in: 'transfer',
  payid_out: 'transfer',
};

const INCOMING_TYPES = new Set(['deposit', 'transfer_in', 'payid_in']);

export function capitalizeAccountType(accountType) {
  if (!accountType) return 'Account';
  return accountType.charAt(0).toUpperCase() + accountType.slice(1);
}

export function formatAccountForCard(account, index) {
  return {
    key: account.id,
    name: capitalizeAccountType(account.account_type),
    balance: account.balance,
    index,
  };
}

export function formatTransactionForHistory(transaction) {
  const amount = Number(transaction.amount);
  const isIncoming = INCOMING_TYPES.has(transaction.transaction_type);
  const category = transaction.transaction_type.replace(/_/g, ' ');

  return {
    name: transaction.description,
    type: TRANSACTION_TYPE_MAP[transaction.transaction_type] || 'salary',
    category: category.charAt(0).toUpperCase() + category.slice(1),
    date: format(new Date(transaction.created_at), 'd MMM, yyyy'),
    amount: `${isIncoming ? '+' : '-'}$${Math.abs(amount).toFixed(2)}`,
  };
}

export function computeDashboardStats(accounts, transactions) {
  const totalBalance = accounts.reduce((sum, account) => sum + Number(account.balance), 0);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  let monthlyIncome = 0;
  let monthlySpending = 0;

  transactions.forEach((transaction) => {
    const createdAt = new Date(transaction.created_at);
    if (createdAt < monthStart) return;

    const amount = Number(transaction.amount);
    if (INCOMING_TYPES.has(transaction.transaction_type)) {
      monthlyIncome += amount;
    } else {
      monthlySpending += amount;
    }
  });

  return [
    {
      title: 'Total Balance',
      amount: `$${totalBalance.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: '',
      isPositive: true,
    },
    {
      title: 'Monthly Income',
      amount: `$${monthlyIncome.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: '',
      isPositive: monthlyIncome > 0,
    },
    {
      title: 'Monthly Spending',
      amount: `$${monthlySpending.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: '',
      isPositive: false,
    },
  ];
}

export function formatBsb(bsb) {
  if (!bsb || bsb.length !== 6) return bsb;
  return `${bsb.slice(0, 3)}-${bsb.slice(3)}`;
}

export function accountToSelectOption(account) {
  return {
    id: account.id,
    label: capitalizeAccountType(account.account_type),
    sub: `BSB: ${formatBsb(account.bsb)} Acc: ${account.account_number}`,
  };
}
