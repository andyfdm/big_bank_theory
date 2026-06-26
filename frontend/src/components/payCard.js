import { Card, CardActionArea, Typography } from '@mui/material'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

function PayCard({name, onClick, icon}) {
    return (
        <Card sx={{borderRadius: '12px', border: '1px solid #f0f0f0', cursor: 'pointer'}}>
            <CardActionArea onClick={onClick} sx={{padding: 1.5, display: 'flex'}}>
                {/* bsb, payid, transfer */}
                {icon === "bsb" && <AccountBalanceWalletIcon />}
                <Typography variant='p' sx={{ml: 1}}>{name}</Typography>
            </CardActionArea>
        </Card>
    );
}

export default PayCard;