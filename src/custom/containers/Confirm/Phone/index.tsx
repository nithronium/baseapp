import {Button} from '@openware/components';
import cr from 'classnames';
import { History } from 'history';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import {
    connect,
    MapDispatchToPropsFunction,
} from 'react-redux';
import {withRouter} from 'react-router';
import { handleRedirectToConfirm } from '../../../../custom/helpers';
import {
    labelFetch,
    RootState,
    selectUserInfo,
    User,
} from '../../../../modules';
import {
    resendCode,
    selectVerifyPhoneSuccess,
    sendCode,
    verifyPhone,
} from '../../../../modules/user/kyc/phone';
import { changeUserLevel } from '../../../../modules/user/profile';

interface ReduxProps {
    verifyPhoneSuccess?: string;
    user: User;
}

interface OnChangeEvent {
    target: {
        value: string;
    };
}

interface HistoryProps {
    history: History;
}

interface PhoneState {
    phoneNumber: string;
    phoneNumberFocused: boolean;
    confirmationCode: string;
    confirmationCodeFocused: boolean;
    resendCode: boolean;
}

interface DispatchProps {
    changeUserLevel: typeof changeUserLevel;
    labelFetch: typeof labelFetch;
    resendCode: typeof resendCode;
    sendCode: typeof sendCode;
    verifyPhone: typeof verifyPhone;
}

type Props = ReduxProps & DispatchProps & InjectedIntlProps & HistoryProps;

