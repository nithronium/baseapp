import * as React from 'react';

import classnames from 'classnames';

import { InjectedIntlProps, injectIntl } from 'react-intl';

export interface ReduxProps {
    currentStep: number;
    paymentData: {
        pair: string;
        price: number;
        amount: number;
        value: number;
        time: string;
    };
}

type Props = ReduxProps & InjectedIntlProps;

export class ChatelloStepsComponent extends React.Component<Props> {
    public translate = id => {
        return this.props.intl.formatMessage({ id });
    };

    public render() {
        const { currentStep } = this.props;

        return (
            <div className="credit-card-steps">
                {currentStep <= 3 ? this.renderStep1to3(currentStep) : this.renderStep4()}
            </div>
        );
    }

    public renderTimeline = () => {
        const { currentStep } = this.props;

        return (
            <div className="credit-card-timeline">
                <div className="credit-card-timeline__line"/>
                {[1, 2, 3, 4].map(index => {
                    const isActive = index === currentStep;
                    const isChecked = index < currentStep;
                    const classes = classnames('credit-card-timeline__item', {
                        active: isActive,
                        checked: isChecked,
                    });
                    const numberClasses = classnames('credit-card-timeline__number', {
                        active: isActive,
                        checked: isChecked,
                    });
                    const textClasses = classnames('credit-card-timeline__text', {
                        active: isActive,
                        checked: isChecked,
                        'credit-card-timeline__text--last': index === 4,
                    });

                    return (
                        <div
                            className={classes}
                            key={index}
                        >
                            {index === 1 && <div className="hide-line-before" />}
                            <div className={numberClasses}>
                                {isChecked ? <div className="credit-card-timeline__number-check" /> : index}
                            </div>
                            <div className={textClasses}>
                                <div dangerouslySetInnerHTML={{ __html: this.translate(`chatello.steps.step${Number(index)}`) }} />
                            </div>
                            {index === 4 && <div className="hide-line-after" />}
                        </div>
                    );
                })}
            </div>
        );
    };

    public renderStep1to3 = (index: number) => {
        const hasText = index !== 1;
        const hasFooter = index === 1 || index === 2;
        const hasCheck = index !== 1;

        return (
            <div className="credit-card-steps__item">
                {hasCheck && <div className="credit-card-steps__check">
                    <div />
                </div>}
                <div className="credit-card-steps__title">
                    {this.translate(`chatello.steps.header${index}`)}
                </div>
                {hasText && <div className="credit-card-steps__text">
                    <div>
                        {this.translate(`chatello.steps.text${index}`)}
                    </div>
                </div>}
                {this.renderTimeline()}
                {hasFooter && <div className="credit-card-steps__footer">
                    <div dangerouslySetInnerHTML={{ __html: this.translate(`chatello.steps.footer${index}`) }} />
                </div>}
            </div>
        );
    };

    public renderStep4 = () => {
        const { paymentData } = this.props;
        const { amount } = paymentData;

        return (
            <div className="credit-card-steps__item">

                <div className="credit-card-steps__check">
                    <div />
                </div>
                <div className="credit-card-steps__title">
                    {this.translate(`chatello.steps.header4`)}
                </div>
                <div className="credit-card-steps__text">
                    <div>
                        {this.translate(`chatello.steps.text4-1`)}
                        <span className="credit-card-steps__amount">{amount}</span>
                        {this.translate(`chatello.steps.text4-2`)}
                    </div>
                </div>
                {this.renderTimeline()}
                <div className="credit-card-steps__footer pg-chatello__footer pg-chatello__footer--step4">
                    <div className="credit-card-steps__footer-caption">
                        {amount / 2}
                        {this.translate(`chatello.steps.footer4-4`)}
                    </div>
                    <div>
                    <a
                        className="pg-chatello-steps__bottom-wallet"
                        href="/wallets"
                    >
                        {this.translate(`chatello.steps.step4.bottom.button1`)}
                    </a>
                    </div>
                    {this.translate(`chatello.steps.footer4-1`)}
                    {amount / 2}
                    {this.translate(`chatello.steps.footer4-2`)}
                </div>
                <div className="pg-chatello-steps__bottom">
                    {this.translate(`chatello.steps.step4.bottom.text1`)}
                    <br />
                    {this.translate(`chatello.steps.step4.bottom.text2`)}

                    <div className="pg-chatello-steps__bottom-buttons">
                        <button
                            onClick={this.onTryAgain}
                            className="pg-chatello-steps__bottom-done"
                        >
                            {this.translate(`chatello.steps.step4.bottom.done`)}
                        </button>
                        <button
                            onClick={this.onTryAgain}
                            className="pg-chatello-steps__bottom-try"
                        >
                            {this.translate(`chatello.steps.step4.bottom.button2`)}
                        </button>
                    </div>
                </div>

                <div className="pg-chatello-steps__bottom-help">
                    <div className="pg-chatello-steps__bottom-help-wrap">
                        <div className="pg-chatello__overlay1-icon--big" />
                        <div>
                            <div className="pg-chatello-steps__bottom-help-header">
                                {this.translate(`chatello.steps.step4.bottom.header`)}
                            </div>
                            <div className="pg-chatello-steps__bottom-help-feedback">
                                {this.translate(`chatello.steps.step4.bottom.feedback`)}{' '}
                                <a href="https://kb.emirex.com/kb-tickets/new" target="_blank" rel="noopener noreferrer">
                                    {this.translate(`chatello.steps.step4.bottom.help`)}
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="pg-chatello-steps__bottom-help-button-wrap">
                        <a
                            className="pg-chatello-steps__bottom-help-button"
                            target="_blank"
                            href="tg://resolve?domain=heywhy003"
                            rel="noopener noreferrer"
                        >
                            {this.translate(`chatello.steps.step4.bottom.feedback.button`)}
                        </a>
                    </div>
                </div>
            </div>
        );
    };

    public onTryAgain = () => {
        this.props.onTryAgain();
    };
}


export const ChatelloSteps = injectIntl(ChatelloStepsComponent);
