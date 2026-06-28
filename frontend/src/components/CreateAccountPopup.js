import { Dialog, DialogContent, Box, Typography, IconButton, FormControl, Select, MenuItem, Button } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close'
import { useState } from "react";

function CreateAccountPopup({open, onClose}) {
    const [accountType, setAccountType] = useState("");


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

                {/* form content */}
                <Typography mb={1}>Account type</Typography>
                <FormControl sx={{width:300}}>
                    <Select
                        value={accountType}
                        displayEmpty
                        onChange={(e) => setAccountType(e.target.value)}
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
                    sx={{
                    mt:5,
                    textTransform: "none",
                    borderRadius: 3,
                    bgcolor: "#86c5cc",
                    "&:hover": { bgcolor: "#6fb1b8" }
                    }}
                >
                    Add account
                </Button>

            </DialogContent>

        </Dialog>
    );
}

export default CreateAccountPopup;