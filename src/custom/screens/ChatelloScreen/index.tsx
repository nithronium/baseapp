
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
}

class ChatelloScreenComponent extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            orderAmount: 0,
            orderFinished: false,
        };
    }

    public onOrderAmountChange = (orderAmount: number) => {
        this.setState({ orderAmount });
    };

    public onTryAgain = () => {
        this.setState({
            orderFinished: false,
        });
    };

    public render() {
        const { orderAmount, orderFinished } = this.state;
        const title = this.props.intl.formatMessage({ id: 'buyWithCard.title' });
        const description = this.props.intl.formatMessage({ id: 'buyWithCard.description' });
        const { match, user, userLoggedIn } = this.props;
        const amount = match.params.amount;
        let step = 1;

        if (orderFinished) {
            step = 4;
        } else if (user.level >= 4) {
            step = 3;
        } else if (userLoggedIn) {
            step = 2;
        }

        // step = 4;

        return (
            <div className="pg-buy-with-credit-card pg-chatello">
                <Helmet>
                    <link rel="canonical" href="https://emirex.com/buycrypto" />
                    <title>{title}</title>
                    <meta name="description" content={description} />
                    <link rel="alternate" href="https://emirex.com/buycrypto" hrefLang="en" title="English" />
                    <link rel="alternate" href="https://emirex.com/ru/buycrypto" hrefLang="ru" title="Русский" />
                    <link rel="alternate" href="https://emirex.com/zh/buycrypto" hrefLang="zh" title="中国人" />
                </Helmet>
                <ChatelloTop />
                <div className="pg-buy-with-credit-card__container">
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
