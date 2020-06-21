import * as React from 'react';

import { InjectedIntlProps, injectIntl } from 'react-intl';


type Props = InjectedIntlProps;

class CreditCardHeaderComponent extends React.Component<Props> {
    public translate = id => {
        return this.props.intl.formatMessage({ id });
    };

    public render() {
        return (
            <div className="credit-card-header">
                <div className="pg-buy-with-credit-card__container">
                    <div className="credit-card-header__wrap">
                        <div className="credit-card-header__left">
                            <div className="credit-card-header__title">
                                {this.translate('buyWithCard.header.title')}
                            </div>
                            <div className="credit-card-header__text">
                                {this.translate('buyWithCard.header.text')}
                            </div>
                        </div>
                        <div className="credit-card-header__icon" />
                    </div>
                </div>
            </div>
        );
    }
}

export const CreditCardHeader = injectIntl(CreditCardHeaderComponent);
