import * as React from 'react';
import { CoinFragment } from './CoinFragment';
import { FiatFragment } from './FiatFragment';

export const DepositTab = ({
    addressDepositError,
    colorTheme,
    wallets,
    user,
    selectedWalletAddress,
    selectedWalletIndex,
    card,
    sepa,
    wire,
    handleOnCopy,
    action,
    balance,
    message,
    history,
    lang,
}) => {
    const currency = (wallets[selectedWalletIndex] || { currency: '' }).currency;
    const [userAgree, setUserAgree] = React.useState(false);
    if (wallets[selectedWalletIndex].type === 'coin') {
        return (
            <CoinFragment
                currency={currency}
                wallets={wallets}
                selectedWalletAddress={selectedWalletAddress}
                handleOnCopy={handleOnCopy}
                addressDepositError={addressDepositError}
                selectedWalletIndex={selectedWalletIndex}
                userAgree={userAgree}
                setUserAgree={setUserAgree}
            />
        );
    } else {
        return (
            <FiatFragment
                card={card}
                colorTheme={colorTheme}
                sepa={sepa}
                user={user}
                wire={wire}
                currency={currency}
                wallets={wallets}
                selectedWalletIndex={selectedWalletIndex}
                action={action}
                balance={balance}
                message={message}
                history={history}
                lang={lang}
            />
        );
    }
};
