import * as React from 'react';

import { InjectedIntlProps, injectIntl } from 'react-intl';

import { RouteComponentProps, withRouter } from 'react-router';

import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';

import { ChatelloOverlay } from '../ChatelloOverlay';

import {
    Modal,
  } from '../../../../components';

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

import {
    fetchItemIEO,
    selectCurrentIEO,
} from '../../../../plugins/ieo/modules';

import { WithdrawLimit } from '../../../../modules/user/withdrawLimit';

const CHATELLA_IEO_ID = 5;


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
    fetchItemIEO: typeof fetchItemIEO;
}

type Props = InjectedIntlProps & ReduxProps & DispatchProps & RouteComponentProps & {
    isLoggedIn: boolean;
    amount: number;
    onOrderAmountChange: () => void;
    onOrderSubmit: () => void;
    onIframeClose: () => void;
    step: number;
};

interface State {
    usdValue: string;
    chaValue: string;
    fiat: string;
    crypto: string;
    fiatList: string[];
    cryptoList: string[];
    showModal: boolean;
    openIframe: boolean;
}

class ChatelloFormComponent extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            fiat: 'usd',
            crypto: 'cha',
            usdValue: '0',
            chaValue: '0',
            fiatList: [],
            cryptoList: [],
            showModal: false,
            openIframe: false,
        };
    }

    public translate = id => {
        return this.props.intl.formatMessage({ id });
    };

    public onUsdValueChange = e => {
        const usdValue = e.target.value;
        const usdValueNumber = Number(usdValue);
        let chaValue = this.state.chaValue;
        if (!Number.isNaN(usdValueNumber)) {
            chaValue = this.convertToCha(usdValueNumber).toString();
        }
        this.setState({ usdValue, chaValue });
        this.props.onOrderAmountChange(chaValue);
    };

    public onChaValueChange = e => {
        const chaValue = e.target.value;
        const chaValueNumber = Number(chaValue);
        let usdValue = this.state.usdValue;
        if (!Number.isNaN(chaValueNumber)) {
            usdValue = this.convertFromCha(chaValueNumber).toString();
        }
        this.setState({ usdValue, chaValue });
        this.props.onOrderAmountChange(chaValue);
    };

    public getRate = (props: Props = this.props): number => {
        let { ieo } = props;
        const pairs = [{id: 5, sale_id: 5, quote_currency_id: 'usd', price: '1.0' }];
        ieo = ieo || { pairs };
        const actualPairs = ieo && ieo.pairs && ieo.pairs.length ? ieo.pairs : pairs;
        let usdPair = pairs[0];

        for (const pair of actualPairs) {
            if (pair.quote_currency_id === 'usd') {
                usdPair = pair;
            }
        }

        return Number(usdPair.price);
    };

    public convertToCha = (usdValue: number, props: Props = this.props): number => {
        return this.trimNumber(usdValue / this.getRate(props) * 2, 4);
    };

    public convertFromCha = (chaValue, props: Props = this.props): number => {
        return this.trimNumber(chaValue * this.getRate(props) / 2, 2);
    };

    public trimNumber = (value, precision) => {
        const valueNum = parseFloat(value);
        if (isNaN(valueNum)) {
            return value;
        }

        return Number(value.toFixed(precision));
    };

    public onSubmit = () => {
        const { userLoggedIn, history, user, amount } = this.props;
        let url = '/chatello';


        if (amount) {
            url = `${url}/${amount}`;
        }


        if (!userLoggedIn) {
            history.push(`/signup?redirect_url='/chatello'`);

            return;
        }
        if (user.level < 4 && user.profile && user.profile.address) {
            history.push(`/confirm?redirect_url='/chatello'`);
        }
        this.setState({
            showModal: true,
        });
    };

    public componentDidMount() {
        const { amount } = this.props;
        this.props.fetchWithdrawLimit();
        this.props.fetchItemIEO();

        if (amount) {
            this.onChaValueChange({ target: { value: Number(amount) } });
        }

        window.addEventListener('message', this.onMessage);
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
        const { buyWithCreditCard, ieo } = this.props;
        if (nextProps.buyWithCreditCard.data.url !== buyWithCreditCard.data.url) {
            this.setState({
                openIframe: true,
                showModal: false,
            });
        }
        if ((!ieo && nextProps.ieo)) {
            this.setState({
                usdValue: this.convertFromCha(Number(this.state.chaValue), nextProps).toString(),
            });
        }
    }

    public getButtonTextKey = (): string => {
        const { userLoggedIn, user } = this.props;
        if (userLoggedIn) {
            if (user.level >= 4) {
                return 'chatello.form.buttonBuy';
            } else {
                return 'buyWithCard.form.buttonNotVerified';
            }
        } else {
            return 'buyWithCard.form.buttonNotLogged';
        }
    };

    public getMinLimit = () => {
        let { ieo } = this.props;
        ieo = ieo || { min_amount: 0, max_amount: 0 };

        return ieo.min_amount * 2;
    };

    public getMaxLimit = () => {
        let { ieo } = this.props;
        ieo = ieo || { min_amount: 0, max_amount: 0 };

        return ieo.max_amount * 2;
    };

    public render() {
        const { step, userLoggedIn, user, amount } = this.props;

        return (
            <div className="buy-form">
                <div className="section">
                    <div className="section__header">
                        {this.translate('chatello.form.header')}
                    </div>

                    <div className="buy-form__content">
                        <h2>
                            {this.translate('chatello.form.title')}
                            <div className="pg-chatello__overlay-visa" />
                        </h2>
                        {this.currenciesForm(false)}
                        <div className="buy-form__bottom-text">
                            <p>
                                {this.translate('buyWithCard.form.fees')}
                                <br />
                                {this.translate('chatello.form.convertation')}
                            </p>
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

                    <div className="buy-form__limits">
                        <div>
                            <div className="buy-form__limits-item">
                                <div>
                                    <div className="icon-arrow" />
                                    <p>Min amount:</p>
                                    <span>{' '}{this.getMinLimit()} CHA</span>
                                </div>
                                <div>
                                    <div className="icon-arrow" />
                                    <p>Max amount:</p>
                                    <span>{' '}{this.getMaxLimit()} CHA</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ChatelloOverlay
                        step={step}
                        userLoggedIn={userLoggedIn}
                        user={user}
                        amount={amount}
                    />
                </div>
                <Modal
                    show={this.state.showModal}
                    header={this.renderModalHeader()}
                    content={this.renderModalBody()}
                    footer={this.renderModalFooter()}
                />
                <div className="pg-chatello__iframe-modal">
                    <Modal
                        show={this.state.openIframe}
                        header={this.renderIframeHeader()}
                        content={this.renderIframe()}
                        footer={this.renderIframeFooter()}
                    />
                </div>
            </div>
        );
    }

    public renderIframe = () => {
        const { buyWithCreditCard } = this.props;

        return (
            <iframe
                title="ChatelloFrame"
                src={buyWithCreditCard.data.url}
                className="credit-card__iframe"
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

    public isButtonDisabled = () => {
        const { userLoggedIn, user } = this.props;
        const { chaValue } = this.state;
        const chaNumber = Number(chaValue);
        if (userLoggedIn) {
            if (user.level >= 4) {
                const min = Number(this.getMinLimit());
                const max = Number(this.getMaxLimit());
                if (chaNumber < min || chaNumber > max) {
                    return true;
                }
            }
        }

        return false;
    };

    public currenciesForm = (isModal: boolean) => {
        const {
            usdValue, chaValue,
        } = this.state;

        return (
            <div className="buy-form__inputs-wrap">
                <div className="buy-form__inputs-top">
                    <div className="buy-form__input-wrap">
                        <label className="buy-form__label">
                            {this.translate('buyWithCard.form.buy')}
                        </label>
                        <input
                            onChange={this.onChaValueChange}
                            value={chaValue}
                            className="buy-form__input"
                            type="number"
                        />
                        <div className="pg-chatello__input-currency">CHA</div>
                    </div>

                    {!isModal && <div className="pg-chatello__buttons--mobile">
                        <div
                            className="pg-chatello__button"
                            onClick={this.click200}
                        >
                            <span className="pg-chatello__plus100-icon" />
                            + 200 CHA
                        </div>
                        <div
                            className="pg-chatello__button"
                            onClick={this.click1000}
                        >
                            <span className="pg-chatello__plus200-icon" />
                            <span className="pg-chatello__button-text">+ 1000 CHA</span>
                        </div>
                    </div>}

                    <div className="buy-form__input-wrap">
                        <label className="buy-form__label">
                            {this.translate('chatello.form.sell')}
                        </label>
                        <input
                            onChange={this.onUsdValueChange}
                            value={usdValue}
                            className="buy-form__input"
                            type="number"
                        />
                        <div className="pg-chatello__input-currency">USD</div>
                    </div>
                </div>
                {!isModal && <div className="pg-chatello__buttons">
                    <div
                        className="pg-chatello__button"
                        onClick={this.click200}
                    >
                        <span className="pg-chatello__plus100-icon" />
                        + 200 CHA
                    </div>
                    <div
                        className="pg-chatello__button"
                        onClick={this.click1000}
                    >
                        <span className="pg-chatello__plus200-icon" />
                        <span className="pg-chatello__button-text">+ 1000 CHA</span>
                    </div>
                </div>}
            </div>
        );
    };

    public click200 = () => {
        this.onChaValueChange({ target: { value: 200 } });
    };

    public click1000 = () => {
        this.onChaValueChange({ target: { value: 1000 } });
    };

    public closeModal = () => {
        this.props.onIframeClose();
        this.setState({ showModal: false });
    };

    public renderModalHeader = () => {
        return (
            <div className="buy-form__modal-header">
                <p>{this.translate('chatello.form.header')}</p>
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
        let { fiat, crypto } = this.state;
        const { usdValue, chaValue } = this.state;
        fiat = fiat || '';
        crypto = crypto || '';

        return (
            <div>
                <div className="buy-form__modal-amount">
                    {this.translate('buyWithCard.form.buy')} {' '}
                    <span>{chaValue}
                    {' '}
                    {crypto.toUpperCase()}</span>
                    {' '}{this.translate('buyWithCard.form.for')}{' '}
                    <span>{usdValue} {fiat.toUpperCase()}</span>
                </div>

                <div className="buy-form__modal-inputs">
                    {this.currenciesForm(true)}
                </div>
                <div className="buy-form__modal-divider">
                    <div className="credit-card-promo__divider">
                        <div className="credit-card-promo__divider-arrow" />
                    </div>
                </div>

                <div className="buy-form__modal-table">
                    <div className="buy-form__modal-table-top">
                        <span>{this.translate('buyWithCard.form.modal.pay')}</span>
                        <span>{usdValue}
                        {' '}
                        {fiat.toUpperCase()}</span>
                    </div>
                    <div className="buy-form__modal-table-bottom">
                        <span>{this.translate('buyWithCard.form.modal.get')}</span>
                        <span>{chaValue}
                        {' '}
                        {crypto.toUpperCase()}</span>
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
                    <button
                        className="buy-form__modal-footer-button"
                        onClick={this.submitModal}
                        disabled={this.isButtonDisabled()}
                    >
                        {this.translate('buyWithCard.form.modal.buttonBuy')}
                    </button>
                </div>
            </div>
        );
    };

    public submitModal = () => {
        const { createCreditCardOrder, onOrderSubmit } = this.props;
        const { fiat, crypto, usdValue } = this.state;
        const outcomeCurrencyId = fiat;
        const incomeCurrencyId = crypto;
        const amount = usdValue;

        onOrderSubmit();
        createCreditCardOrder({
            outcomeCurrencyId,
            incomeCurrencyId,
            amount: Number(amount),
            type: 'ccPurchase',
            sale_id: CHATELLA_IEO_ID,
        });
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
    buyWithCreditCard: state.user.buyWithCreditCard,
    ieo: selectCurrentIEO(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    fetchCurrencies: () => dispatch(currenciesFetch()),
    fetchItemIEO: () => dispatch(fetchItemIEO(CHATELLA_IEO_ID)),
    fetchOrderBook: payload => dispatch(orderBookFetch(payload)),
    fetchMarkets: () => dispatch(marketsFetch()),
    fetchWithdrawLimit: () => dispatch(withdrawLimitFetch()),
    createCreditCardOrder: payload => dispatch(creditCardOrderFetch(payload)),
});

export const ChatelloForm = injectIntl(connect(mapStateToProps, mapDispatchToProps)(withRouter(ChatelloFormComponent)));