class PhoneComponent extends React.Component<Props, PhoneState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            phoneNumber: '',
            phoneNumberFocused: false,
            confirmationCode: '',
            confirmationCodeFocused: false,
            resendCode: false,
        };
    }

    public translate = (e: string) => {
        return this.props.intl.formatMessage({ id: e });
    };

    public componentDidMount() {
        const {user} = this.props;
        const {phoneNumber} = this.state;
        if (user.phones && user.phones[0] && user.phones[0].number !== phoneNumber) {
            this.setState({phoneNumber: `+${user.phones[0].number}`});
        } else {
            this.setState({phoneNumber: `+`});
        }
    }

    public componentDidUpdate(prev: Props) {
        const { history } = this.props;

        if (!prev.verifyPhoneSuccess && this.props.verifyPhoneSuccess) {
            this.props.changeUserLevel({ level: 3 });
            this.props.labelFetch();
            handleRedirectToConfirm('identifyStep', history);
        }
    }

    public backBtn = () => {
        handleRedirectToConfirm('profilePartialStep', this.props.history);
    };

    public render() {
        const {
            phoneNumber,
            phoneNumberFocused,
            confirmationCode,
            confirmationCodeFocused,
        } = this.state;
        const {
            verifyPhoneSuccess,
        } = this.props;

        const phoneNumberFocusedClass = cr('pg-confirm__content-phone-col-content', {
            'pg-confirm__content-phone-col-content--focused': phoneNumberFocused,
        });

        const confirmationCodeFocusedClass = cr('pg-confirm__content-phone-col-content', {
            'pg-confirm__content-phone-col-content--focused': confirmationCodeFocused,
        });

        return (
            <div className="pg-confirm__content-phone">
                <h2 className="pg-confirm__content-phone-head">{this.translate('page.body.kyc.phone.head')}</h2>
                <div className="pg-confirm__content-phone-col">
                    <div className="pg-confirm__content-phone-col-text">
                        1. {this.translate('page.body.kyc.phone.enterPhone')}
                    </div>
                    <fieldset className={phoneNumberFocusedClass}>
                        {phoneNumber && <legend>{this.translate('page.body.kyc.phone.phoneNumber')}</legend>}
                        <input
                            className="pg-confirm__content-phone-col-content-number"
                            type="string"
                            placeholder={this.translate('page.body.kyc.phone.phoneNumber')}
                            value={phoneNumber}
                            onClick={this.addPlusSignToPhoneNumber}
                            onChange={this.handleChangePhoneNumber}
                            onFocus={this.handleFieldFocus('phoneNumber')}
                            onBlur={this.handleFieldFocus('phoneNumber')}
                            onKeyPress={this.handleSendEnterPress}
                            autoFocus={true}
                        />
                        <button
                            className={phoneNumber ? 'pg-confirm__content-phone-col-content-send' : 'pg-confirm__content-phone-col-content-send--disabled'}
                            type="button"
                            onClick={this.handleSendCode}
                        >
                            {this.state.resendCode ? this.translate('page.body.kyc.phone.resend') : this.translate('page.body.kyc.phone.send')}
                        </button>
                    </fieldset>
                </div>
                <div className="pg-confirm__content-phone-col">
                    <div className="pg-confirm__content-phone-col-text">
                        2. {this.translate('page.body.kyc.phone.enterCode')}
                    </div>
                    <fieldset className={confirmationCodeFocusedClass}>
                        {confirmationCode && <legend>{this.translate('page.body.kyc.phone.code')}</legend>}
                        <input
                            className="pg-confirm__content-phone-col-content-number"
                            type="string"
                            placeholder={this.translate('page.body.kyc.phone.code')}
                            value={confirmationCode}
                            onChange={this.handleChangeConfirmationCode}
                            onFocus={this.handleFieldFocus('confirmationCode')}
                            onBlur={this.handleFieldFocus('confirmationCode')}
                            onKeyPress={this.handleConfirmEnterPress}
                        />
                    </fieldset>
                </div>
                {verifyPhoneSuccess && <p className="pg-confirm__success">{this.translate(verifyPhoneSuccess)}</p>}
                <div className="pg-confirm__content-deep">
                    <Button
                        className="pg-confirm__content-deep-back"
                        label={this.translate('page.body.kyc.back')}
                        onClick={this.backBtn}
                    />
                    <div className="pg-confirm__content-deep-margin" />
                    <Button
                        className="pg-confirm__content-phone-deep-button"
                        label={this.translate('page.body.kyc.next')}
                        onClick={this.confirmPhone}
                    >
                        {this.translate('page.body.kyc.next')}
                    </Button>
                </div>
            </div>
        );
    }

    private handleFieldFocus = (field: string) => {
        return () => {
            switch (field) {
                case 'phoneNumber':
                    this.addPlusSignToPhoneNumber();
                    this.setState({
                        phoneNumberFocused: !this.state.phoneNumberFocused,
                    });
                    break;
                case 'confirmationCode':
                    this.setState({
                        confirmationCodeFocused: !this.state.confirmationCodeFocused,
                    });
                    break;
                default:
                    break;
            }
        };
    }

    private handleConfirmEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.confirmPhone();
        }
    }

    private handleSendEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.handleSendCode();
        }
    }

    private confirmPhone = () => {
        const { phoneNumber, confirmationCode } = this.state;
        const { user, history } = this.props;
        const requestProps = {
            phone_number: String(phoneNumber),
            verification_code: String(confirmationCode),
        };
        if (user.phones && user.phones[0] && `+${user.phones[0].number}` === phoneNumber) {
            handleRedirectToConfirm('identifyStep', history);
        } else {
            this.props.verifyPhone(requestProps);
        }
    };

    private addPlusSignToPhoneNumber = () => {
        if (this.state.phoneNumber.length === 0) {
            // this.setState({
            //     phoneNumber: '+',
            // });
        }
    }

    private handleChangePhoneNumber = (e: OnChangeEvent) => {
        if (this.inputPhoneNumber(e)) {
            this.setState({
                phoneNumber: e.target.value,
                resendCode: false,
            });
        }
    }

    private handleChangeConfirmationCode = (e: OnChangeEvent) => {
        if (this.inputConfirmationCode(e)) {
            this.setState({
                confirmationCode: e.target.value,
            });
        }
    };

    private inputPhoneNumber = (e: OnChangeEvent) => {
        const convertedText = e.target.value.trim();
        const condition = new RegExp('^\\+\\d*?$');
        return condition.test(convertedText);
    }

    private inputConfirmationCode = (e: OnChangeEvent) => {
        const convertedText = e.target.value.trim();
        const condition = new RegExp('^\\d*?$');
        return condition.test(convertedText);
    }

    private handleSendCode = () => {
        const requestProps = {
            phone_number: String(this.state.phoneNumber),
        };
        if (!this.state.resendCode) {
            this.props.sendCode(requestProps);
            this.setState({
                resendCode: true,
            });
        } else {
            this.props.resendCode(requestProps);
        }
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    verifyPhoneSuccess: selectVerifyPhoneSuccess(state),
    user: selectUserInfo(state),
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        changeUserLevel: payload => dispatch(changeUserLevel(payload)),
        labelFetch: () => dispatch(labelFetch()),
        resendCode: phone => dispatch(resendCode(phone)),
        sendCode: phone => dispatch(sendCode(phone)),
        verifyPhone: payload => dispatch(verifyPhone(payload)),
    });

// tslint:disable-next-line
export const Phone = injectIntl(withRouter(connect(mapStateToProps, mapDispatchProps)(PhoneComponent) as any));
