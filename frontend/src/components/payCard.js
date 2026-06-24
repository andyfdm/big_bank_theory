import Box from '@mui/material/Box'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import './payCard.css';

function PayCard(props) {
    return (
        <Box sx={{display: 'flex', borderRadius: '12px', border: '1px solid #f0f0f0', padding: 1.5}}>
            {/* bsb, payid, transfer */}
            {props.icon === "bsb" && <AccountBalanceWalletIcon />}
            <p>{props.name}</p>
        </Box>
    );
}

export default PayCard;