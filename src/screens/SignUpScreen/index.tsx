import cx from 'classnames';
import { History } from 'history';
import * as qs from 'qs';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import ReCAPTCHA from 'react-google-recaptcha';
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
import { Modal, SignUpForm } from '../../components';
import { GeetestCaptcha } from '../../containers';
import { buildPath } from '../../custom/helpers';
import {
    EMAIL_REGEX,
    ERROR_INVALID_EMAIL,
    ERROR_INVALID_PASSWORD,
    ERROR_PASSWORD_CONFIRMATION,
    setDocumentTitle,
} from '../../helpers';
import {
    Configs,
    RootState,
    selectConfigs,
    selectCurrentLanguage,
    selectSignUpError,
    selectSignUpRequireVerification,
    signUp,
} from '../../modules';
import { CommonError } from '../../modules/types';

const logo = require('../../assets/images/logo.svg');

interface ReduxProps {
    configs: Configs;
    requireVerification?: boolean;
    loading?: boolean;
    error?: CommonError;
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
        reCaptchaSuccess: false,
        refId: '',
        hasConfirmed: false,
        emailError: '',
        passwordError: '',
        passwordValidationDetails: {
            isLengthAcceptable: false,
            hasDigits: false,
            hasCapitalLetters: false,
            hasLowerCaseLetters: false,
        },
        confirmationError: '',
        emailFocused: false,
        passwordFocused: false,
        confirmPasswordFocused: false,
        refIdFocused: false,
        geetestCaptchaSuccess: false,
        shouldGeetestReset: false,
    };

    public constructor(props) {
        super(props);
        this.reCaptchaRef = React.createRef();
        this.geetestCaptchaRef = React.createRef();
    }

    private reCaptchaRef;
    private geetestCaptchaRef;

    public componentDidMount() {
        setDocumentTitle('Sign Up');
        const localReferralCode = localStorage.getItem('refid');
        const referralCode = this.extractRefID(this.props.location.search) || '';
        const haventLocalCode = !localReferralCode && referralCode;
        const haveLocalCode = localReferralCode && referralCode;
        if (haventLocalCode || haveLocalCode) {
            localStorage.setItem('referralCode', referralCode);
            this.setState({ refId: referralCode });
        }
        if (!referralCode) {
            this.setState({ refId: localReferralCode });
        }
    }

    public componentWillReceiveProps(nextProps: Props) {
        const { i18n, location } = this.props;

        if (nextProps.requireVerification) {

            const url = '/email-verification';
            let redirectUrl = '';
            const parsed = qs.parse(location.search, { ignoreQueryPrefix: true });
            // tslint:disable-next-line:no-console
            console.log('...........parsed', parsed);
            if (parsed.redirect_url) {
                redirectUrl = parsed.redirect_url;
                if (parsed.fiat && parsed.crypto && parsed.fiatValue) {
                    redirectUrl += `&fiat=${parsed.fiat}&crypto=${parsed.crypto}&fiatValue=${parsed.fiatValue}`;
                }
            }
            // tslint:disable-next-line:no-console
            console.log('...........redirectUrl', redirectUrl);
            localStorage.setItem('redirect_url', redirectUrl);
            nextProps.history.push(buildPath(url, i18n), {email: this.state.email});
        }

        if (nextProps.error) {
            this.setState({
                captcha_response: '',
                recaptchaConfirmed: false,
                geetestCaptchaSuccess: false,
            });
        }

        if (nextProps.signUpError) {
            if (this.reCaptchaRef.current) {
                this.reCaptchaRef.current.reset();
            }

            if (this.geetestCaptchaRef.current) {
                this.setState({ shouldGeetestReset: true });
            }
        }
    }

    public render() {
        const { configs, loading } = this.props;
        const {
            email,
            password,
            confirmPassword,
            refId,
            captcha_response,
            reCaptchaSuccess,
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
                        corporateTextLink={this.props.intl.formatMessage({ id: 'page.header.signUp.corporateLink'})}
                        refId={refId}
                        handleChangeRefId={this.handleChangeRefId}
                        isLoading={loading}
                        onSignIn={this.handleSignIn}
                        onSignUp={this.handleSignUp}
                        email={email}
                        handleChangeEmail={this.handleChangeEmail}
                        password={password}
                        handleChangePassword={this.handleChangePassword}
                        confirmPassword={confirmPassword}
                        handleChangeConfirmPassword={this.handleChangeConfirmPassword}
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
                        captchaType={configs.captcha_type}
                        renderCaptcha={this.renderCaptcha()}
                        reCaptchaSuccess={reCaptchaSuccess}
                        geetestCaptchaSuccess={geetestCaptchaSuccess}
                        captcha_response={captcha_response}
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

    private renderCaptcha = () => {
        const { configs } = this.props;
        const { shouldGeetestReset } = this.state;

        switch (configs.captcha_type) {
            case 'recaptcha':
                return (
                    <div className="cr-sign-up-form__recaptcha">
                        <ReCAPTCHA
                            ref={this.reCaptchaRef}
                            sitekey={configs.captcha_id}
                            onChange={this.handleReCaptchaSuccess}
                        />
                    </div>
                );
            case 'geetest':
                return (
                    <GeetestCaptcha
                        ref={this.geetestCaptchaRef}
                        shouldCaptchaReset={shouldGeetestReset}
                        onSuccess={this.handleGeetestCaptchaSuccess}
                    />
                );
            default:
                return null;

        }
    };


    private handleCheckboxClick = () => {
        this.setState({
            hasConfirmed: !this.state.hasConfirmed,
        });
    };

    private handleChangeEmail = (value: string) => {
        this.setState({
            email: value,
        });
    };

    private handleChangePassword = (value: string) => {
        const password = value;

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
        const {password} = this.state;
        const confirmPassword = value;
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
        let query = '';
        const parsed = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
        if (parsed.redirect_url) {
            query = `?redirect_url=${parsed.redirect_url}`;
        }
        this.props.history.push(buildPath(`/signin${query}`, this.props.i18n));
    };

    private handleReCaptchaSuccess = (value: string) => {
        this.setState({
            reCaptchaSuccess: true,
            captcha_response: value,
        });
    };

    private handleGeetestCaptchaSuccess = value => {
        this.setState({
            geetestCaptchaSuccess: true,
            captcha_response: value,
            shouldGeetestReset: false,
        });
    };

    private handleSignUp = () => {
        const { configs, i18n } = this.props;
        const {
            email,
            password,
            captcha_response,
            refId,
        } = this.state;

        if (refId) {
            switch (configs.captcha_type) {
                case 'none':
                    this.props.signUp({
                        email,
                        password,
                        refid: refId,
                        data: JSON.stringify({
                            language: i18n,
                        }),
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
                        data: JSON.stringify({
                            language: i18n,
                        }),
                    });
                    break;
            }
        } else {
            switch (configs.captcha_type) {
                case 'none':
                    this.props.signUp({
                        email,
                        password,
                        data: JSON.stringify({
                            language: i18n,
                        }),
                    });
                    break;
                case 'recaptcha':
                case 'geetest':
                default:
                    this.props.signUp({
                        email,
                        password,
                        captcha_response,
                        data: JSON.stringify({
                            language: i18n,
                        }),
                    });
                    break;
            }
        }

        this.setState({
            reCaptchaSuccess: false,
            geetestCaptchaSuccess: false,
            captcha_response: '',
        });
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
                    block={true}
                    onClick={this.closeModal}
                    size="lg"
                    variant="primary"
                >
                    {this.props.intl.formatMessage({id: 'page.header.signUp.modal.footer'})}
                </Button>
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
        const isConfirmPasswordValid = password === confirmPassword;
        const passwordValidationDetails = {
            isLengthAcceptable: password.length >= 8,
            hasDigits: !!password.match(/\d/),
            hasCapitalLetters: !!password.match(/[A-Z]/),
            hasLowerCaseLetters: !!password.match(/[a-z]/),
        };
        const isPasswordValid = passwordValidationDetails.isLengthAcceptable &&
            passwordValidationDetails.hasDigits &&
            passwordValidationDetails.hasCapitalLetters &&
            passwordValidationDetails.hasLowerCaseLetters;

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
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    configs: selectConfigs(state),
    i18n: selectCurrentLanguage(state),
    requireVerification: selectSignUpRequireVerification(state),
    signUpError: selectSignUpError(state),
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
