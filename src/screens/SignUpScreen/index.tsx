import { Button } from '@openware/components';
import cx from 'classnames';
import { History } from 'history';
import * as React from 'react';
import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import {
    connect,
    MapDispatchToPropsFunction,
    MapStateToProps,
} from 'react-redux';
import { withRouter } from 'react-router-dom';
import { captchaType, siteKey } from '../../api';
import logo = require('../../assets/images/logo.svg');
import { Modal, SignUpForm } from '../../components';
import { buildPath } from '../../custom/helpers';
import {
    EMAIL_REGEX,
    ERROR_INVALID_EMAIL,
    ERROR_INVALID_PASSWORD,
    ERROR_PASSWORD_CONFIRMATION,
    PASSWORD_REGEX,
    setDocumentTitle,
} from '../../helpers';
import {
    RootState,
    selectCurrentLanguage,
    selectSignUpRequireVerification,
    signUp,
} from '../../modules';

import { GeetestCaptcha } from '../../containers';
interface ReduxProps {
    requireVerification?: boolean;
    loading?: boolean;
}

interface DispatchProps {
    signUp: typeof signUp;
}

interface RouterProps {
    location: {
        search: string;
    };
    history: History;
}

type Props = ReduxProps & DispatchProps & RouterProps & InjectedIntlProps;

export const extractRefID = (props: RouterProps) => new URLSearchParams(props.location.search).get('refid');

class SignUp extends React.Component<Props> {
    public readonly state = {
        showModal: false,
        email: '',
        password: '',
        confirmPassword: '',
        captcha_response: '',
        recaptchaConfirmed: false,
        refId: '',
        hasConfirmed: false,
        emailError: '',
        passwordError: '',
        passwordValidationDetails: {
            isLengthAcceptable: true,
            hasDigits: true,
            hasCapitalLetters: true,
            hasLowerCaseLetters: true,
        },
        confirmationError: '',
        emailFocused: false,
        passwordFocused: false,
        confirmPasswordFocused: false,
        refIdFocused: false,
        geetestCaptchaSuccess: false,
    };

    public constructor(props) {
        super(props);
        this.captchaRef = React.createRef();
    }

    private captchaRef;

    public componentDidMount() {
        setDocumentTitle('Sign Up');
        const referralCode = this.extractRefID(this.props.location.search) || '';
        this.setState({
            refId: referralCode,
        });
    }

    public componentWillReceiveProps(props: Props) {
        const { i18n } = this.props;

        if (props.requireVerification) {
            props.history.push(buildPath('/email-verification', i18n), {email: this.state.email});
        }
    }

