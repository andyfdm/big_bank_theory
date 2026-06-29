import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { payIdApi } from "../services/bankingApi";
import { getErrorMessage } from "../services/api";
import { accountToSelectOption } from "../utils/formatters";

const DEFAULT_RECIPIENTS = [
  { label: "Mia Lee", sub: "0412937584" },
  { label: "Alex Wong", sub: "0400000000" },
];

function PayPopup({ open, onClose, accounts = [], onPaymentComplete }) {
  const [fromAccount, setFromAccount] = useState("");
  const [toContact, setToContact] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const accountOptions = useMemo(
    () => (accounts.length ? accounts.map(accountToSelectOption) : []),
    [accounts]
  );

  const fallbackAccountOptions = [
    {
      id: "checking",
      label: "Checking",
      sub: "BSB: 123-456 Acc: 48394714",
    },
    {
      id: "savings",
      label: "Savings",
      sub: "BSB: 987-654 Acc: 11112222",
    },
  ];

  const fromOptions = accountOptions.length ? accountOptions : fallbackAccountOptions;

  const handlePay = async () => {
    if (!fromAccount || !toContact || !amount || !description) {
      setError('Please complete all payment fields');
      return;
    }

    if (!accountOptions.length) {
      setError('No accounts available for payment');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await payIdApi.pay({
        from_account_id: fromAccount.id,
        phone_number: toContact.sub.replace(/\s/g, ''),
        amount: Number(amount),
        description,
      });
      setAmount('');
      setDescription('');
      setFromAccount('');
      setToContact('');
      onPaymentComplete?.();
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 2
        }
      }}
    >
      <DialogContent>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" mb={3}>
          <Typography variant="h6" fontWeight={600}>
            Pay via PayID
          </Typography>

          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* FROM DROPDOWN */}
        <Typography mb={1}>From</Typography>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <Select
            value={fromAccount}
            displayEmpty
            onChange={(e) => setFromAccount(e.target.value)}
            disabled={loading}
            renderValue={(selected) => {
              if (!selected) {
                return <Typography color="text.secondary">Select account</Typography>;
              }
              return (
                <>
                    {selected.label}
                     <Typography variant="body2" color="text.secondary">
                        {selected.sub}
                     </Typography>
                </>
            );
            }}
            sx={{
              borderRadius: 2,
              backgroundColor: "#fafafa",
              p: 1.5
            }}
          >
            {fromOptions.map((option) => (
              <MenuItem key={option.id} value={option}>
                <Box>
                  <Typography fontWeight={600}>{option.label}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {option.sub}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* TO DROPDOWN */}
        <Typography mb={1}>To</Typography>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <Select
            value={toContact}
            displayEmpty
            onChange={(e) => setToContact(e.target.value)}
            disabled={loading}
            renderValue={(selected) => {
              if (!selected) {
                return <Typography color="text.secondary">Select recipient</Typography>;
              }
              return (
                <>
                    {selected.label}
                    <Typography color="text.secondary">{selected.sub}</Typography>
                </>
                );
            }}
            sx={{
              borderRadius: 2,
              backgroundColor: "#fafafa",
              p: 1.5
            }}
          >
            {DEFAULT_RECIPIENTS.map((recipient) => (
              <MenuItem key={recipient.sub} value={recipient}>
                <Box>
                  <Typography fontWeight={600}>{recipient.label}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {recipient.sub}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Amount */}
        <Typography mb={1}>Amount</Typography>
        <TextField
          fullWidth
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={loading}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">$</InputAdornment>
            ),
            sx: { borderRadius: "20px" }
          }}
        />

        {/* For */}
        <Typography mb={1}>For</Typography>
        <TextField
          fullWidth
          placeholder="Reason, label , etc."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
          sx={{ mb: 4 }}
          InputProps={{
            sx: { borderRadius: "20px" }
          }}
        />

        {/* Buttons */}
        <Box display="flex" gap={2}>
          <Button
            fullWidth
            variant="contained"
            onClick={handlePay}
            disabled={loading}
            sx={{
              textTransform: "none",
              borderRadius: 3,
              bgcolor: "#86c5cc",
              "&:hover": { bgcolor: "#6fb1b8" }
            }}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : 'Pay now'}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            onClick={onClose}
            disabled={loading}
            sx={{
              textTransform: "none",
              borderRadius: 3,
              borderColor: "#86c5cc",
              color: "#86c5cc"
            }}
          >
            Pay later
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default PayPopup;
