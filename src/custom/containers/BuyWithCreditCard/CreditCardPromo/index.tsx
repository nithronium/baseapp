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
                <div className="credit-card-promo__header">
                    {this.translate('buyWithCard.promo.why')}
                </div>

                <div className="credit-card-promo__top">
                    <div className="credit-card-promo__top-inner">
                        {[1, 2, 3].map(index => (
                            <div className="credit-card-promo__top-item" key={index}>
                                <div className={`credit-card-promo__icon${index}`} />
                                <div className="credit-card-promo__top-header">
                                    {this.translate(`buyWithCard.promo.header${index}`)}
                                </div>
                                <div className="credit-card-promo__top-text">
                                    {this.translate(`buyWithCard.promo.text${index}`)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="credit-card-promo__middle">
                    <div className="credit-card-promo__map">
                        <div className="credit-card-promo__map-right">
                            <h2>{this.translate('buyWithCard.info.header1')}</h2>
                            <p>{this.translate('buyWithCard.info.text1')}</p>

                            <div className="credit-card-promo__button1">
                                <button
                                    className="buy-form__button-continue"
                                >
                                    {this.translate('buyWithCard.info.button1')}
                                </button>
                            </div>
                        </div>
                        <div className="credit-card-promo__map-image" />
                    </div>

                    <div className="credit-card-promo__divider">
                        <div className="credit-card-promo__divider-arrow" />
                    </div>

                    <h2>
                        {this.translate('buyWithCard.info.header2')}
                    </h2>
                    <p>
                        {this.translate('buyWithCard.info.text2')}
                    </p>
                    <div className="credit-card-promo__middle-icons">
                        <div className="credit-card-promo__middle-icon1" />
                        <div className="credit-card-promo__middle-icon2" />
                        <div className="credit-card-promo__middle-icon3" />
                        <div className="credit-card-promo__middle-icon4" />
                    </div>
                    <p>
                        {this.translate('buyWithCard.info.text3')}
                    </p>
                </div>

                <div className="credit-card-promo__bottom">
                    <h2>
                        {this.translate('buyWithCard.info.header3')}
                    </h2>
                    <p>
                        {this.translate('buyWithCard.info.text4')}
                    </p>
                    <div className="credit-card-promo__bottom-items">
                        {[1, 2, 3, 4, 5].map(index => {
                            return (
                                <div className="credit-card-promo__bottom-item" key={index}>
                                    <div className={`credit-card-promo__bottom-icon${index}`} />
                                    <div className="credit-card-promo__bottom-item-text">
                                        {this.translate(`buyWithCard.info.item${index}`)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <p>
                        {this.translate('buyWithCard.info.text5')}
                    </p>
                    <div className="credit-card-promo__bottom-button">
                        <button className="buy-form__modal-footer-button">
                            {this.translate('buyWithCard.info.button2')}
                        </button>
                    </div>

                </div>
            </div>
        );
    }
}

export const CreditCardPromo = injectIntl(CreditCardPromoComponent);
