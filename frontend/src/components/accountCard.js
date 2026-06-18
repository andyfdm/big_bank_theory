function AccountCard(props) {
    return (
        <div className="account-card">
            <h2>{props.account.name}</h2>
            <p>Balance: ${props.account.balance}</p>
        </div>
    );
}

export default AccountCard;