    public render() {
        const {
            email,
            password,
            confirmPassword,
            refId,
            captcha_response,
            recaptchaConfirmed,
            hasConfirmed,
            emailError,
            passwordError,
            passwordValidationDetails,
            confirmationError,
            emailFocused,
            passwordFocused,
            confirmPasswordFocused,
            refIdFocused,
            geetestCaptchaSuccess,
        } = this.state;
        const { loading } = this.props;
        const test = !geetestCaptchaSuccess ? <GeetestCaptcha ref={this.captchaRef} onSuccess={this.handleGeetestCaptchaSuccess}/> : undefined;

        const className = cx('pg-sign-up-screen__container', { loading });
        return (
            <div className="pg-sign-up-screen">
                <div className={className}>
                        <div className="cr-logo">
                            <img src={logo} className="cr-logo__img" alt="Logo" />
                        </div>
                    <SignUpForm
                        labelSignIn={this.props.intl.formatMessage({ id: 'page.header.signIn'})}
                        labelSignUp={this.props.intl.formatMessage({ id: 'page.header.signUp'})}
                        emailLabel={this.props.intl.formatMessage({ id: 'page.header.signUp.email'})}
                        passwordLabel={this.props.intl.formatMessage({ id: 'page.header.signUp.password'})}
                        confirmPasswordLabel={this.props.intl.formatMessage({ id: 'page.header.signUp.confirmPassword'})}
                        referalCodeLabel={this.props.intl.formatMessage({ id: 'page.header.signUp.referalCode'})}
                        termsMessage={this.props.intl.formatMessage({ id: 'page.header.signUp.terms'})}
                        refId={refId}
                        handleChangeRefId={this.handleChangeRefId}
                        isLoading={loading}
                        onSignIn={this.handleSignIn}
                        onSignUp={this.handleSignUp}
                        siteKey={siteKey()}
                        captchaType={captchaType()}
                        email={email}
                        handleChangeEmail={this.handleChangeEmail}
                        password={password}
                        handleChangePassword={this.handleChangePassword}
                        confirmPassword={confirmPassword}
                        handleChangeConfirmPassword={this.handleChangeConfirmPassword}
                        recaptchaConfirmed={recaptchaConfirmed}
                        captcha_response={captcha_response}
                        recaptchaOnChange={this.onChange}
                        hasConfirmed={hasConfirmed}
                        clickCheckBox={this.handleCheckboxClick}
                        validateForm={this.handleValidateForm}
                        emailError={emailError}
                        passwordError={passwordError}
                        passwordValidationDetails={passwordValidationDetails}
                        confirmationError={confirmationError}
                        confirmPasswordFocused={confirmPasswordFocused}
                        refIdFocused={refIdFocused}
                        emailFocused={emailFocused}
                        passwordFocused={passwordFocused}
                        handleFocusEmail={this.handleFocusEmail}
                        handleFocusPassword={this.handleFocusPassword}
                        handleFocusConfirmPassword={this.handleFocusConfirmPassword}
                        handleFocusRefId={this.handleFocusRefId}
                        geetestCaptcha={test}
                        geetestCaptchaSuccess={geetestCaptchaSuccess}
                    />
                    <Modal
                        show={this.state.showModal}
                        header={this.renderModalHeader()}
                        content={this.renderModalBody()}
                        footer={this.renderModalFooter()}
                    />
                </div>
            </div>
        );
    }

    private handleCheckboxClick = () => {
        this.setState({
            hasConfirmed: !this.state.hasConfirmed,
        });
    }

    private onChange = (value: string) => {
        this.setState({
            recaptchaConfirmed: true,
            captcha_response: value,
        });
    };

    private handleChangeEmail = (value: string) => {
        this.setState({
            email: value,
        });
    };

    private handleChangePassword = (value: string) => {
        const {password} = this.state;

        const passwordValidationDetails = {
            isLengthAcceptable: password.length >= 8,
            hasDigits: !!password.match(/\d/),
            hasCapitalLetters: !!password.match(/[A-Z]/),
            hasLowerCaseLetters: !!password.match(/[a-z]/),
        };

        this.setState({
            password: value,
            passwordValidationDetails,
        });
    };

    private handleChangeConfirmPassword = (value: string) => {
        const {password, confirmPassword} = this.state;
        const isConfirmPasswordValid = password === confirmPassword;
        this.setState({
            confirmPassword: value,
            confirmationError: !isConfirmPasswordValid ? this.props.intl.formatMessage({ id: ERROR_PASSWORD_CONFIRMATION }) : null,
        });
    };

    private handleChangeRefId = (value: string) => {
        this.setState({
            refId: value,
        });
    };

    private handleFocusEmail = () => {
        this.setState({
            emailFocused: !this.state.emailFocused,
        });
    };

    private handleFocusPassword = () => {
        this.setState({
            passwordFocused: !this.state.passwordFocused,
        });
    };

    private handleFocusConfirmPassword = () => {
        this.setState({
            confirmPasswordFocused: !this.state.confirmPasswordFocused,
        });
    };

    private handleFocusRefId = () => {
        this.setState({
            refIdFocused: !this.state.refIdFocused,
        });
    };

    private handleSignIn = () => {
        this.props.history.push(buildPath('/signin', this.props.i18n));
    };

    private handleGeetestCaptchaSuccess = value => {
        this.setState({
            geetestCaptchaSuccess: true,
            captcha_response: value,
        });
    }

