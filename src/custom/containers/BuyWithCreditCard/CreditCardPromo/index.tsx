import * as React from 'react';

import { InjectedIntlProps, injectIntl } from 'react-intl';


type Props = InjectedIntlProps;

class CreditCardPromoComponent extends React.Component<Props> {
    public translate = id => {
        return this.props.intl.formatMessage({ id });
    };

    public render() {
        return (
            <div className="credit-card-promo">
                <div className="credit-card-promo__top">
                    {[1, 2, 3].map(index => (<div className="credit-card-promo__top-item" key={index}>
                        <div className="credit-card-promo__number">{index}</div>
                            {' '}
                            {this.translate(`buyWithCard.promo${index}`)}
                        </div>))}
                </div>
                <div className="credit-card-promo__divider">
                    <div className="credit-card-promo__divider-arrow" />
                </div>
                <div className="credit-card-promo__header">
                    {this.translate('buyWithCard.promo.why')}
                </div>

                <div className="credit-card-promo__bottom">
                    {[1, 2, 3].map(index => (
                        <div className="credit-card-promo__bottom-item" key={index}>
                            <div className={`credit-card-promo__icon${index}`} />
                            <div className="credit-card-promo__bottom-header">
                                {this.translate(`buyWithCard.promo.header${index}`)}
                            </div>
                            <div className="credit-card-promo__bottom-text">
                                {this.translate(`buyWithCard.promo.text${index}`)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export const CreditCardPromo = injectIntl(CreditCardPromoComponent);
