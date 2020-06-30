import * as React from 'react';
import { CoinFragment } from './CoinFragment';
import { FiatFragment } from './FiatFragment';
//tslint:disable
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
    onError,
}) => {
    const coins = localStorage.getItem('usedCoins') ? JSON.parse(localStorage.getItem('usedCoins') || '') : [];

    const currency = (wallets[selectedWalletIndex] || { currency: '' }).currency;
    const [userAgree, setUserAgree] = React.useState(false);
    const [usedCoins, setUsedCoins] = React.useState(coins);

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
                usedCoins={usedCoins}
                setUsedCoins={setUsedCoins}
                user={user}
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
                onError={onError}
            />
        );
    }
};
