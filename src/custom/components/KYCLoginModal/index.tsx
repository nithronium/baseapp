import { History } from 'history';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';

interface OwnProps {
    classname: string;
    closeModal: () => void;
    userLevel: number;
    history: History;
}

type Props = InjectedIntlProps & OwnProps;

class KYCLoginModal extends React.Component<Props> {
    public render() {
        const { userLevel } = this.props;

        return (
            <div className={this.props.classname}>
                <div className="pg-kyc-login__body">
                    <div className="pg-kyc-login__body-box">
                        <div className="pg-kyc-login__body__header">
                            <div>{this.translate('page.body.modal.kyc.login.header')}</div>
                        </div>
                        <div className="pg-kyc-login__body__content">
                            <div className="pg-kyc-login__body__content__message">
                                {this.translate('page.body.modal.kyc.login.text')}
                            </div>
                            <div className="pg-kyc-login__body__content__buttons">
                                <div className="pg-kyc-login__body__content__buttons__hide" onClick={this.handleClickClose}>
                                    {this.translate('page.body.modal.kyc.login.later')}
                                </div>
                                <div className="pg-kyc-login__body__content__buttons__kyc" onClick={this.handleRedirectToConfirm}>
                                    {this.translate('page.body.modal.kyc.login.go.kyc.level')}&nbsp;{Math.ceil(userLevel / 2)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private handleClickClose = () => {
        this.props.closeModal(false);
    }

    private handleRedirectToConfirm = () => {
        this.props.history.push('/confirm');
        this.handleClickClose();
    }

    private translate = (e: string) => {
        return this.props.intl.formatMessage({ id: e });
    };
}

export const LoginModal = injectIntl(KYCLoginModal);
