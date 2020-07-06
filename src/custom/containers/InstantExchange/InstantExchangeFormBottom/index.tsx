// tslint:disable:jsx-no-lambda

import * as React from 'react';

import { InjectedIntlProps, injectIntl } from 'react-intl';


type Props = InjectedIntlProps & {
    activeSellPercentage: number;
    activeBuyPercentage: number;
    onSellPercentageChange: () => void;
    onBuyPercentageChange: () => void;
    onBuy: () => void;
    onSell: () => void;
};

class InstantExchangeFormBottomComponent extends React.Component<Props> {
    public translate = id => {
        return this.props.intl.formatMessage({ id });
    };

    public render() {
        const {
            activeSellPercentage, activeBuyPercentage,
            onSellPercentageChange, onBuyPercentageChange,
            onBuy, onSell,
        } = this.props;

        return (
            <div className="instant-exchange__form-buttons">
                <div className="instant-exchange__form-buttons-item-sell">
                    <div className="instant-exchange__form-buttons-top">
                        {[25, 50, 75, 100].map(value => {
                            return (
                                <button
                                    key={value}
                                    onClick={() => onSellPercentageChange(value)}
                                    className={`${activeSellPercentage === value ? 'active' : ''}`}
                                >
                                    {value}%
                                </button>
                            );
                        })}
                    </div>
                    <div className="instant-exchange__form-buttons-bottom">
                        <button
                            className="active"
                            onClick={onBuy}
                        >
                            {this.translate('buyWithCard.form.sell')}
                        </button>
                    </div>
                </div>

                <div className="instant-exchange__form-buttons-item-buy">
                    <div className="instant-exchange__form-buttons-top">
                        {[25, 50, 75, 100].map(value => {
                            return (
                                <button
                                    key={value}
                                    onClick={() => onBuyPercentageChange(value)}
                                    className={`${activeBuyPercentage === value ? 'active' : ''}`}
                                >
                                    {value}%
                                </button>
                            );
                        })}
                    </div>
                    <div className="instant-exchange__form-buttons-bottom">
                        <button
                            className="active"
                            onClick={onSell}
                        >
                            {this.translate('buyWithCard.form.buy')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export const InstantExchangeFormBottom = injectIntl(InstantExchangeFormBottomComponent);
