/* tslint:disable */

import * as React from 'react';

import {
    Modal,
} from '../../../../components';

import { CreditCardForm } from '../CreditCardForm';

import { InjectedIntlProps, injectIntl } from 'react-intl';

export interface ReduxProps {
    showModal: boolean;
}

type Props = ReduxProps & InjectedIntlProps & {
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
    submitModal: () => void;
    isButtonDisabled: boolean;
    showModal: boolean;
    closeModal: () => void;
};

export class CreditCardModalComponent extends React.Component<Props> {
    public translate = id => {
        return this.props.intl.formatMessage({ id });
    };

    public render = () => {
        const { showModal } = this.props;

        return (

            <Modal
                show={showModal}
                header={this.renderModalHeader()}
                content={this.renderModalBody()}
                footer={this.renderModalFooter()}
            />
        );
    };

    public renderModalHeader = () => {
        return (
            <div className="buy-form__modal-header">
                <p>{this.translate('buyWithCard.form.modal.header')}</p>
                <div
                    className="buy-form__modal-close"
                    onClick={this.props.closeModal}
                >
                    x
                </div>
            </div>
        );
    };

    public renderModalBody = () => {
        const {
            submitModal,
            fiatValue,
            cryptoValue,
            swapped,
            onSwap,
            fiatList,
            cryptoList,
            onFiatValueChange,
            onFiatChange,
            onCryptoValueChange,
            onCryptoChange,
            isButtonDisabled,
        } = this.props;
        let {
            fiat,
            crypto,
        } = this.props;

        fiat = fiat || '';
        crypto = crypto || '';
        return (
            <div>
                <div className="buy-form__modal-amount">
                    {this.translate('buyWithCard.form.buy')} {' '}
                    <span>{!swapped ? cryptoValue : fiatValue}
                    {' '}
                    {!swapped ? crypto.toUpperCase() : fiat.toUpperCase()}</span>
                    {' '}{this.translate('buyWithCard.form.for')}{' '}
                    <span>{!swapped ? fiatValue : cryptoValue} {fiat.toUpperCase()}</span>
                </div>

                <div className="buy-form__modal-inputs">
                    <CreditCardForm
                        fiat={fiat}
                        crypto={crypto}
                        fiatValue={fiatValue}
                        cryptoValue={cryptoValue}
                        swapped={swapped}
                        onSwap={onSwap}
                        fiatList={fiatList}
                        cryptoList={cryptoList}
                        onFiatValueChange={onFiatValueChange}
                        onFiatChange={onFiatChange}
                        onCryptoValueChange={onCryptoValueChange}
                        onCryptoChange={onCryptoChange}
                    />
                </div>
                <div className="buy-form__modal-divider">
                    <div className="credit-card-promo__divider">
                        <div className="credit-card-promo__divider-arrow" />
                    </div>
                </div>

                <div className="buy-form__modal-table">
                    <div className="buy-form__modal-table-top">
                        <span>{this.translate('buyWithCard.form.modal.pay')}</span>
                        <span>{!swapped ? fiatValue : cryptoValue}
                        {' '}
                        {!swapped ? fiat.toUpperCase() : crypto.toUpperCase()}</span>
                    </div>
                    <div className="buy-form__modal-table-bottom">
                        <span>{this.translate('buyWithCard.form.modal.get')}</span>
                        <span>{!swapped ? cryptoValue : fiatValue}
                        {' '}
                        {!swapped ? crypto.toUpperCase() : fiat.toUpperCase()}</span>
                    </div>
                </div>

                <div className="buy-form__modal-terms">
                    <div className="buy-form__modal-terms-header">
                        {this.translate('buyWithCard.form.modal.terms.header')}
                    </div>
                    <div className="buy-form__modal-terms-body">
                        {this.translate('buyWithCard.form.modal.terms.body')}
                    </div>
                </div>

                <div className="buy-form__modal-footer">
                    <button
                        className="buy-form__modal-footer-button"
                        onClick={submitModal}
                        disabled={isButtonDisabled}
                    >
                        {this.translate('buyWithCard.form.modal.buttonBuy')}
                    </button>
                </div>
            </div>
        );
    };

    public renderModalFooter = () => {
        return null;
    };
}


export const CreditCardModal = injectIntl(CreditCardModalComponent);