    private handleSignUp = () => {
        const {
            email,
            password,
            captcha_response,
            refId,
        } = this.state;

        const { i18n } = this.props;

        if (refId) {
            switch (captchaType()) {
                case 'none':
                    this.props.signUp({
                        email,
                        password,
                        refid: refId,
                        lang: i18n.toUpperCase(),
                    });
                    break;
                case 'recaptcha':
                case 'geetest':
                    this.props.signUp({
                        email,
                        password,
                        captcha_response,
                        refid: refId,
                    });
                    break;
                default:
                    this.props.signUp({
                        email,
                        password,
                        captcha_response,
                        refid: refId,
                        lang: i18n.toUpperCase(),
                    });
                    break;
            }
        } else {
            switch (captchaType()) {
                case 'none':
                    this.props.signUp({
                        email,
                        password,
                        lang: i18n.toUpperCase(),
                    });
                    break;
                case 'recaptcha':
                case 'geetest':
                default:
                    this.props.signUp({
                        email,
                        password,
                        captcha_response,
                        lang: i18n.toUpperCase(),
                    });
                    break;
            }
        }
    };

    private renderModalHeader = () => {
        return (
            <div className="pg-exchange-modal-submit-header">
                {this.props.intl.formatMessage({id: 'page.header.signUp.modal.header'})}
            </div>
        );
    };

    private renderModalBody = () => {
        return (
            <div className="pg-exchange-modal-submit-body">
                <h2>
                    {this.props.intl.formatMessage({id: 'page.header.signUp.modal.body'})}
                </h2>
            </div>
        );
    };

    private renderModalFooter = () => {
        return (
            <div className="pg-exchange-modal-submit-footer">
                <Button
                    className="pg-exchange-modal-submit-footer__button-inverse"
                    label="OK"
                    onClick={this.closeModal}
                />
            </div>
        );
    };

    private closeModal = () => {
        const { history, i18n } = this.props;
        this.setState({showModal: false});
        history.push(buildPath('/signin', i18n));
    };

    private extractRefID = (url: string) => new URLSearchParams(url).get('refid');

    private handleValidateForm = () => {
        const {email, password, confirmPassword} = this.state;
        const isEmailValid = email.match(EMAIL_REGEX);
        const isPasswordValid = password.match(PASSWORD_REGEX);
        const isConfirmPasswordValid = password === confirmPassword;

        const passwordValidationDetails = {
            isLengthAcceptable: password.length >= 8,
            hasDigits: !!password.match(/\d/),
            hasCapitalLetters: !!password.match(/[A-Z]/),
            hasLowerCaseLetters: !!password.match(/[a-z]/),
        };

        if (!isEmailValid && !isPasswordValid) {
            this.setState({
                confirmationError: '',
                emailError: this.props.intl.formatMessage({ id: ERROR_INVALID_EMAIL }),
                passwordError: this.props.intl.formatMessage({ id: ERROR_INVALID_PASSWORD }),
                hasConfirmed: false,
                passwordValidationDetails,
                geetestCaptchaSuccess: false,
            });
            return;
        }

        if (!isEmailValid) {
            this.setState({
                confirmationError: '',
                emailError: this.props.intl.formatMessage({ id: ERROR_INVALID_EMAIL }),
                passwordError: '',
                hasConfirmed: false,
                geetestCaptchaSuccess: false,
            });
            return;
        }

        if (!isPasswordValid) {
            this.setState({
                confirmationError: '',
                emailError: '',
                passwordError: this.props.intl.formatMessage({ id: ERROR_INVALID_PASSWORD }),
                hasConfirmed: false,
                passwordValidationDetails,
                geetestCaptchaSuccess: false,
            });
            return;
        }

        if (!isConfirmPasswordValid) {
            this.setState({
                confirmationError: this.props.intl.formatMessage({ id: ERROR_PASSWORD_CONFIRMATION }),
                emailError: '',
                passwordError: '',
                hasConfirmed: false,
                geetestCaptchaSuccess: false,
            });
            return;
        }
    }
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    requireVerification: selectSignUpRequireVerification(state),
    i18n: selectCurrentLanguage(state),
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        signUp: credentials => dispatch(signUp(credentials)),
    });

// tslint:disable-next-line:no-any
const SignUpScreen = injectIntl(withRouter(connect(mapStateToProps, mapDispatchProps)(SignUp) as any));

export {
    SignUpScreen,
};
