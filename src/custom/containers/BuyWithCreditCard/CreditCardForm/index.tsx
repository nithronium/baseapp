import * as React from 'react';

import Dropdown from 'react-dropdown';

import { InjectedIntlProps, injectIntl } from 'react-intl';


type Props = InjectedIntlProps & {
    swapped: boolean;
    onSwap: () => void;
    onFiatValueChange: () => void;
    onFiatChange: () => void;
    fiatValue: string;
    fiat: string;
    fiatList: string[];
    onCryptoValueChange: () => void
    onCryptoChange: () => void;
    cryptoValue: string;
    crypto: string;
    cryptoList: string[];
};

class CreditCardFormComponent extends React.Component<Props> {
    public translate = id => {
        return this.props.intl.formatMessage({ id });
    };

    public render() {
        const {
            swapped,
            onSwap,
         } = this.props;

        return (
            <form
                className="buy-form__inputs-wrap"
                noValidate={true}
            >
                {!swapped ? this.renderFiat() : this.renderCrypto()}
                <div
                    className="buy-form__input-arrow-wrap"
                    onClick={onSwap}
                >
                    <div className="buy-form__input-arrow" />
                </div>
                {!swapped ? this.renderCrypto() : this.renderFiat()}
            </form>
        );
    }

    public renderFiat = () => {
        const {
            onFiatValueChange,
            onFiatChange,
            fiatValue,
            fiat,
            fiatList,
         } = this.props;

        return (
            <div className="buy-form__input-wrap">
                <label className="buy-form__label">
                    {this.translate('buyWithCard.form.sell')}
                </label>
                <input
                    onChange={onFiatValueChange}
                    value={fiatValue}
                    className="buy-form__input"
                    type="number"
                />
                <Dropdown
                    onChange={onFiatChange}
                    value={fiat}
                    options={fiatList}
                    controlClassName={'cr-card-select cr-card-select--first'}
                />
            </div>
        );
    };


    public renderCrypto = () => {
        const {
            onCryptoValueChange,
            onCryptoChange,
            cryptoValue,
            crypto,
            cryptoList,
         } = this.props;

        return (
            <div className="buy-form__input-wrap">
                <label className="buy-form__label">
                    {this.translate('buyWithCard.form.buy')}
                </label>
                <input
                    onChange={onCryptoValueChange}
                    value={cryptoValue}
                    className="buy-form__input"
                    type="number"
                />

                <Dropdown
                    onChange={onCryptoChange}
                    value={crypto}
                    options={cryptoList}
                    controlClassName={'cr-card-select'}
                />
            </div>
        );
    };
}

export const CreditCardForm = injectIntl(CreditCardFormComponent);
