/* tslint:disable */
import * as React from 'react';
import { injectIntl } from 'react-intl';
import { CurrencyInfo } from '../../../components';
import { DepositFiat } from '../../../custom/components';
import { WalletHistory } from '../../../containers/Wallets/History';

interface Props {
    sepa: any,
    user: any,
    currency: any,
    wallets: any,
    selectedWalletIndex: any,
    intl: any,
}

class SepaComponent extends React.Component<Props> {
    render() {
        const { intl, wallets, selectedWalletIndex, currency, user, sepa } = this.props;
        const translate = (id) => intl.formatMessage({id});
        const title = translate('page.body.wallets.tabs.deposit.fiat.message1.sepa');
        const description = translate('page.body.wallets.tabs.deposit.fiat.message2.sepa');
        const details = translate('page.body.wallets.tabs.deposit.fiat.message3');
        return (
            <React.Fragment>
                <CurrencyInfo wallet={wallets[selectedWalletIndex]}/>
                    <div>
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
                        {currency && <WalletHistory label="deposit" type="deposits" currency={currency}/>}
                    </div>
            </React.Fragment>
        );
    }
};

export const SepaFragment = injectIntl(SepaComponent);
