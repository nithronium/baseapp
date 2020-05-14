import * as React from 'react';

import { InjectedIntlProps, injectIntl } from 'react-intl';

import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';

import {
    currenciesFetch,
    Currency,
    RootState,
    selectCurrencies,
} from '../../../../modules';

import { CurrencySelect } from '../../../components/ReferralCommission/CurrencySelect';


interface ReduxProps {
    currencies: Currency[];
}

interface DispatchProps {
    fetchCurrencies: typeof currenciesFetch;
}

type Props = InjectedIntlProps & ReduxProps & DispatchProps;

interface State {
    fiatValue: number;
    cryptoValue: number;
    fiat: string;
    crypto: string;
}

class CreditCardBuyFormComponent extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            fiat: 'usd',
            crypto: 'btc',
            fiatValue: 0,
            cryptoValue: 0,
        };
    }

    public translate = id => {
        return this.props.intl.formatMessage({ id });
    };

    public onSellChange = e => {
        console.log(e.target.value);
    };

    public onBuyChange = e => {
        console.log(e.target.value);
    };

    public onFiatChange = e => {
        this.setState({ fiat: e.toLowerCase() });
    };

    public onCryptoChange = e => {
        this.setState({ crypto: e.toLowerCase() });
    };

    public componentDidMount() {
        this.props.fetchCurrencies();
    }

    public render() {
        const { currencies } = this.props;
        const { fiat, crypto } = this.props;
        const fiatList = currencies.filter(item => item.type === 'fiat').map(({ id }) => id);
        const cryptoList = currencies.filter(item => item.type === 'coin').map(({ id }) => id);
        return (
            <div className="buy-form">
                <div className="section">
                    <div className="section__header">
                        {this.translate('buyWithCard.form.header')}
                    </div>

                    <div className="buy-form__content">
                        <h2>{this.translate('buyWithCard.form.title')}</h2>

                        <div className="buy-form__inputs-wrap">
                            <div className="buy-form__input-wrap">
                                <label className="buy-form__label">
                                    {this.translate('buyWithCard.form.sell')}
                                </label>
                                <input
                                    onChange={this.onSellChange}
                                    value="100"
                                    className="buy-form__input"
                                />
                                <CurrencySelect
                                    currencyId={fiat}
                                    currencies={fiatList}
                                    changeCurrentCurrency={this.onFiatChange}
                                />
                            </div>

                            <div className="buy-form__input-wrap">
                                <label className="buy-form__label">
                                    {this.translate('buyWithCard.form.buy')}
                                </label>
                                <input
                                    onChange={this.onBuyChange}
                                    value="100"
                                    className="buy-form__input"
                                />
                                <CurrencySelect
                                    currencyId={crypto}
                                    currencies={cryptoList}
                                    changeCurrentCurrency={this.onCryptoChange}
                                />
                            </div>
                        </div>

                        <div className="buy-form__bottom-text">
                            <p>{this.translate('buyWithCard.form.fees')}</p>
                            <p className="buy-form__bottom-text--help">{this.translate('buyWithCard.form.help')}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    currencies: selectCurrencies(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    fetchCurrencies: () => dispatch(currenciesFetch()),
});

export const CreditCardBuyForm = injectIntl(connect(mapStateToProps, mapDispatchToProps)(CreditCardBuyFormComponent));
