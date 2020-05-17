import * as React from 'react';

import { InjectedIntlProps, injectIntl } from 'react-intl';

import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';

import {
    currenciesFetch,
    Currency,
    Market,
    orderBookFetch,
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

    public onSubmit = () => {
        console.log('onSubmit');
    };

    public componentDidMount() {
        this.props.fetchCurrencies();
    }

    public render() {
        const { currencies } = this.props;
        const { fiat, crypto } = this.state;
        const fiatList = currencies.filter(item => item.type === 'fiat').map(({ id }) => id);
        const cryptoList = currencies.filter(item => item.type === 'coin').map(({ id }) => id);
        console.log('fiat, crypto', fiat, crypto);
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
                            <p className="buy-form__bottom-text--help">
                                {this.translate('buyWithCard.form.help')}
                            </p>
                        </div>
                        <button
                            className="buy-form__button-continue"
                            onClick={this.onSubmit}
                        >
                            {this.translate('buyWithCard.form.buttonContinue')}
                        </button>

                        <div className="buy-form__bottom-text-mobile">
                            <p className="buy-form__bottom-text--help-mobile">
                                {this.translate('buyWithCard.form.help')}
                            </p>
                        </div>
                    </div>

                    <div className="buy-form__limits">
                        <div>
                            <div className="buy-form__limits-item">
                                <div>
                                    <div className="icon-arrow" />
                                    <p>{this.translate('buyWithCard.form.paymentLimit')}:</p>
                                    <span>{' '}$50 – $50,000</span>
                                </div>
                            </div>

                            <div className="buy-form__limits-item">
                                <div>
                                    <div className="icon-clock" />
                                    <p>{this.translate('buyWithCard.form.dailyLimit')}:</p>
                                    <span>{' '}$50 – $50,000</span>
                                </div>
                            </div>

                            <div className="buy-form__limits-item">
                                <div>
                                    <div className="icon-calendar" />
                                    <p>{this.translate('buyWithCard.form.monthlyLimit')}:</p>
                                    <span>{' '}$50 – $50,000</span>
                                </div>
                            </div>
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
    fetchOrderBook: (market: Market) => dispatch(orderBookFetch(market)),
});

export const CreditCardBuyForm = injectIntl(connect(mapStateToProps, mapDispatchToProps)(CreditCardBuyFormComponent));
