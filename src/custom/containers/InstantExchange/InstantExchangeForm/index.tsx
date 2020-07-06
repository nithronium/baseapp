// tslint:disable:jsx-no-lambda


import * as React from 'react';

import classnames from 'classnames';

import { connect, MapStateToProps } from 'react-redux';

// import Dropdown from 'react-dropdown';

import Select from 'react-dropdown-select';

import { InjectedIntlProps, injectIntl } from 'react-intl';

import {
    Currency,
    RootState,
    selectCurrencies,
} from '../../../../modules';

interface ReduxProps {
    currencies: Currency[];
}

type Props = InjectedIntlProps & ReduxProps & {
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
    fiatPlaceholder: string;
    cryptoPlaceholder: string;
};

class InstantExchangeFormComponent extends React.Component<Props> {
    public translate = id => {
        return this.props.intl.formatMessage({ id });
    };

    public render() {
        const {
            swapped,
        } = this.props;

        return (
            <form className="buy-form__inputs-wrap" noValidate={true}>
                {!swapped ? this.renderFiat() : this.renderCrypto()}
                {!swapped ? this.renderCrypto() : this.renderFiat()}
            </form>
        );
    }

    public renderFiat = () => {
        const {
            onFiatValueChange,
            // onFiatChange,
            fiatValue,
            // fiat,
            // fiatList,
            fiatPlaceholder,
         } = this.props;

        return (
            <div className="buy-form__input-wrap instant-exchange__form-input-left">
                <label className="buy-form__label">
                    {this.translate('instantExchange.form.label1')}
                </label>
                <input
                    onChange={onFiatValueChange}
                    value={fiatValue}
                    className="instant-exchange__form-input"
                    type="number"
                    placeholder={fiatPlaceholder}
                />
                {/* <Dropdown
                    onChange={onFiatChange}
                    value={fiat}
                    options={fiatList}
                    controlClassName={'cr-card-select cr-card-select--first'}
                /> */}
                {this.renderFiatDropdown()}
            </div>
        );
    };


    public renderCrypto = () => {
        const {
            onCryptoValueChange,
            cryptoValue,
            cryptoPlaceholder,
         } = this.props;

        return (
            <div className="buy-form__input-wrap instant-exchange__form-input-right">
                <label className="buy-form__label">
                    {this.translate('instantExchange.form.label2')}
                </label>
                <input
                    onChange={onCryptoValueChange}
                    value={cryptoValue}
                    className="instant-exchange__form-input"
                    type="number"
                    placeholder={cryptoPlaceholder}
                />
                {this.renderCryptoDropdown()}
            </div>
        );
    };

    public renderCryptoDropdown = () => {
        const {
            onCryptoChange,
            crypto,
            cryptoList,
        } = this.props;

        const orderedCryptoList = cryptoList.filter(item => item !== crypto);
        orderedCryptoList.unshift(crypto);

        return (
            <div className="instant-exchange__currency-select">
                <Select
                    options={orderedCryptoList.map(item => ({ value: item, label: item }))}
                    values={[{ value: crypto, label: crypto }]}
                    onChange={array => onCryptoChange(array[0])}
                    itemRenderer={({ item, methods }) => {
                        const classes = classnames(
                            'instant-exchange__currency-select-item',
                            {
                                active: methods.isSelected(item),
                            },
                        );

                        return (
                            <div
                                className={classes}
                                onClick={() => {
                                    methods.addItem(item);
                                }}
                                key={item.value}
                            >
                                <i className={`crypto-icon ${item.value}`} />
                                {item.label}
                            </div>
                        );
                    }}
                />
            </div>
        );
    };

    public renderFiatDropdown = () => {
        const {
            onFiatChange,
            fiat,
            fiatList,
        } = this.props;

        const orderedFiatList = fiatList.filter(item => item !== fiat);
        orderedFiatList.unshift(fiat);

        return (
            <div className="instant-exchange__currency-select instant-exchange__currency-select--fiat">
                <Select
                    options={orderedFiatList.map(item => ({ value: item, label: item }))}
                    values={[{ value: fiat, label: fiat }]}
                    onChange={array => onFiatChange(array[0])}
                    itemRenderer={({ item, methods }) => {

                        const classes = classnames(
                            'instant-exchange__currency-select-item',
                            'instant-exchange__currency-select-item--fiat',
                            {
                                active: methods.isSelected(item),
                            },
                        );

                        return (
                            <div
                                className={classes}
                                onClick={() => {
                                    methods.addItem(item);
                                }}
                                key={item.value}
                            >
                                {item.label}
                            </div>
                        );
                    }}
                />
            </div>
        );
    };

    public getCurrencySymbol = (currency, currencies) => {
        const data = currencies.filter(({ id }) => currency === id);

        return data[0].symbol;
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    currencies: selectCurrencies(state),
});

export const InstantExchangeForm = connect(mapStateToProps, () => ({}))(injectIntl(InstantExchangeFormComponent));
