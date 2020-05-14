import * as React from 'react';

import {
    CreditCardBuyForm,
} from '../../containers/BuyWithCreditCard';


class BuyWithCreditCardScreenComponent extends React.Component {
    public render() {
        return (
            <div className="pg-buy-with-credit-card">
                <div className="pg-buy-with-credit-card__container">
                    <CreditCardBuyForm />
                </div>
            </div>
        );
    }
}

export const BuyWithCreditCardScreen = BuyWithCreditCardScreenComponent;
