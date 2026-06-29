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
import { payIdApi, transactionsApi } from "../services/bankingApi";
import { getErrorMessage } from "../services/api";
import { accountToSelectOption } from "../utils/formatters";

const MODE_TITLES = {
  account: "Pay via account",
  payid: "Pay via PayID",
  transfer: "Transfer between accounts",
};

const DEFAULT_RECIPIENTS = [
  { label: "Mia Lee", sub: "0412 937 584" },
  { label: "Alex Wong", sub: "0400 000 000" },
];

function PayPopup({ open, onClose, mode = "payid", accounts = [], onPaymentComplete }) {
  const [fromAccount, setFromAccount] = useState("");
  const [toContact, setToContact] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lookupName, setLookupName] = useState("");

  const accountOptions = useMemo(
    () => accounts.map(accountToSelectOption),
    [accounts]
  );

  const transferTargets = useMemo(
    () => accountOptions.filter((option) => option.id !== fromAccount?.id),
    [accountOptions, fromAccount]
  );

  const resetForm = () => {
    setFromAccount("");
    setToContact("");
    setToAccount("");
    setAmount("");
    setDescription("");
    setLookupName("");
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const normalizePhone = (phone) => phone.replace(/\s/g, "");

  const handleRecipientChange = async (recipient) => {
    setToContact(recipient);
    setLookupName("");
    if (!recipient || mode !== "payid") return;

    try {
      const { data } = await payIdApi.lookup({ phone: normalizePhone(recipient.sub) });
      setLookupName(data.recipient_name);
    } catch {
      setLookupName("");
    }
  };

  const handlePay = async () => {
    if (!fromAccount || !amount || !description) {
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
      if (mode === "payid") {
        if (!toContact) {
          setError('Please select a recipient');
          return;
        }
        await payIdApi.pay({
          from_account_id: fromAccount.id,
          phone: normalizePhone(toContact.sub),
          amount: Number(amount),
          for: description,
        });
      } else if (mode === "account") {
        await transactionsApi.spend({
          account_id: fromAccount.id,
          amount: Number(amount),
          for: description,
        });
      } else if (mode === "transfer") {
        if (!toAccount) {
          setError('Please select a destination account');
          return;
        }
        await transactionsApi.transfer({
          from_account_id: fromAccount.id,
          to_account_id: toAccount.id,
          amount: Number(amount),
          for: description,
        });
      }

      resetForm();
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
      onClose={handleClose}
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
        <Box display="flex" justifyContent="space-between" mb={3}>
          <Typography variant="h6" fontWeight={600}>
            {MODE_TITLES[mode] || MODE_TITLES.payid}
          </Typography>

          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Typography mb={1}>From</Typography>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <Select
            value={fromAccount}
            displayEmpty
            onChange={(e) => {
              setFromAccount(e.target.value);
              setToAccount("");
            }}
            disabled={loading || !accountOptions.length}
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
            {accountOptions.map((option) => (
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

        {mode === "transfer" && (
          <>
            <Typography mb={1}>To</Typography>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <Select
                value={toAccount}
                displayEmpty
                onChange={(e) => setToAccount(e.target.value)}
                disabled={loading || !fromAccount}
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
                {transferTargets.map((option) => (
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
          </>
        )}

        {mode === "payid" && (
          <>
            <Typography mb={1}>To</Typography>
            <FormControl fullWidth sx={{ mb: lookupName ? 1 : 3 }}>
              <Select
                value={toContact}
                displayEmpty
                onChange={(e) => handleRecipientChange(e.target.value)}
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
            {lookupName && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Verified recipient: {lookupName}
              </Typography>
            )}
          </>
        )}

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
            onClick={handleClose}
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
