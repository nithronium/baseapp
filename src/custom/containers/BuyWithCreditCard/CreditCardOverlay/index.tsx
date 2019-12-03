import * as React from 'react';

import { InjectedIntlProps, injectIntl } from 'react-intl';

import { RouteComponentProps, withRouter } from 'react-router';

import {
    User,
} from '../../../../modules';

type Props = InjectedIntlProps & RouteComponentProps & {
    step: number;
    userLoggedIn: boolean;
    user: User;
};

export class CreditCardOverlayComponent extends React.Component<Props> {
    public translate = id => {
        return this.props.intl.formatMessage({ id });
    };

    public render() {
        const { step } = this.props;
        if (step > 2) {
            return null;
        }
        const footerText = step === 1 ? 'buyWithCard.overlay1.footer' : 'buyWithCard.overlay2.footer';

        return (
            <div className="pg-chatello__overlay credit-card-overlay">
                {step === 1 ? this.renderOverlay1() : this.renderOverlay2()}
                {step === 2 && <div className="pg-chatello__overlay-footer">
                    {this.translate(footerText)}
                </div>}
            </div>
        );
    }

    public handleButton = () => {
        const { history, step } = this.props;

        const url = '/buycrypto';

        if (step === 1) {
            history.push(`/signup?redirect_url=${encodeURIComponent(url)}`);
            return;
        }
        if (step === 2) {
            history.push(`/confirm?redirect_url=${encodeURIComponent(url)}`);
        }
    };

    public renderOverlay1 = () => {
        return (
            <div className="pg-chatello__overlay-wrap">
                <div className="pg-chatello__overlay-header">
                    {this.translate('buyWithCard.overlay1.header')}
                    <div className="credit-card-overlay__mastercard" />
                </div>

                <div className="credit-card-overlay__text">
                    <p>{this.translate('buyWithCard.overlay1.text1')}</p>
                    <p>{this.translate('buyWithCard.overlay1.text2')}</p>
                </div>

                <div className="pg-chatello__overlay1-button-wrap">
                    <button
                        className="buy-form__button-continue"
                        onClick={this.handleButton}
                    >
                        {this.translate('buyWithCard.overlay1.button')}
                    </button>
                </div>

                <p
                    className="buy-form__bottom-text--help"
                >
                    <a target="_blank" href="https://kb.emirex.com/kb-tickets/new" rel="noopener noreferrer">{this.translate('buyWithCard.form.help')}</a>
                </p>
            </div>
        );
    };


    public renderOverlay2 = () => {
        return (
            <div className="pg-chatello__overlay-wrap">
                <div className="pg-chatello__overlay-header">
                    <div className="pg-chatello__overlay2-header">
                        {this.translate('chatello.overlay2.header')}
                    </div>
                </div>


                <div className="pg-chatello__overlay1-button-wrap">
                    <button
                        className="buy-form__button-continue"
                        onClick={this.handleButton}
                    >
                        {this.translate('chatello.overlay2.button')}
                    </button>
                </div>

                <p className="buy-form__bottom-text--help">
                    <a target="_blank" href="https://kb.emirex.com/kb-tickets/new" rel="noopener noreferrer">{this.translate('buyWithCard.form.help')}</a>
                </p>
            </div>
        );
    };
}

export const CreditCardOverlay = injectIntl(withRouter(CreditCardOverlayComponent));
