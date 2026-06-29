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
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { payIdApi, transactionsApi } from "../services/bankingApi";
import { getErrorMessage } from "../services/api";
import { accountToSelectOption, capitalizeAccountType } from "../utils/formatters";

const MODE_TITLES = {
  account: "Pay via account",
  payid: "Pay via PayID",
  transfer: "Transfer between accounts",
};

function PayPopup({ open, onClose, mode = "payid", accounts = [], onPaymentComplete }) {
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [payIdStep, setPayIdStep] = useState("lookup");
  const [searchPhone, setSearchPhone] = useState("");
  const [recipient, setRecipient] = useState(null);

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
    setToAccount("");
    setAmount("");
    setDescription("");
    setError("");
    setPayIdStep("lookup");
    setSearchPhone("");
    setRecipient(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const normalizePhone = (phone) => phone.replace(/\s/g, "");

  const handleSearchPayId = async () => {
    const phone = normalizePhone(searchPhone);
    if (!phone || phone.length < 8) {
      setError("Enter a valid phone number to search");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const { data } = await payIdApi.lookup({ phone });
      setRecipient(data);
      setPayIdStep("confirm");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmRecipient = () => {
    setPayIdStep("payment");
    setError("");
  };

  const handleBackFromConfirm = () => {
    setPayIdStep("lookup");
    setRecipient(null);
    setError("");
  };

  const handleBackFromPayment = () => {
    setPayIdStep("confirm");
    setFromAccount("");
    setAmount("");
    setDescription("");
    setError("");
  };

  const handlePay = async () => {
    if (!fromAccount || !amount || !description) {
      setError("Please complete all payment fields");
      return;
    }

    if (!accountOptions.length) {
      setError("No accounts available for payment");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (mode === "payid") {
        if (!recipient) {
          setError("Please search and confirm a PayID recipient first");
          return;
        }
        await payIdApi.pay({
          from_account_id: fromAccount.id,
          phone: recipient.phone,
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
          setError("Please select a destination account");
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

  const renderPayIdLookup = () => (
    <>
      <Typography mb={1}>PayID phone number</Typography>
      <TextField
        fullWidth
        placeholder="0412 345 678"
        value={searchPhone}
        onChange={(e) => setSearchPhone(e.target.value)}
        disabled={loading}
        sx={{ mb: 3 }}
        InputProps={{
          sx: { borderRadius: "20px" },
        }}
      />
      <Button
        fullWidth
        variant="contained"
        startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SearchIcon />}
        onClick={handleSearchPayId}
        disabled={loading}
        sx={{
          textTransform: "none",
          borderRadius: 3,
          bgcolor: "#86c5cc",
          "&:hover": { bgcolor: "#6fb1b8" },
        }}
      >
        Search PayID
      </Button>
    </>
  );

  const renderPayIdConfirm = () => (
    <>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Is this the correct recipient?
      </Typography>
      <Card variant="outlined" sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary">
            Name
          </Typography>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            {recipient.recipient_name}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            PayID
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {recipient.phone}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Account type
          </Typography>
          <Typography variant="body1">
            {capitalizeAccountType(recipient.account_type)}
          </Typography>
        </CardContent>
      </Card>
      <Box display="flex" gap={2}>
        <Button
          fullWidth
          variant="outlined"
          onClick={handleBackFromConfirm}
          disabled={loading}
          sx={{
            textTransform: "none",
            borderRadius: 3,
            borderColor: "#86c5cc",
            color: "#86c5cc",
          }}
        >
          Back
        </Button>
        <Button
          fullWidth
          variant="contained"
          onClick={handleConfirmRecipient}
          disabled={loading}
          sx={{
            textTransform: "none",
            borderRadius: 3,
            bgcolor: "#86c5cc",
            "&:hover": { bgcolor: "#6fb1b8" },
          }}
        >
          Confirm & continue
        </Button>
      </Box>
    </>
  );

  const renderPaymentForm = () => (
    <>
      {mode === "payid" && recipient && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Paying {recipient.recipient_name} ({recipient.phone})
        </Alert>
      )}

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
            p: 1.5,
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
                p: 1.5,
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

      <Typography mb={1}>Amount</Typography>
      <TextField
        fullWidth
        placeholder="0.00"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        disabled={loading}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
          sx: { borderRadius: "20px" },
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
          sx: { borderRadius: "20px" },
        }}
      />

      <Box display="flex" gap={2}>
        {mode === "payid" && (
          <Button
            fullWidth
            variant="outlined"
            onClick={handleBackFromPayment}
            disabled={loading}
            sx={{
              textTransform: "none",
              borderRadius: 3,
              borderColor: "#86c5cc",
              color: "#86c5cc",
            }}
          >
            Back
          </Button>
        )}
        <Button
          fullWidth
          variant="contained"
          onClick={handlePay}
          disabled={loading}
          sx={{
            textTransform: "none",
            borderRadius: 3,
            bgcolor: "#86c5cc",
            "&:hover": { bgcolor: "#6fb1b8" },
          }}
        >
          {loading ? <CircularProgress size={22} color="inherit" /> : "Pay now"}
        </Button>
        {mode !== "payid" && (
          <Button
            fullWidth
            variant="outlined"
            onClick={handleClose}
            disabled={loading}
            sx={{
              textTransform: "none",
              borderRadius: 3,
              borderColor: "#86c5cc",
              color: "#86c5cc",
            }}
          >
            Pay later
          </Button>
        )}
      </Box>
    </>
  );

  const renderContent = () => {
    if (mode === "payid") {
      if (payIdStep === "lookup") return renderPayIdLookup();
      if (payIdStep === "confirm") return renderPayIdConfirm();
      return renderPaymentForm();
    }
    return renderPaymentForm();
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
          p: 2,
        },
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

        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}

export default PayPopup;
