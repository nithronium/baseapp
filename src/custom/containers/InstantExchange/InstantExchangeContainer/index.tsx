
// tslint:disable:jsx-no-lambda ordered-imports

import * as React from 'react';

import { InjectedIntlProps, injectIntl } from 'react-intl';

import { RouteComponentProps, withRouter } from 'react-router';

import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';

import { InstantExchangeForm } from '../InstantExchangeForm';

import { CreditCardFormContainer } from '../../BuyWithCreditCard/CreditCardFormContainer';

import { InstantExchangeFormBottom } from '../InstantExchangeFormBottom';

import {
    creditCardOrderFetch,
    OrderBookState,
    RootState,
    selectUserInfo,
    selectUserLoggedIn,
    selectOrderBook,
    selectWallets,
    User,
    Wallet,
    walletsFetch,
} from '../../../../modules';

import { convert } from '../../BuyWithCreditCard/helpers';


interface ReduxProps {
    user: User;
    userLoggedIn: boolean;
    orderBook: OrderBookState;
    wallets: Wallet[];
}

interface DispatchProps {
    createCreditCardOrder: typeof creditCardOrderFetch;
}

type Props = InjectedIntlProps & ReduxProps & DispatchProps & RouteComponentProps & {
    isLoggedIn: boolean;
    onIframeClose: () => void;
    onPaymentDataChange: () => void;
};

interface ConvertedResponse {
    symbol: string;
    amount: number;
    quote: Array<{
        symbol: string;
        price: number;
    }>;
}

interface State {
    fiatValue: string | null;
    cryptoValue: string | null;
    fiat: string;
    crypto: string;
    fiatList: string[];
    cryptoList: string[];
    showModal: boolean;
    swapped: boolean;
    openIframe: boolean;
    activeBuyPercentage: number;
    activeSellPercentage: number;
    converted: ConvertedResponse;
}

