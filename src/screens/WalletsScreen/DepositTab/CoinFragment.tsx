/*tslint:disable */
import * as React from 'react';
import { injectIntl } from 'react-intl';
import { CurrencyInfo, DepositCrypto } from '../../../components';
import { WalletHistory } from '../../../containers/Wallets/History';
import { formatCCYAddress } from '../../../helpers';

export const CoinFragment = injectIntl(
    ({ intl, currency, wallets, selectedWalletAddress, handleOnCopy, addressDepositError, selectedWalletIndex }) => {
        const format = intl.formatMessage;
        const text = format({ id: 'page.body.wallets.tabs.deposit.ccy.message.submit' });
        const walletAddress = formatCCYAddress(currency, selectedWalletAddress);
        const error = addressDepositError
            ? format({ id: addressDepositError.message })
            : format({ id: 'page.body.wallets.tabs.deposit.ccy.message.error' });
        return (
            <React.Fragment>
                <CurrencyInfo wallet={wallets[selectedWalletIndex]} />
                <DepositCrypto
                    data={walletAddress}
                    handleOnCopy={handleOnCopy}
                    error={error}
                    text={text}
                    disabled={walletAddress === ''}
                    copiableTextFieldText={format({ id: 'page.body.wallets.tabs.deposit.ccy.message.address' })}
                    copyButtonText={format({ id: 'page.body.wallets.tabs.deposit.ccy.message.button' })}
                />

                {currency && <WalletHistory label="deposit" type="deposits" currency={currency} />}
            </React.Fragment>
        );
    }
);
