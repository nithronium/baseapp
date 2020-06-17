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

export class CreditCardStepsComponent extends React.Component<Props> {
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
                                <div>
                                    {this.translate(`buyWithCard.steps.step${Number(index)}`)}
                                </div>
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
                    {this.translate(`buyWithCard.steps.header${index}`)}
                </div>
                {hasText && <div className="credit-card-steps__text">
                    <div>
                        {this.translate(`buyWithCard.steps.text${index}`)}
                    </div>
                </div>}
                {this.renderTimeline()}
                {hasFooter && <div className="credit-card-steps__footer">
                    <div dangerouslySetInnerHTML={{ __html: this.translate(`buyWithCard.steps.footer${index}`) }} />
                </div>}
            </div>
        );
    };

    public renderStep4 = () => {
        const { paymentData } = this.props;
        const { pair, amount, price, value, time } = paymentData;

        return (
            <div className="credit-card-steps__item">

                <div className="credit-card-steps__check">
                    <div />
                </div>
                <div className="credit-card-steps__title">
                    {this.translate(`buyWithCard.steps.header4`)}
                </div>
                <div className="credit-card-steps__text">
                    <div>
                        {this.translate(`buyWithCard.steps.text4`)}
                    </div>
                </div>
                <div className="credit-card-steps__table">
                    <table>
                        <tbody>
                            <tr>
                                <td>{this.translate(`buyWithCard.steps.pair`)}</td>
                                <td>{pair}</td>
                            </tr>
                            <tr>
                                <td>{this.translate(`buyWithCard.steps.amount`)}</td>
                                <td>{amount}</td>
                            </tr>
                            <tr>
                                <td>{this.translate(`buyWithCard.steps.price`)}</td>
                                <td>{price}</td>
                            </tr>
                            <tr>
                                <td>{this.translate(`buyWithCard.steps.value`)}</td>
                                <td>{value}</td>
                            </tr>
                            <tr>
                                <td>{this.translate(`buyWithCard.steps.time`)}</td>
                                <td>{time}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {this.renderTimeline()}
            </div>
        );
    };
}


export const CreditCardSteps = injectIntl(CreditCardStepsComponent);
