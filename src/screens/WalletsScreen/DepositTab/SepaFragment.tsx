/* tslint:disable */
import * as React from 'react';
import { injectIntl } from 'react-intl';
import { CurrencyInfo } from '../../../components';
import { DepositFiat } from '../../../custom/components';
import { WalletHistory } from '../../../containers/Wallets/History';

export const SepaFragment = injectIntl(({
    intl,
    sepa,
    currency,
    wallets,
    selectedWalletIndex,
    user,
}) => {
    const translate = (id) => intl.formatMessage({id});
    const title = translate('page.body.wallets.tabs.deposit.fiat.message1');
    const description = translate('page.body.wallets.tabs.deposit.fiat.message2.sepa');
    const details = translate('page.body.wallets.tabs.deposit.fiat.message3');
    
    return (
        <div>
            <CurrencyInfo wallet={wallets[selectedWalletIndex]} />                    
            <DepositFiat
                currency={currency.toLowerCase()}
                title={title}
                description={description}
                details={details}
                uid={user ? user.uid : ''}
                sepa={sepa}            
            />
            <div className="fiat-alert">
                {translate('page.wallets.withdraw.fiat')}
            </div>
            {currency && <WalletHistory label="deposit" type="deposits" currency={currency} />} 
        </div> 
    );
});
