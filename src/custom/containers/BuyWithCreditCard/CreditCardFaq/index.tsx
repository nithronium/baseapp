import * as React from 'react';

import Collapsible from 'react-collapsible';

import { InjectedIntlProps, injectIntl } from 'react-intl';


type Props = InjectedIntlProps;

class CreditCardFaqComponent extends React.Component<Props> {
    public translate = id => {
        return this.props.intl.formatMessage({ id });
    };

    public render() {
        return (
            <div className="credit-card-faq">
                <div className="section">
                    <div className="section__header">
                        {this.translate('buyWithCard.faq.header')}
                    </div>


                    <div className="credit-card-faq__wrapper">
                        <div className="credit-card-faq__inner">
                            {[1, 2, 3, 4, 5].map(index => (
                                <div className="credit-card-faq__item" key={index}>
                                    <Collapsible
                                        trigger={this.translate(`buyWithCard.faq.header${index}`)}
                                        triggerClassName="credit-card-faq__header"
                                        triggerOpenedClassName="credit-card-faq__header--opened"
                                        transitionTime={100}
                                    >
                                        <div className="credit-card-faq__text">
                                            {this.translate(`buyWithCard.faq.text${index}`)}
                                        </div>
                                    </Collapsible>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export const CreditCardFaq = injectIntl(CreditCardFaqComponent);
