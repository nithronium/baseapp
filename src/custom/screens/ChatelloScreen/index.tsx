
import * as React from 'react';

import { RouteProps } from 'react-router';

import { withRouter } from 'react-router-dom';

import { Helmet } from 'react-helmet';

import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';

import {
    Currency,
    Market,
    OrderBookState,
    RootState,
    selectCurrencies,
    selectMarkets,
    selectOrderBook,
    selectUserInfo,
    selectUserLoggedIn,
    selectWithdrawLimit,
    User,
} from '../../../modules';

import { WithdrawLimit } from '../../../modules/user/withdrawLimit';

import {
    ChatelloForm,
    ChatelloInfo,
    ChatelloSteps,
    ChatelloTop,
    ChatelloTop2,
} from '../../containers/Chatello';

import { InjectedIntlProps, injectIntl } from 'react-intl';

interface ReduxProps {
    currencies: Currency[];
    markets: Market[];
    orderBook: OrderBookState;
    user: User;
    userLoggedIn: boolean;
    withdrawLimitData: WithdrawLimit;
}

type Props = InjectedIntlProps & RouteProps & ReduxProps;

export interface State {
    orderAmount: number;
    orderFinished: boolean;
    orderSubmitTime: number;
    prevStorageChangeTime: number | null;
    orderSubmitted: boolean;
    successIframeLoaded: boolean;
}

class ChatelloScreenComponent extends React.Component<Props, State> {
    public myRef: React.RefObject<HTMLDivElement>;

    constructor(props) {
        super(props);
        this.state = {
            orderAmount: 0,
            orderFinished: false,
            orderSubmitTime: Date.now() + 1e10,
            prevStorageChangeTime: null,
            orderSubmitted: false,
            successIframeLoaded: false,
        };
        this.myRef = React.createRef();
    }

    public onOrderAmountChange = (orderAmount: number) => {
        this.setState({ orderAmount });
    };

    public onTryAgain = () => {
        this.setState({
            orderFinished: false,
            orderSubmitted: false,
            successIframeLoaded: false,
        });
    };

    public componentDidMount() {
        window.addEventListener('message', this.onMessage);
        const visited = localStorage.getItem('visited-chatello');
        if (!visited) {
            localStorage.setItem('visited-chatello', 'true');
        } else {
            this.scrollToMyRef();
        }
    }

    public componentWillUnmount() {
        window.removeEventListener('message', this.onMessage);
    }

    public onMessage = event => {
        const action = event.data.action;
        // tslint:disable-next-line
        if (action === 'instex-success-ok' ||
            action === 'instex-success-close'
        ) {
            this.setState({
                orderFinished: true,
            });
        }

        if (action === 'instex-success') {
            this.setState({ successIframeLoaded: true });
        }
    };

    public onOrderSubmit = () => {
        this.setState({
            orderSubmitTime: Date.now(),
            orderSubmitted: true,
        });
    };

    public onIframeClose = () => {
        const { successIframeLoaded } = this.state;
        if (successIframeLoaded) {
            this.setState({ orderFinished: true });
        }
    };

    public scrollToMyRef = () => {
        setTimeout(() => {
            if (this.myRef.current) {
                console.log('ref offset', this.myRef.current.offsetTop + 60);
                window.scrollTo(0, this.myRef.current.offsetTop + 60);
            } else {
                console.log('no ref');
            }
        }, 1500);
    };

    public render() {
        const { orderAmount, orderFinished } = this.state;
        const title = this.props.intl.formatMessage({ id: 'chatello.page.title' });
        const description = this.props.intl.formatMessage({ id: 'chatello.page.description' });
        const { match, user, userLoggedIn } = this.props;
        const amount = match.params.amount;
        let step = 1;

        if (orderFinished) {
            step = 4;
        } else if (user.level >= 2) {
            step = 3;
        } else if (userLoggedIn) {
            step = 2;
        }

        // step = 4;

        return (
            <div className="pg-buy-with-credit-card pg-chatello" style={{ overflowAnchor: 'none' }}>
                <Helmet>
                    <title>{title}</title>
                    <meta name="description" content={description} />
                    <link
                        rel="canonical"
                        href={`https://emirex.com/chatello`}
                        data-react-helmet="true"
                    />
                </Helmet>
                <ChatelloTop />
                <ChatelloTop2 />
                <div
                    className="pg-buy-with-credit-card__container"
                    ref={this.myRef}
                >
                    <ChatelloSteps
                        currentStep={step}
                        paymentData={{
                            pair: 'pair',
                            amount: orderAmount,
                            price: 1,
                            value: 1,
                            time: 'time',
                        }}
                        onTryAgain={this.onTryAgain}
                        userLoggedIn={userLoggedIn}
                    />
                    {step !== 4 && <ChatelloForm
                        amount={amount}
                        onOrderAmountChange={this.onOrderAmountChange}
                        step={step}
                        onOrderSubmit={this.onOrderSubmit}
                        onIframeClose={this.onIframeClose}
                    />}
                    <ChatelloInfo />
                </div>
            </div>
        );
    }
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

const mapDispatchToProps: MapDispatchToPropsFunction<{}, {}> = () => ({
});

export const ChatelloScreen = connect(mapStateToProps, mapDispatchToProps)(
    withRouter(injectIntl(ChatelloScreenComponent)),
);
