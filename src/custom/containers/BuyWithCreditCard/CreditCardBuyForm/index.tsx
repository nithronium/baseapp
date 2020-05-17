import * as React from 'react';

import { InjectedIntlProps, injectIntl } from 'react-intl';

import { RouteComponentProps, withRouter } from 'react-router';

import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';

import {
    Modal,
  } from '../../../../components';

import {
    currenciesFetch,
    Currency,
    Market,
    marketsFetch,
    orderBookFetch,
    OrderBookState,
    RootState,
    selectCurrencies,
    selectMarkets,
    selectOrderBook,
    selectUserInfo,
    selectUserLoggedIn,
    selectWithdrawLimit,
    User,
    withdrawLimitFetch,
} from '../../../../modules';

import { WithdrawLimit } from '../../../../modules/user/withdrawLimit';

import {
    CurrencySelect,
} from '../../../components/ReferralCommission/CurrencySelect';


interface ReduxProps {
    currencies: Currency[];
    markets: Market[];
    orderBook: OrderBookState;
    user: User;
    userLoggedIn: boolean;
    withdrawLimitData: WithdrawLimit;
}

interface DispatchProps {
    fetchCurrencies: typeof currenciesFetch;
    fetchMarkets: typeof marketsFetch;
    fetchOrderBook: typeof orderBookFetch;
    fetchWithdrawLimit: typeof withdrawLimitFetch;
}

type Props = InjectedIntlProps & ReduxProps & DispatchProps & RouteComponentProps & {
    isLoggedIn: boolean;
};

interface State {
    fiatValue: string;
    cryptoValue: string;
    fiat: string;
    crypto: string;
    fiatList: string[];
    cryptoList: string[];
    showModal: boolean;
}

