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
}) => {
    const currency = (wallets[selectedWalletIndex] || { currency: '' }).currency;

    if (wallets[selectedWalletIndex].type === 'coin') {
        return (
        <CoinFragment
            currency={currency}
            wallets={wallets}
            selectedWalletAddress={selectedWalletAddress}
            handleOnCopy={handleOnCopy}
            addressDepositError={addressDepositError}
            selectedWalletIndex={selectedWalletIndex}
        />);
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
        />);
    }
};
