
import * as React from 'react';

import { InjectedIntlProps, injectIntl } from 'react-intl';


type Props = InjectedIntlProps;

class InstantExchangeInfoComponent extends React.Component<Props> {
    public translate = id => {
        return this.props.intl.formatMessage({ id });
    };

    public render() {
        return (
            <div className="instant-exchange__info">
                <div className="instant-exchange__info-top">
                    {[1, 2, 3, 4].map(index => {
                        return (
                            <div
                                className="instant-exchange__info-top-item"
                                key={index}
                            >
                                <div className="instant-exchange__info-top-number">
                                    {index}
                                </div>
                                <div className="instant-exchange__info-top-text">
                                    {this.translate(`instantExchange.info.top${index}`)}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="credit-card-promo__divider">
                    <div className="credit-card-promo__divider-arrow" />
                </div>

                <div className="instant-exchange__info-middle">
                    <div className="instant-exchange__info-middle-left">
                        <h2>{this.translate('instantExchange.info.header')}</h2>
                        <p>{this.translate('instantExchange.info.text1')}</p>
                        <p>{this.translate('instantExchange.info.text2')}</p>
                    </div>

                    <div className="instant-exchange__info-middle-right">
                        <div className="instant-exchange__info-middle-image" />
                    </div>
                </div>
                <div className="credit-card-promo__divider">
                    <div className="credit-card-promo__divider-arrow" />
                </div>

                <div className="instant-exchange__info-bottom">
                    {[1, 2, 3, 4, 5].map(index => {
                        return (
                            <div
                                className="instant-exchange__info-bottom-item"
                                key={index}
                            >
                                <div className={`instant-exchange__info-bottom-icon${index}`}/>
                                <div className="instant-exchange__info-bottom-wrap">
                                    <div className="instant-exchange__info-bottom-header">
                                        {this.translate(`instantExchange.info.bottom.header${index}`)}
                                    </div>
                                    <div className="instant-exchange__info-bottom-text">
                                        {this.translate(`instantExchange.info.bottom.text${index}`)}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export const InstantExchangeInfo = injectIntl(InstantExchangeInfoComponent);
