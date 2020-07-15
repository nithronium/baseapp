import * as moment from 'moment';
import * as qs from 'qs';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import {
    Decimal,
    Modal,
} from '../../../../components';
import { getTotalPrice } from '../../../../helpers';
import {
    creditCardOrderFetch,
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
import { CreditCardForm } from '../CreditCardForm';
import { CreditCardModal } from '../CreditCardModal';
import { CreditCardOverlay } from '../CreditCardOverlay';

// const availableFiat = ['eur'];

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
    createCreditCardOrder: typeof creditCardOrderFetch;
}

type Props = InjectedIntlProps & ReduxProps & DispatchProps & RouteComponentProps & {
    isLoggedIn: boolean;
    onIframeClose: () => void;
    onPaymentDataChange: () => void;
};

interface State {
    fiatValue: string;
    cryptoValue: string;
    fiat: string;
    crypto: string;
    fiatList: string[];
    cryptoList: string[];
    showModal: boolean;
    swapped: boolean;
    openIframe: boolean;
}

class CreditCardBuyFormWrapComponent extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            fiat: 'eur',
            crypto: 'usdt',
            fiatValue: '',
            cryptoValue: '',
            fiatList: [],
            cryptoList: [],
            showModal: false,
            swapped: false,
            openIframe: false,
        };
    }

    public translate = id => {
        return this.props.intl.formatMessage({ id });
    };

    public onFiatValueChange = e => {
        const { crypto } = this.state;
        const fiatValue = e.target.value;
        const fiatValueNumber = Number(fiatValue);
        let cryptoValue = this.state.cryptoValue;
        if (!Number.isNaN(fiatValueNumber)) {
            const cryptoNumber = this.convertToCrypto(fiatValueNumber);
            const cryptoFormatted = Decimal.format(cryptoNumber, this.getPrecision(crypto));
            cryptoValue = cryptoFormatted.toString();
        }
        this.setState({ fiatValue, cryptoValue });
    };

    public onCryptoValueChange = e => {
        const { fiat } = this.state;
        const cryptoValue = e.target.value;
        const cryptoValueNumber = Number(cryptoValue);
        let fiatValue = this.state.fiatValue;
        if (!Number.isNaN(cryptoValueNumber)) {
            const fiatNumber = this.convertToFiat(cryptoValueNumber);
            const cryptoFormatted = Decimal.format(fiatNumber, this.getPrecision(fiat));
            fiatValue = cryptoFormatted.toString();
        }
        this.setState({ fiatValue, cryptoValue });
    };

    public getPrecision = (currency: string) => {
        const { currencies } = this.props;
        for (const item of currencies) {
            if (item.id.toLowerCase() === currency.toLowerCase()) {
                return item.precision;
            }
        }

        return 2;
    };

    public convertToFiat = (cryptoValue: number): number => {
        if (!cryptoValue) {
            return 0;
        }
        const fiatNoFee = this.convert(cryptoValue, 'fiat');
        const fee = fiatNoFee * 4.5 / 100 + 0.1;

        return fiatNoFee + fee;
    };

    public convertToCrypto = (fiatValue: number, props: Props = this.props): number => {
        const fee = fiatValue * 4.5 / 100 + 0.1;
        const res = fiatValue - fee;
        if (res < 0) {
            return 0;
        }

        return this.convert(res, 'crypto', props);
    };

    public convert = (value: number, target: string, props: Props = this.props): number => {
        const { orderBook } = props;
        const { asks } = orderBook;
        const depth = asks.map(({ avg_price, remaining_volume }) => [avg_price, remaining_volume]);

        // const totalPrice = asks.reduce((sum: number, { price, remaining_volume }) => {
        //     return sum + price * remaining_volume;
        // }, 0);
        // const totalVolume = asks.reduce((sum: number, { remaining_volume }) => {
        //     return Number(sum) + Number(remaining_volume);
        // }, 0);

        const totalPrice2 = getTotalPrice(value.toString(), depth);
        const totalVolume2 = value;
        // const weightedAverage = totalPrice / totalVolume;
        const weightedAverage2 = totalPrice2 / totalVolume2;

        // console.log('depth', depth);
        // console.log('weightedAverage', weightedAverage);
        // console.log('weightedAverage1', weightedAverage2);
        return target === 'fiat' ?
            value * weightedAverage2 :
            value / weightedAverage2;
    };

    public onFiatChange = e => {
        let { crypto } = this.state;
        const fiat = e.value.toLowerCase();
        const cryptoList = this.getAvailableCrypto(fiat);
        if (!cryptoList.includes(crypto)) {
            crypto = cryptoList[0];
        }
        this.setState({ fiat, crypto, cryptoList }, () => {
            this.fetchMarket();
        });
    };

    public onCryptoChange = e => {
        const { fiat } = this.state;
        const crypto = e.value.toLowerCase();
        this.setState({ fiat, crypto }, () => {
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
            history.push(`/signin?redirect_url=${encodeURIComponent('/buycrypto')}`);

            return;
        }
        if (user.level < 4 && user.profile && user.profile.address) {
            history.push(`/confirm?redirect_url=${encodeURIComponent('/buycrypto')}`);

            return;
        }
        this.setState({
            showModal: true,
        });
    };

    public formatTime = () => {
        return moment().format('HH:mm:SS DD.MM.YYYY');
    };

    public componentDidMount() {
        const { fiatValue, cryptoValue, fiat, crypto } = this.state;
        this.props.fetchCurrencies();
        this.props.fetchMarkets();
        this.props.fetchWithdrawLimit();
        this.props.onPaymentDataChange({
            fiat,
            crypto,
            amount: cryptoValue,
            value: fiatValue,
            time: this.formatTime(),
        });

        const { currencies, markets } = this.props;

        if (currencies.length && markets.length) {
            const fiatList = this.getAvailableFiat(this.props);
            const cryptoList = this.getAvailableCrypto(fiat, this.props);
            this.setState({
                fiatList,
                cryptoList,
            }, () => {
                this.fetchMarket();
            });
        }

        window.addEventListener('message', this.onMessage);
    }

    public getFiatForCrypto = (crypto, props = this.props) => {
        const marketsWithCrypto = this.getCryptoFiatMarkets(props)
            .filter(({ base_unit }) => {
                return base_unit === crypto;
            });
        if (!marketsWithCrypto.length) {
            return '';
        }

        return marketsWithCrypto[0].quote_unit;
    };

    public componentWillUnmount() {
        window.removeEventListener('message', this.onMessage);
    }

    public onMessage = event => {
        const action = event.data.action;
        // tslint:disable-next-line
        if (action === 'instex-error-try-again' ||
            action === 'instex-error-close'
        ) {
            this.setState({
                showModal: false,
                openIframe: false,
            });
        }
    };

    public componentDidUpdate() {
        const { fiatValue, cryptoValue, fiat, crypto } = this.state;
        this.props.onPaymentDataChange({
            fiat,
            crypto,
            amount: cryptoValue,
            value: fiatValue,
            time: this.formatTime(),
        });
    }

    public componentWillReceiveProps(nextProps) {
        const { buyWithCreditCard } = this.props;
        if (nextProps.buyWithCreditCard.data.url !== buyWithCreditCard.data.url) {
            this.setState({
                openIframe: true,
                showModal: false,
            });
        }
        const { currencies, markets, history } = this.props;
        if (currencies.length !== nextProps.currencies.length ||
            markets.length !== nextProps.markets.length)
        {
            if (!nextProps.markets.length || !nextProps.currencies.length) { return; }

            const query = qs.parse(history.location.search, { ignoreQueryPrefix: true });
            let crypto = query.curr;

            let { fiat } = this.state;
            const fiatList = this.getAvailableFiat(nextProps);
            const cryptoList = this.getAvailableCrypto(fiat, nextProps);
            if (!this.getAllCrypto(nextProps).includes(crypto)) {
                crypto = cryptoList[0] || 'btc';
            }
            if (query.curr) {
                fiat = this.getFiatForCrypto(crypto, nextProps);
            }
            this.setState({
                fiatList,
                cryptoList,
                crypto,
                fiat,
            }, () => {
                this.fetchMarket();
            });
        }

        if (this.props.orderBook.market !== nextProps.orderBook.market) {
            const { fiatValue, crypto } = this.state;
            const cryptoNumber = this.convertToCrypto(+fiatValue, nextProps);
            const cryptoFormatted = cryptoNumber.toFixed(this.getPrecision(crypto));
            const cryptoValue = cryptoFormatted.toString();
            this.setState({ cryptoValue });
        }
    }

    public getAvailableCrypto = (fiat: string, props = this.props): string[] => {
        const cryptoMarkets = this.getCryptoFiatMarkets(props);
        const marketsWithAvailableFiat = cryptoMarkets.filter(({ state }) => {
            return state === 'enabled';
        }).filter(({ quote_unit }) => {
            return quote_unit === fiat;
        });
        const res = new Set<string>();
        for (const item of marketsWithAvailableFiat) {
            res.add(item.base_unit);
        }

        return Array.from(res);
    };

    public getAllCrypto = (props = this.props) => {
        const cryptoMarkets = this.getCryptoFiatMarkets(props);

        return cryptoMarkets.map(({ base_unit }) => base_unit);
    };

    public getAvailableFiat = (props = this.props): string[] => {
        const { markets } = props;
        const enbledMarkets = markets.filter(({ state }) => {
            return state === 'enabled';
        });
        const marketsWithFiat = enbledMarkets.filter(({ quote_unit }) => {
            return this.isFiat(quote_unit, props);
        });
        const res = new Set<string>();
        for (const item of marketsWithFiat) {
            res.add(item.quote_unit);
        }

        return Array.from(res);
    };

    public getCryptoFiatMarkets = (props: Props = this.props) => {
        const { markets } = props;

        return markets.filter(({ state }) => {
            return state === 'enabled';
        }).filter(({ base_unit }) => {
            return this.isCrypto(base_unit, props);
        }).filter(({ quote_unit }) => {
            return this.isFiat(quote_unit, props);
        });
    };

    public isCrypto = (currency: string, props = this.props) => {
        return this.getCurrenciesByType('coin', props)
            .some(item => item.id === currency);
    };

    public isFiat = (currency: string, props = this.props) => {
        return this.getCurrenciesByType('fiat', props)
            .some(item => item.id.toLowerCase() === currency.toLowerCase());
    };

    public getCurrenciesByType = (type: string, props?) => {
        const { currencies } = (props || this.props);

        return currencies.filter(item => {
            return item.type === type;
        });
    };

    public getButtonTextKey = (): string => {
        const { userLoggedIn, user } = this.props;
        if (userLoggedIn) {
            if (user.level >= 4) {
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
        if (!withdrawLimitData) {
            return 0;
        }
        if (withdrawLimitData.limit === 'unlimited_withdraw_level') {
            return 'unlimited';
        }
        const withdraw = withdrawLimitData.withdraw;

        return `$${withdraw ? withdraw.limit : '0'}`;
    };

    public isButtonDisabled = (): boolean => {
        const { userLoggedIn, user } = this.props;
        const { fiat } = this.state;
        if (!userLoggedIn || user.level < 4) {
            return false;
        }
        const { fiatValue } = this.state;
        const fiatNumber = Number(fiatValue);
        if (fiat.toLowerCase() === 'aed') {
            return fiatNumber < 30;
        }

        return fiatNumber < 1;
    };

    public ableToBuy = () => {
        const { userLoggedIn, user } = this.props;

        return userLoggedIn && user.level >= 4;
    };

    public render() {
        const {
            fiat, crypto,
            fiatList, cryptoList,
            fiatValue, cryptoValue,
            swapped,
            showModal,
        } = this.state;
        const { step, user, userLoggedIn } = this.props;

        return (
            <div className="buy-form" id="bru-crypro-form">
                <div className="section">
                    <div className="section__header">
                        {this.translate('buyWithCard.form.header')}
                    </div>

                    <div className="buy-form__content">
                        <h2>
                            {this.translate('buyWithCard.form.title')}
                            <div className="buy-form__mastercard" />
                        </h2>
                        {this.currenciesForm()}
                        <div className="buy-form__bottom-text">
                            <div>
                                <p>
                                    {this.translate('buyWithCard.form.fees')}
                                    <br />
                                    {this.translate('buyWithCard.overlay1.text1')}
                                </p>
                            </div>
                            <p className="buy-form__bottom-text--help">
                                <a target="_blank" href="https://kb.emirex.com/kb-tickets/new" rel="noopener noreferrer">{this.translate('buyWithCard.form.help')}</a>
                            </p>
                        </div>
                        <button
                            className="buy-form__button-continue"
                            onClick={this.onSubmit}
                            disabled={this.isButtonDisabled()}
                        >
                            {this.translate(this.getButtonTextKey())}
                        </button>

                        <div className="buy-form__bottom-text-mobile">
                            <p className="buy-form__bottom-text--help-mobile">
                                <a target="_blank" href="https://kb.emirex.com/kb-tickets/new" rel="noopener noreferrer">{this.translate('buyWithCard.form.help')}</a>
                            </p>
                        </div>
                    </div>

                    {this.ableToBuy() && <div className="buy-form__limits">
                        <div>
                            <div className="buy-form__limits-item">
                                <div>
                                    <div className="icon-arrow" />
                                    <p>{this.translate('buyWithCard.form.paymentLimit')}:</p>
                                    <span>{' '}{this.getLimit()}</span>
                                </div>
                            </div>
                        </div>
                    </div>}
                    <div className="buy-form__credit-card-overlay">
                        <CreditCardOverlay
                            step={step}
                            user={user}
                            userLoggedIn={userLoggedIn}
                        />
                    </div>
                </div>
                <CreditCardModal
                    showModal={showModal}
                    closeModal={this.closeModal}
                    submitModal={this.submitModal}
                    fiat={fiat}
                    crypto={crypto}
                    fiatValue={fiatValue}
                    cryptoValue={cryptoValue}
                    swapped={swapped}
                    onSwap={this.onSwap}
                    fiatList={fiatList}
                    cryptoList={cryptoList}
                    onFiatValueChange={this.onFiatValueChange}
                    onFiatChange={this.onFiatChange}
                    onCryptoValueChange={this.onCryptoValueChange}
                    onCryptoChange={this.onCryptoChange}
                    isButtonDisabled={this.isButtonDisabled()}
                />
                <Modal
                    show={this.state.openIframe}
                    header={this.renderIframeHeader()}
                    content={this.renderIframe()}
                    footer={this.renderIframeFooter()}
                />
            </div>
        );
    }

    public renderIframe = () => {
        const { buyWithCreditCard } = this.props;

        return (
            <iframe
                src={buyWithCreditCard.data.url}
                className="credit-card__iframe"
                title="CreditCardBuyForm"
            />
        );
    };

    public renderIframeHeader = () => {
        return (
            <div className="buy-form__modal-header">
                <p>{this.translate('buyWithCard.form.modal.header')}</p>
                <div
                    className="buy-form__modal-close"
                    onClick={this.closeIframe}
                >
                    x
                </div>
            </div>
        );
    };

    public renderIframeFooter = () => {
        return null;
    };

    public closeIframe = () => {
        this.props.onIframeClose();
        this.setState({ openIframe: false });
    };

    public currenciesForm = () => {
        const {
            fiat, crypto,
            fiatList, cryptoList,
            fiatValue, cryptoValue,
            swapped,
        } = this.state;
        // const fiatList = ['eur', 'usd'];
        // const cryptoList = ['itn', 't69', 'btc'];

        return (
            <CreditCardForm
                fiat={fiat}
                crypto={crypto}
                fiatValue={fiatValue}
                cryptoValue={cryptoValue}
                swapped={swapped}
                onSwap={this.onSwap}
                fiatList={fiatList}
                cryptoList={cryptoList}
                onFiatValueChange={this.onFiatValueChange}
                onFiatChange={this.onFiatChange}
                onCryptoValueChange={this.onCryptoValueChange}
                onCryptoChange={this.onCryptoChange}
            />
        );
    };

    public onSwap = () => {
        this.setState({ swapped: !this.state.swapped });
    };

    public closeModal = () => {
        this.setState({ showModal: false });
    };

    public submitModal = () => {
        const { createCreditCardOrder } = this.props;
        const { fiat, crypto, fiatValue } = this.state;
        let outcomeCurrencyId;
        let incomeCurrencyId;
        let amount;

        outcomeCurrencyId = fiat;
        incomeCurrencyId = crypto;
        amount = fiatValue;

        createCreditCardOrder({
            outcomeCurrencyId,
            incomeCurrencyId,
            amount: Number(amount),
            type: 'ccPurchase',
        });
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    currencies: selectCurrencies(state),
    markets: selectMarkets(state),
    orderBook: selectOrderBook(state),
    user: selectUserInfo(state),
    userLoggedIn: selectUserLoggedIn(state),
    withdrawLimitData: selectWithdrawLimit(state),
    buyWithCreditCard: state.user.buyWithCreditCard,
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    fetchCurrencies: () => dispatch(currenciesFetch()),
    fetchOrderBook: (market: Market) => dispatch(orderBookFetch(market)),
    fetchMarkets: () => dispatch(marketsFetch()),
    fetchWithdrawLimit: () => dispatch(withdrawLimitFetch()),
    createCreditCardOrder: payload => dispatch(creditCardOrderFetch(payload)),
});

export const CreditCardBuyForm = injectIntl(connect(mapStateToProps, mapDispatchToProps)(withRouter(CreditCardBuyFormWrapComponent)));
