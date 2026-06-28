import React, { useState } from "react";
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
  MenuItem
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function PayPopup({ open, onClose }) {
  const [fromAccount, setFromAccount] = useState("");
  const [toContact, setToContact] = useState("");

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

        {/* FROM DROPDOWN */}
        <Typography mb={1}>From</Typography>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <Select
            value={fromAccount}
            displayEmpty
            onChange={(e) => setFromAccount(e.target.value)}
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

            <MenuItem
              value={{
                label: "Checking",
                sub: "BSB: 123-456 Acc: 48394714"
              }}
            >
              <Box>
                <Typography fontWeight={600}>Checking</Typography>
                <Typography variant="body2" color="text.secondary">
                  BSB: 123-456
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Account no: 48394714
                </Typography>
              </Box>
            </MenuItem>

            <MenuItem
              value={{
                label: "Savings",
                sub: "BSB: 987-654 Acc: 11112222"
              }}
            >
              <Box>
                <Typography fontWeight={600}>Savings</Typography>
                <Typography variant="body2" color="text.secondary">
                  BSB: 987-654
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Account no: 11112222
                </Typography>
              </Box>
            </MenuItem>
          </Select>
        </FormControl>

        {/* TO DROPDOWN */}
        <Typography mb={1}>To</Typography>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <Select
            value={toContact}
            displayEmpty
            onChange={(e) => setToContact(e.target.value)}
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
            <MenuItem
              value={{
                label: "Mia Lee",
                sub: "0412 937 584"
              }}
            >
              <Box>
                <Typography fontWeight={600}>Mia Lee</Typography>
                <Typography variant="body2" color="text.secondary">
                  0412 937 584
                </Typography>
              </Box>
            </MenuItem>

            <MenuItem
              value={{
                label: "Alex Wong",
                sub: "0400 000 000"
              }}
            >
              <Box>
                <Typography fontWeight={600}>Alex Wong</Typography>
                <Typography variant="body2" color="text.secondary">
                  0400 000 000
                </Typography>
              </Box>
            </MenuItem>
          </Select>
        </FormControl>

        {/* Amount */}
        <Typography mb={1}>Amount</Typography>
        <TextField
          fullWidth
          placeholder="0.00"
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
            sx={{
              textTransform: "none",
              borderRadius: 3,
              bgcolor: "#86c5cc",
              "&:hover": { bgcolor: "#6fb1b8" }
            }}
          >
            Pay now
          </Button>

          <Button
            fullWidth
            variant="outlined"
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