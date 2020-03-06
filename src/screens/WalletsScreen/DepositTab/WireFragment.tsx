/* tslint:disable */
import * as React from 'react';
import { injectIntl } from 'react-intl';
import { CurrencyInfo } from '../../../components';
import { DepositFiat } from '../../../custom/components';
import { WalletHistory } from '../../../containers/Wallets/History';

export const WireFragment = injectIntl(({
    intl,
    currency,
    wallets,
    selectedWalletIndex,
    user,
}) => {
    const translate = (id) => intl.formatMessage({id});
    const title = translate('page.body.wallets.tabs.deposit.fiat.message1');
    const description = translate('page.body.wallets.tabs.deposit.fiat.message2');
    const details = translate('page.body.wallets.tabs.deposit.fiat.message3');
    const uid = (currency.toLowerCase() === 'eur') ? `16351518438882197104${user.uid}` : user.uid
    return (
       !['eur', 'usd'].includes(currency.toLowerCase()) ?
        <div>
            <CurrencyInfo wallet={wallets[selectedWalletIndex]} />                        
            <DepositFiat
                currency={currency.toLowerCase()}
                title={title}
                description={description}
                details={details}
                uid={uid}
                />
            <div className="fiat-alert">
                {translate('page.wallets.withdraw.fiat')}
            </div>
            {currency && <WalletHistory label="deposit" type="deposits" currency={currency} />}
        </div> :
        <div style={{ fontSize: '18px', paddingTop: '20px', textAlign: 'center' }}>{translate('comingsoon')}</div>
    );
});
