import * as React from 'react';

import { Helmet } from 'react-helmet';

import { InjectedIntlProps, injectIntl } from 'react-intl';

import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';

import {
    RootState,
    selectUserInfo,
    selectUserLoggedIn,
    User,
} from '../../../modules';

import {
    CreditCardBuyForm,
    CreditCardFaq,
    CreditCardPromo,
    CreditCardSteps,
} from '../../containers/BuyWithCreditCard';


const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [{
        '@type': 'Question',
        name: 'Is it safe to buy cryptocurrency?',
        acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, it is definitely safe to purchase any cryptocurrency. Emirex is the Middle East largest Crypto Exchange',
        },
    }, {
        '@type': 'Question',
        name: 'Which is the best cryptocurrency to buy now?',
        acceptedAnswer: {
            '@type': 'Answer',
            text: 'BTC, LTC, ETH, EMRX - this list is based on the potential of these cryptocurrencies to show sustainable growth in the months ahead.',
        },
    }, {
        '@type': 'Question',
        name: 'What can i do with my cryptocurrency?',
        acceptedAnswer: {
            '@type': 'Answer',
            text: 'Сryptocurrency have a wide range of use cases. For example: use crypto to pay for goods or services, send and receive payments at a low cost and at a high speed, invest and earn money, buy real estate.',
        },
    },
    {
        '@type': 'Question',
        name: 'How can I buy Cryptocurrency online?',
        acceptedAnswer: {
            '@type': 'Answer',
            text: 'You can buy cryptocurrency wiht credit card or debit card, with bank transfer (SWIFT/SEPA) or crypto, with money (make a deposit on your USD/EUR/AED).',
        },
    }],
};

interface ReduxProps {
    user: User;
    userLoggedIn: boolean;
}

interface State {
    orderFinished: boolean;
    successIframeLoaded: boolean;
    paymentData: {
        amount: number;
        pair: string;
        price: number;
        value: number;
        time: string;
    };
}

type Props = InjectedIntlProps;

class BuyWithCreditCardScreenComponent extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            orderFinished: false,
            successIframeLoaded: false,
            paymentData: {
                amount: 0,
                pair: '',
                price: 0,
                value: 0,
                time: '',
            },
        };
    }

    public componentDidMount() {
        window.addEventListener('message', this.onMessage);
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

    public onTryAgain = () => {
        this.setState({
            orderFinished: false,
            successIframeLoaded: false,
        });
    };

    public onIframeClose = () => {
        const { successIframeLoaded } = this.state;
        if (successIframeLoaded) {
            this.setState({ orderFinished: true });
        }
    };

    public onPaymentDataChange = paymentData => {
        this.setState({ paymentData });
    };

    public render() {
        const title = this.props.intl.formatMessage({ id: 'buyWithCard.title' });
        const description = this.props.intl.formatMessage({ id: 'buyWithCard.description' });
        const { userLoggedIn, user } = this.props;
        const { orderFinished, paymentData } = this.state;
        let step = 1;

        if (orderFinished) {
            step = 4;
        } else if (user.level >= 4) {
            step = 3;
        } else if (userLoggedIn) {
            step = 2;
        }
        return (
            <div className="pg-buy-with-credit-card">
                <Helmet>
                    <link rel="canonical" href="https://emirex.com/buycrypto" />
                    <title>{title}</title>
                    <meta name="description" content={description} />
                    <link rel="alternate" href="https://emirex.com/buycrypto" hrefLang="en" title="English" />
                    <link rel="alternate" href="https://emirex.com/ru/buycrypto" hrefLang="ru" title="Русский" />
                    <link rel="alternate" href="https://emirex.com/zh/buycrypto" hrefLang="zh" title="中国人" />
                    <script type="application/ld+json">
                        {JSON.stringify(jsonLd)}
                    </script>
                </Helmet>
                <div className="pg-buy-with-credit-card__container">
                    <CreditCardSteps
                        currentStep={step}
                        paymentData={paymentData}
                    />
                    <CreditCardBuyForm
                        onPaymentDataChange={this.onPaymentDataChange}
                        step={step}
                        onIframeClose={this.onIframeClose}
                    />
                    <CreditCardPromo />
                    <CreditCardFaq />
                </div>
            </div>
        );
    }
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    user: selectUserInfo(state),
    userLoggedIn: selectUserLoggedIn(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<{}, {}> = () => ({
});

export const BuyWithCreditCardScreen = injectIntl(connect(mapStateToProps, mapDispatchToProps)(BuyWithCreditCardScreenComponent));