class CreditCardBuyFormComponent extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            fiat: 'usd',
            crypto: 'btc',
            fiatValue: '0',
            cryptoValue: '0',
            fiatList: [],
            cryptoList: [],
            showModal: false,
        };
    }

    public translate = id => {
        return this.props.intl.formatMessage({ id });
    };

    public onFiatValueChange = e => {
        const fiatValue = e.target.value;
        const fiatValueNumber = Number(fiatValue);
        let cryptoValue = this.state.cryptoValue;
        if (!Number.isNaN(fiatValueNumber)) {
            cryptoValue = this.convertToCrypto(fiatValueNumber).toString();
        }
        this.setState({ fiatValue, cryptoValue });
    };

    public onCryptoValueChange = e => {
        const cryptoValue = e.target.value;
        const cryptoValueNumber = Number(cryptoValue);
        let fiatValue = this.state.fiatValue;
        if (!Number.isNaN(cryptoValueNumber)) {
            fiatValue = this.convertToFiat(cryptoValueNumber).toString();
        }
        this.setState({ fiatValue, cryptoValue });
    };

    public convertToFiat = (cryptoValue: number): number => {
        return this.convert(cryptoValue, 'fiat');
    };

    public convertToCrypto = (fiatValue: number): number => {
        return this.convert(fiatValue, 'crypto');
    };

    public convert = (value: number, target: string): number => {
        const { orderBook } = this.props;
        const { asks } = orderBook;
        const totalPrice = asks.reduce((sum: number, { price, remaining_volume }) => {
            return sum + price * remaining_volume;
        }, 0);
        const totalVolume = asks.reduce((sum: number, { remaining_volume }) => {
            return Number(sum) + Number(remaining_volume);
        }, 0);
        const weightedAverage = totalPrice / totalVolume;
        return target === 'fiat' ?
            value * weightedAverage :
            value / weightedAverage;
    };

    public onFiatChange = e => {
        let { crypto } = this.state;
        const fiat = e.toLowerCase();
        const cryptoList = this.getAvailableCrypto(fiat);
        if (!cryptoList.includes(crypto)) {
            crypto = cryptoList[0];
        }
        this.setState({ fiat, cryptoList, crypto }, () => {
            this.fetchMarket();
        });
    };

    public onCryptoChange = e => {
        let { fiat } = this.state;
        const crypto = e.toLowerCase();
        const fiatList = this.getAvailableFiat(crypto);
        if (!fiatList.includes(fiat)) {
            fiat = fiatList[0];
        }
        this.setState({ fiat, fiatList, crypto }, () => {
            this.fetchMarket();
        });
    };

    public findMarket = (fiat: string, crypto: string): Market => {
        const { markets } = this.props;
        return markets.filter((market: Market) => {
            return (market.base_unit.toLowerCase() === fiat.toLowerCase() &&
                market.quote_unit.toLowerCase() === crypto.toLowerCase()) ||

                (market.quote_unit.toLowerCase() === fiat.toLowerCase() &&
                market.base_unit.toLowerCase() === crypto.toLowerCase());
        })[0];
    };

    public fetchMarket = () => {
        const { fiat, crypto } = this.state;
        const market = this.findMarket(fiat, crypto);
        this.props.fetchOrderBook(market);
    };

    public onSubmit = () => {
        const { userLoggedIn, history, user } = this.props;
        if (!userLoggedIn) {
            history.push(`/signin?redirect_url=${encodeURIComponent('/buy-with-credit-card')}`);
            return;
        }
        if (user.level < 2) {
            history.push('/profile');
        }
        this.setState({
            showModal: true,
        });
    };

    public componentDidMount() {
        this.props.fetchCurrencies();
        this.props.fetchMarkets();
        this.props.fetchWithdrawLimit();
    }

    public componentWillReceiveProps(nextProps) {
        const { currencies, markets } = this.props;
        if (currencies.length !== nextProps.currencies.length ||
            markets.length !== nextProps.markets.length)
        {
            if (!nextProps.markets.length || !nextProps.currencies.length) { return; }
            const fiatList = this.getAllFiat(nextProps);
            this.setState({
                fiatList,
                cryptoList: this.getAvailableCrypto(fiatList[0], nextProps),
            }, () => {
                this.fetchMarket();
            });
        }
    }

    public isEqual = (curr1: string, curr2: string): boolean => {
        return (curr1 || '').toLowerCase() === (curr2 || '').toLowerCase();
    };

    public getAvailableCrypto = (fiat: string, props?): string[] => {
        const { markets } = (props || this.props);
        const toLowerCase = str => (str || '').toLowerCase();
        return markets.filter(({ base_unit, quote_unit }) => {
            return (this.isEqual(base_unit, fiat) &&
                this.isCrypto(toLowerCase(quote_unit))) ||

                (this.isEqual(quote_unit, fiat) &&
                this.isCrypto(toLowerCase(base_unit)));
        }).map(({ base_unit, quote_unit }) => {
            return this.isEqual(base_unit, fiat) ?
                toLowerCase(quote_unit) :
                toLowerCase(base_unit);
        });
    };

    public getAvailableFiat = (crypto: string): string[] => {
        const { markets } = this.props;
        return markets.filter(({ base_unit, quote_unit }) => {
            return (this.isEqual(base_unit, crypto) &&
                this.isFiat(quote_unit.toLowerCase())) ||

                (this.isEqual(quote_unit, crypto) &&
                this.isFiat(base_unit.toLowerCase()));
        }).map(({ base_unit, quote_unit }) => {
            return this.isEqual(base_unit, crypto) ?
                quote_unit.toLowerCase() :
                base_unit.toLowerCase();
        });
    };

    public getAllFiat = (props?): string[] => {
        const res = new Set<string>();
        const { markets } = (props || this.props);
        for (const market of markets) {
            const { base_unit, quote_unit } = market;
            if (this.isFiat(base_unit)) {
                res.add(base_unit);
            }
            if (this.isFiat(quote_unit)) {
                res.add(quote_unit);
            }
        }
        return Array.from(res);
    };

    public isCrypto = (currency: string) => {
        return this.getCurrenciesByType('coin')
            .some(item => item.id === currency);
    };

    public isFiat = (currency: string) => {
        return this.getCurrenciesByType('fiat')
            .some(item => item.id === currency);
    };

    public getCurrenciesByType = (type: string) => {
        return this.props.currencies.filter(item => {
            return item.type === type;
        });
    };

    public getButtonTextKey = (): string => {
        const { userLoggedIn, user } = this.props;
        if (userLoggedIn) {
            if (user.level >= 2) {
                return 'buyWithCard.form.buttonContinue';
            } else {
                return 'buyWithCard.form.buttonNotVerified';
            }
        } else {
            return 'buyWithCard.form.buttonNotLogged';
        }
    };

    public getLimit = () => {
        const { withdrawLimitData } = this.props;
        const withdraw = withdrawLimitData.withdraw;
        return withdraw ? withdraw.limit : '0';
    };

    public render() {
        // const { withdrawLimitData } = this.props;
        return (
            <div className="buy-form">
                <div className="section">
                    <div className="section__header">
                        {this.translate('buyWithCard.form.header')}
                    </div>

                    <div className="buy-form__content">
                        <h2>{this.translate('buyWithCard.form.title')}</h2>
                        {this.currenciesForm()}
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
                            {this.translate(this.getButtonTextKey())}
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
                                    <span>{' '}${this.getLimit()}</span>
                                </div>
                            </div>

                            {/* <div className="buy-form__limits-item">
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
                            </div> */}
                        </div>
                    </div>
                </div>
                <Modal
                    show={this.state.showModal}
                    header={this.renderModalHeader()}
                    content={this.renderModalBody()}
                    footer={this.renderModalFooter()}
                />
            </div>
        );
    }

    public currenciesForm = () => {
        const { fiat, crypto, fiatList, cryptoList, fiatValue, cryptoValue } = this.state;
        return (
            <div className="buy-form__inputs-wrap">
                <div className="buy-form__input-wrap">
                    <label className="buy-form__label">
                        {this.translate('buyWithCard.form.sell')}
                    </label>
                    <input
                        onChange={this.onFiatValueChange}
                        value={fiatValue}
                        className="buy-form__input"
                        type="number"
                    />
                    <CurrencySelect
                        currencyId={fiat || 'usd'}
                        currencies={fiatList}
                        changeCurrentCurrency={this.onFiatChange}
                    />
                </div>

                <div className="buy-form__input-wrap">
                    <label className="buy-form__label">
                        {this.translate('buyWithCard.form.buy')}
                    </label>
                    <input
                        onChange={this.onCryptoValueChange}
                        value={cryptoValue}
                        className="buy-form__input"
                        type="number"
                    />
                    <CurrencySelect
                        currencyId={crypto || 'btc'}
                        currencies={cryptoList}
                        changeCurrentCurrency={this.onCryptoChange}
                    />
                </div>
            </div>
        );
    };

    public closeModal = () => {
        this.setState({ showModal: false });
    };

    public renderModalHeader = () => {
        return (
            <div className="buy-form__modal-header">
                <p>{this.translate('buyWithCard.form.modal.header')}</p>
                <div
                    className="buy-form__modal-close"
                    onClick={this.closeModal}
                >
                    x
                </div>
            </div>
        );
    };

    public renderModalBody = () => {
        const { fiatValue, cryptoValue, fiat, crypto } = this.state;
        return (
            <div>
                <div className="buy-form__modal-amount">
                    {this.translate('buyWithCard.form.buy')} {' '}
                    <span>{cryptoValue} {crypto.toUpperCase()}</span>
                    {' '}{this.translate('buyWithCard.form.for')}{' '}
                    <span>{fiatValue} {fiat.toUpperCase()}</span>
                </div>

                <div className="buy-form__modal-inputs">
                    {this.currenciesForm()}
                </div>
                <div className="buy-form__modal-divider">
                    <div className="credit-card-promo__divider">
                        <div className="credit-card-promo__divider-arrow" />
                    </div>
                </div>

                <div className="buy-form__modal-table">
                    <div className="buy-form__modal-table-top">
                        <span>{this.translate('buyWithCard.form.modal.pay')}</span>
                        <span>{fiatValue} {fiat.toUpperCase()}</span>
                    </div>
                    <div className="buy-form__modal-table-bottom">
                        <span>{this.translate('buyWithCard.form.modal.get')}</span>
                        <span>{cryptoValue} {crypto.toUpperCase()}</span>
                    </div>
                </div>

                <div className="buy-form__modal-terms">
                    <div className="buy-form__modal-terms-header">
                        {this.translate('buyWithCard.form.modal.terms.header')}
                    </div>
                    <div className="buy-form__modal-terms-body">
                        {this.translate('buyWithCard.form.modal.terms.body')}
                    </div>
                </div>

                <div className="buy-form__modal-footer">
                    <div className="buy-form__modal-footer-button">
                        {this.translate('buyWithCard.form.modal.buttonBuy')}
                    </div>
                </div>
            </div>
        );
    };

    public renderModalFooter = () => {
        return null;
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    currencies: selectCurrencies(state),
    markets: selectMarkets(state),
    orderBook: selectOrderBook(state),
    user: selectUserInfo(state),
    userLoggedIn: selectUserLoggedIn(state),
    withdrawLimitData: selectWithdrawLimit(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    fetchCurrencies: () => dispatch(currenciesFetch()),
    fetchOrderBook: (market: Market) => dispatch(orderBookFetch(market)),
    fetchMarkets: () => dispatch(marketsFetch()),
    fetchWithdrawLimit: () => dispatch(withdrawLimitFetch()),
});

export const CreditCardBuyForm = injectIntl(connect(mapStateToProps, mapDispatchToProps)(withRouter(CreditCardBuyFormComponent)));
