/* tslint:disable */
import * as React from 'react';
import { injectIntl } from 'react-intl';
import { CurrencyInfo } from '../../../components';
import { DepositFiat } from '../../../custom/components';
import { WalletHistory } from '../../../containers/Wallets/History';

interface SepaState {
    isSelectedOperation: boolean;
    isMore800: boolean
}
interface Props {
    sepa: any,
    user: any,
    currency: any,
    wallets: any,
    selectedWalletIndex: any,
    intl: any,
}

class SepaComponent extends React.Component<Props, SepaState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            isSelectedOperation: false,
            isMore800: false,
        };
    }

    setTypeOperation = (type) => {
        this.setState({isMore800: type, isSelectedOperation: true})
    }

    render() {
        const { isSelectedOperation, isMore800 } = this.state;
        const { intl, wallets, selectedWalletIndex, currency, user, sepa } = this.props;
        const translate = (id) => intl.formatMessage({id});
        const title = translate('page.body.wallets.tabs.deposit.fiat.message1.sepa');
        const description = translate('page.body.wallets.tabs.deposit.fiat.message2.sepa');
        const details = translate('page.body.wallets.tabs.deposit.fiat.message3');
        return (
            <div>
                <CurrencyInfo wallet={wallets[selectedWalletIndex]}/>
                {isSelectedOperation
                    ? <div>
                        {isMore800}
                        <DepositFiat
                            currency={currency.toLowerCase()}
                            title={title}
                            description={description}
                            details={details}
                            uid={user ? user.uid : ''}
                            sepa={sepa}
                            isMore={isMore800}
                        />
                        <div className="fiat-alert">
                            {translate('page.wallets.withdraw.fiat')}
                        </div>
                        {currency && <WalletHistory label="deposit" type="deposits" currency={currency}/>}
                    </div>
                    : <div className="sepa-confirm">
                        <span className="sepa-confirm__text">Chose the amount of money you would like to deposit. Different fee will be applicable depending on your preferred mode of payment.</span>
                        <div className="sepa-confirm__btn-block">
                            <button className="sepa-confirm__btn" onClick={() => this.setTypeOperation(false)}>Below 800 EUR</button>
                            <button className="sepa-confirm__btn" onClick={() => this.setTypeOperation(true)}>Above 800 EUR</button>
                        </div>
                    </div>
                }


            </div>
        );
    }
};

export const SepaFragment = injectIntl(SepaComponent)
