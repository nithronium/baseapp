import cr from 'classnames';
import { History } from 'history';
import * as React from 'react';
import { Button, InputGroup } from 'react-bootstrap';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import {
    connect,
    MapDispatchToPropsFunction,
} from 'react-redux';
import {withRouter} from 'react-router';
import { CustomInput } from '../../../../components';
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
                        <InputGroup>
                            <CustomInput
                                label={phoneNumber ? this.translate('page.body.kyc.phone.phoneNumber') : ''}
                                defaultLabel={phoneNumber ? this.translate('page.body.kyc.phone.phoneNumber') : ''}
                                placeholder={this.translate('page.body.kyc.phone.phoneNumber')}
                                type="string"
                                inputValue={phoneNumber}
                                handleClick={this.addPlusSignToPhoneNumber}
                                handleChangeInput={this.handleChangePhoneNumber}
                                onKeyPress={this.handleSendEnterPress}
                                autoFocus={true}
                                handleFocusInput={this.handleFieldFocus('phoneNumber')}
                            />
                            <InputGroup.Append>
                                <Button
                                    block={true}
                                    onClick={this.handleSendCode}
                                    size="lg"
                                    variant="primary"
                                    disabled={!phoneNumber}
                                >
                                    {this.state.resendCode ? this.translate('page.body.kyc.phone.resend') : this.translate('page.body.kyc.phone.send')}
                                </Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </fieldset>
                </div>
                <div className="pg-confirm__content-phone-col">
                <div className="pg-confirm__content-phone-col-text">
                        2. {this.translate('page.body.kyc.phone.enterCode')}
                    </div>
                    <fieldset className={confirmationCodeFocusedClass}>
                        <CustomInput
                            type="string"
                            label={confirmationCode ? this.translate('page.body.kyc.phone.code') : ''}
                            defaultLabel={confirmationCode ? this.translate('page.body.kyc.phone.code') : ''}
                            handleChangeInput={this.handleChangeConfirmationCode}
                            onKeyPress={this.handleConfirmEnterPress}
                            inputValue={confirmationCode}
                            placeholder={this.translate('page.body.kyc.phone.code')}
                            handleFocusInput={this.handleFieldFocus('confirmationCode')}
                        />
                    </fieldset>
                </div>
                {verifyPhoneSuccess && <p className="pg-confirm__success">{this.translate(verifyPhoneSuccess)}</p>}
                <div className="pg-confirm__content-deep">
                    <Button
                        className="pg-confirm__content-deep-back"
                        onClick={this.backBtn}
                        size="lg"
                        variant="primary"
                        block={true}
                    >{this.translate('page.body.kyc.back')}</Button>
                    <div className="pg-confirm__content-deep-margin" />
                    <Button
                        className="pg-confirm__content-phone-deep-button"
                        onClick={this.confirmPhone}
                        size="lg"
                        variant="primary"
                        block={true}
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
    };

    private handleConfirmEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.confirmPhone();
        }
    };

    private handleSendEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.handleSendCode();
        }
    };

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
    };

    private handleChangePhoneNumber = (value: string) => {
        if (this.inputPhoneNumber(value)) {
            this.setState({
                phoneNumber: value,
                resendCode: false,
            });
        }
    };

    private handleChangeConfirmationCode = (value: string) => {
        if (this.inputConfirmationCode(value)) {
            this.setState({
                confirmationCode: value,
            });
        }
    };

    private inputPhoneNumber = (value: string) => {
        const convertedText = value.trim();
        const condition = new RegExp('^\\+\\d*?$');

        return condition.test(convertedText);
    };

    private inputConfirmationCode = (value: string) => {
        const convertedText = value.trim();
        const condition = new RegExp('^\\d*?$');

        return condition.test(convertedText);
    };

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
