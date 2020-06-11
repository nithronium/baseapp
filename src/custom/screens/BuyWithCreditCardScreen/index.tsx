import * as React from 'react';

import { Helmet } from 'react-helmet';

import {
    CreditCardBuyForm,
    CreditCardFaq,
    CreditCardPromo,
    CreditCardSteps,
} from '../../containers/BuyWithCreditCard';

import { InjectedIntlProps, injectIntl } from 'react-intl';


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

type Props = InjectedIntlProps;

class BuyWithCreditCardScreenComponent extends React.Component<Props> {
    public render() {
        const title = this.props.intl.formatMessage({ id: 'buyWithCard.title' });
        const description = this.props.intl.formatMessage({ id: 'buyWithCard.description' });
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
                        currentStep={1}
                        paymentData={{
                            pair: 'pair',
                            amount: 1,
                            price: 1,
                            value: 1,
                            time: 'time',
                        }}
                    />
                    <CreditCardBuyForm />
                    <CreditCardPromo />
                    <CreditCardFaq />
                </div>
            </div>
        );
    }
}

export const BuyWithCreditCardScreen = injectIntl(BuyWithCreditCardScreenComponent);