class InstantExchangeContainerComponent extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            fiat: 'eur',
            crypto: 'btc',
            fiatValue: '0',
            cryptoValue: '0',
            fiatList: [],
            cryptoList: [],
            showModal: false,
            swapped: false,
            openIframe: false,
            activeBuyPercentage: 0,
            activeSellPercentage: 0,
            converted: {
                symbol: 'USD',
                amount: 1,
                quote: [],
            },
        };
    }

    public translate = id => {
        return this.props.intl.formatMessage({ id });
    };

    public componentDidMount() {
        window.addEventListener('message', this.onMessage);
        this.props.accountWallets();
    }

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

    public componentWillReceiveProps(nextProps) {
        const { buyWithCreditCard } = this.props;
        if (nextProps.buyWithCreditCard.data.url !== buyWithCreditCard.data.url) {
            this.setState({
                openIframe: true,
                showModal: false,
            });
        }
    }

    public isButtonDisabled = (): boolean => {
        const { userLoggedIn, user } = this.props;
        if (!userLoggedIn || user.level < 4) {
            return false;
        }
        const { fiatValue } = this.state;

        return !(Number(fiatValue) > 0);
    };

    public onSellPercentageChange = activeSellPercentage => {
        const { fiat } = this.state;
        const available = this.getAvailable(fiat);
        this.setState({
            activeSellPercentage,
            activeBuyPercentage: 0,
            fiatValue: (available * activeSellPercentage / 100).toString(),
            cryptoValue: null,
        });
    };

    public onBuyPercentageChange = activeBuyPercentage => {
        const { crypto } = this.state;
        const available = this.getAvailable(crypto);
        this.setState({
            activeBuyPercentage,
            activeSellPercentage: 0,
            cryptoValue: (available * activeBuyPercentage / 100).toString(),
            fiatValue: null,
        });
    };

    public getAvailable = curr => {
        const { wallets } = this.props;
        // const { fiat, crypto } = this.state;
        const wallet = wallets.filter(({ currency }) => currency === curr)[0];
        if (!wallet) {
            return 0;
        }

        return wallet.balance;
    };

    public getPriceInUsd = () => {
        const { orderBook } = this.props;
        const { converted, fiat } = this.state;
        const priceInFiat = convert(1, 'fiat', orderBook);
        const convertedItem = converted.quote.filter(({ symbol }) => {
            return symbol.toLowerCase() === fiat;
        })[0];
        if (!convertedItem) {
            return '';
        }
        const price = convertedItem.price;
        const priceInUsd = priceInFiat / price;

        return priceInUsd.toFixed(2);
    };

    public onBuy = () => {
        const { createCreditCardOrder } = this.props;
        const { fiat, crypto, cryptoValue } = this.state;
        createCreditCardOrder({
            incomeCurrencyId: fiat,
            outcomeCurrencyId: crypto,
            amount: cryptoValue,
            type: 'instantPurchase',
        });
    };

    public onSell = () => {
        const { createCreditCardOrder } = this.props;
        const { fiat, crypto, fiatValue } = this.state;
        createCreditCardOrder({
            incomeCurrencyId: crypto,
            outcomeCurrencyId: fiat,
            amount: fiatValue,
            type: 'instantPurchase',
        });
    };

    public render() {
        const {
            activeSellPercentage, activeBuyPercentage,
            fiat, crypto,
        } = this.state;
        const sellVolume = this.getAvailable(fiat);
        const buyVolume = this.getAvailable(crypto);

        return (
            <div className="buy-form instant-exchange__form">
                <div className="section">
                    <div className="section__header">
                        {this.translate('instantExchange.form.header')}
                    </div>

                    <div className="buy-form__content instant-exchange__form-content">
                        <h2>
                            {this.translate('instantExchange.form.title')}
                            <div className="buy-form__bottom-text--help instant-exchange__form-help">
                                <a target="_blank" rel="noopener noreferrer" href="https://kb.emirex.com/kb-tickets/new">
                                    {this.translate('buyWithCard.form.help')}
                                </a>
                            </div>
                        </h2>
                        {this.currenciesForm()}
                        <div className="instant-exchange__form-volume">
                            <div className="instant-exchange__form-volume-item">
                                {this.translate('instantExchange.form.available')}
                                {' '}
                                {fiat.toUpperCase()}
                                {': '}
                                {sellVolume}
                            </div>
                            <div className="instant-exchange__form-volume-item">
                                {this.translate('instantExchange.form.available')}
                                {' '}
                                {crypto.toUpperCase()}
                                {': '}
                                {buyVolume}
                            </div>

                        </div>
                        <InstantExchangeFormBottom
                            activeSellPercentage={activeSellPercentage}
                            activeBuyPercentage={activeBuyPercentage}
                            onSellPercentageChange={this.onSellPercentageChange}
                            onBuyPercentageChange={this.onBuyPercentageChange}
                            onBuy={this.onBuy}
                            onSell={this.onSell}
                        />
                    </div>
                    <div className="instant-exchange__bottom-price">
                        <div>
                            {this.translate('instantExchange.form.price')}
                            {' '}
                            {crypto.toUpperCase()}:
                            {' '}
                            <span>{this.getPriceInUsd()}$</span>
                        </div>
                    </div>
                </div>
                {/*
                <Modal
                    show={this.state.openIframe}
                    header={this.renderIframeHeader()}
                    content={this.renderIframe()}
                    footer={this.renderIframeFooter()}
                /> */}
            </div>
        );
    }

    public renderIframe = () => {
        const { buyWithCreditCard } = this.props;

        return (
            <iframe
                src={buyWithCreditCard.data.url}
                className="credit-card__iframe"
                title="InstantExchangeIframe"
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

        return (
            <CreditCardFormContainer
                fiat={fiat}
                crypto={crypto}
                fiatValue={fiatValue}
                cryptoValue={cryptoValue}
                swapped={swapped}
                onSwap={this.onSwap}
                fiatList={fiatList}
                cryptoList={cryptoList}
                onChange={this.onChange}
                Component={InstantExchangeForm}
                cryptoForFiatOnly={false}
            />
        );
    };


    public onChange = partialState => {
        const { keepPercentage, ...partialStateRest } = partialState;
        let newPartialState = { ...partialStateRest };
        if (!keepPercentage && (partialState.fiatValue || partialState.cryptoValue)) {
            newPartialState = {
                ...partialState,
                activeSellPercentage: 0,
                activeBuyPercentage: 0,
            };
        }
        this.setState(newPartialState);
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

        createCreditCardOrder({
            outcomeCurrencyId: fiat,
            incomeCurrencyId: crypto,
            amount: Number(fiatValue),
            type: 'instantPurchase',
        });
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    user: selectUserInfo(state),
    userLoggedIn: selectUserLoggedIn(state),
    buyWithCreditCard: state.user.buyWithCreditCard,
    orderBook: selectOrderBook(state),
    wallets: selectWallets(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    createCreditCardOrder: payload => dispatch(creditCardOrderFetch(payload)),
    accountWallets: () => dispatch(walletsFetch()),
});

export const InstantExchangeContainer = injectIntl(connect(mapStateToProps, mapDispatchToProps)(withRouter(InstantExchangeContainerComponent)));
