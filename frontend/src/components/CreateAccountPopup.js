import { Dialog, DialogContent, Box, Typography, IconButton, FormControl, Select, MenuItem, Button, Alert, CircularProgress } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close'
import { useState } from "react";
import { accountsApi } from "../services/bankingApi";
import { getErrorMessage } from "../services/api";

function CreateAccountPopup({ open, onClose, onAccountCreated }) {
    const [accountType, setAccountType] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleCreate = async () => {
        if (!accountType) {
            setError('Please select an account type');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const payload = { account_type: accountType };
            await accountsApi.create(payload);
            setAccountType('');
            onAccountCreated?.();
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
        }}>

            <DialogContent>
                <Box display="flex" justifyContent="space-between" mb={3}>
                <Typography variant="h6" fontWeight={600}>
                        Add a new banking account
                    </Typography>

                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {/* form content */}
                <Typography mb={1}>Account type</Typography>
                <FormControl sx={{width:300}}>
                    <Select
                        value={accountType}
                        displayEmpty
                        onChange={(e) => setAccountType(e.target.value)}
                        disabled={loading}
                        renderValue={(selected) => {
                        if (!selected) {
                            return <Typography color="text.secondary">Select</Typography>;
                        }
                        return (selected);
                        }}
                    >
                        <MenuItem value="savings">
                            <Typography variant="body1">Savings</Typography>
                        </MenuItem>

                       <MenuItem value="checking">
                            <Typography variant="body1">Checking</Typography>
                        </MenuItem>
                    </Select>
                </FormControl>

                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleCreate}
                    disabled={loading}
                    sx={{
                    mt:5,
                    textTransform: "none",
                    borderRadius: 3,
                    bgcolor: "#86c5cc",
                    "&:hover": { bgcolor: "#6fb1b8" }
                    }}
                >
                    {loading ? <CircularProgress size={22} color="inherit" /> : 'Add account'}
                </Button>

            </DialogContent>

        </Dialog>
    );
}

export default CreateAccountPopup;
