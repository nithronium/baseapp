import { Button } from '@openware/components';
import cx from 'classnames';
import { History } from 'history';
import * as React from 'react';
import { Helmet } from 'react-helmet';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
//import { withRouter } from 'react-router-dom';
import { captchaType, siteKey } from '../../../api';
import logo = require('../../../assets/images/logo.svg');
import { Modal, SignUpForm } from '../../../components';
import {
    EMAIL_REGEX,
    ERROR_INVALID_EMAIL,
    ERROR_INVALID_PASSWORD,
    ERROR_PASSWORD_CONFIRMATION,
    PASSWORD_REGEX,
    setDocumentTitle,
} from '../../../helpers';
import {
    BonusPayload,
    ReferralPayload,
    referralTicketsFetch,
    ReferralTicketsPayload,
    RootState,
    selectCurrentLanguage,
    selectReferralTicketsBonuses,
    selectReferralTicketsDirect,
    selectReferralTicketsReferrals,
    selectSignUpRequireVerification,
    selectUserInfo,
    signUp,
    User,
} from '../../../modules';
import {  Banner, Footer, GetCode, HIW, HowTo, Prizes, Timelines, Video } from '../../components/Referral';

interface ReduxProps {
    requireVerification?: boolean;
    loading?: boolean;
    user: User;
    bonuses: ReferralTicketsPayload['bonuses'];
    direct: ReferralTicketsPayload['user'];
    referrals: ReferralTicketsPayload['referrals'];
}

interface DispatchProps {
    signUp: typeof signUp;
    fetchReferralTickets: typeof referralTicketsFetch;
}

interface RouterProps {
    location: {
        search: string;
    };
    history: History;
}

type Props = ReduxProps & DispatchProps & RouterProps & InjectedIntlProps;

export const extractRefID = (props: RouterProps) => new URLSearchParams(props.location.search).get('refid');

class Referral extends React.Component<Props> {
    public readonly state = {
        showModal: false,
        email: '',
        password: '',
        confirmPassword: '',
        recaptcha_response: '',
        recaptchaConfirmed: false,
        refId: '',
        hasConfirmed: false,
        emailError: '',
        passwordError: '',
        confirmationError: '',
        emailFocused: false,
        passwordFocused: false,
        confirmPasswordFocused: false,
        refIdFocused: false,
    };

    public componentDidMount() {
        setDocumentTitle('Referral');
        const referralCode = this.extractRefID(this.props.location.search) || '';
        this.setState({
            refId: referralCode,
        });
        this.props.fetchReferralTickets();
    }

    public componentWillReceiveProps(props: Props) {
        if (props.requireVerification) {
            props.history.push('/email-verification', { email: this.state.email });
        }
    }

    public render() {
        const {
            email,
            password,
            confirmPassword,
            refId,
            recaptcha_response,
            recaptchaConfirmed,
            hasConfirmed,
            emailError,
            passwordError,
            confirmationError,
            emailFocused,
            passwordFocused,
            confirmPasswordFocused,
            refIdFocused,
        } = this.state;
        const { loading } = this.props;

        const className = cx('pg-referral-screen__container', { loading });

        const signupForm = () => {
            return (
                <div className={className}>
                    <div className="cr-logo">
                        <img src={logo} className="cr-logo__img" alt="Logo" />
                    </div>
                    <SignUpForm
                        labelSignIn={this.props.intl.formatMessage({ id: 'page.header.signIn' })}
                        labelSignUp="Sign up to WIN!"
                        emailLabel={this.props.intl.formatMessage({ id: 'page.header.signUp.email' })}
                        passwordLabel={this.props.intl.formatMessage({ id: 'page.header.signUp.password' })}
                        confirmPasswordLabel={this.props.intl.formatMessage({ id: 'page.header.signUp.confirmPassword' })}
                        referalCodeLabel={this.props.intl.formatMessage({ id: 'page.header.signUp.referalCode' })}
                        termsMessage={this.props.intl.formatMessage({ id: 'page.header.signUp.terms' })}
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
                        recaptcha_response={recaptcha_response}
                        recaptchaOnChange={this.onChange}
                        hasConfirmed={hasConfirmed}
                        clickCheckBox={this.handleCheckboxClick}
                        validateForm={this.handleValidateForm}
                        emailError={emailError}
                        passwordError={passwordError}
                        confirmationError={confirmationError}
                        confirmPasswordFocused={confirmPasswordFocused}
                        refIdFocused={refIdFocused}
                        emailFocused={emailFocused}
                        passwordFocused={passwordFocused}
                        handleFocusEmail={this.handleFocusEmail}
                        handleFocusPassword={this.handleFocusPassword}
                        handleFocusConfirmPassword={this.handleFocusConfirmPassword}
                        handleFocusRefId={this.handleFocusRefId}
                    />
                    <Modal
                        show={this.state.showModal}
                        header={this.renderModalHeader()}
                        content={this.renderModalBody()}
                        footer={this.renderModalFooter()}
                    />
                </div>
            );
        };

        const totalTickets = () => {
            return (
                <div className="total-tickets-wrapper">
                    <div className="total-tickets">
                        <div className="header">My total tickets: {this.getTotalTickets()}</div>
                        <div className="content">
                            Go to <a href="/referral-tickets">Referral balance</a>
                        </div>
                    </div>
                </div>
            );
        };

        return (
            <div>
                <Helmet>
                    <title>Emirex: Bitcoin Referral Program - Make BTC from your traffic | Emirex.com</title>
                    <meta
                        name="description"
                        content="Earn bitcoins for each transaction your referrals make - join Emirex referral program. Earn up commission every time your friends make a trade on Emirex. We are offering prizes: $100k in Bitcoin and $100k in EMRX."
                    />
                    <link rel="canonical" href="https://emirex.com/referral" />

                    <link key="ru" rel="alternate" href="https://emirex.com/ru/referral" hrefLang="ru" />
                    <link key="ar" rel="alternate" href="https://emirex.com/ar/referral" hrefLang="ar" />
                    <link key="en" rel="alternate" href="https://emirex.com/en/referral" hrefLang="en" />

                    <meta name="og:title" content="Bitcoin Referral Program - Make BTC from your traffic | Emirex.com" />
                    <meta
                        name="og:description"
                        content="Earn bitcoins for each transaction your referrals make - join Emirex referral program. Earn up commission every time your friends make a trade on Emirex. We are offering prizes: $100k in Bitcoin and $100k in EMRX."
                    />
                    <meta name="og:image" content="https://emirex.com/public/img/logo-emirex.svg" />
                </Helmet>
                <div className="pg-referral-screen">
                    <Banner>{this.props.user.uid ? totalTickets() : signupForm()}</Banner>
                    <HIW />
                    <Video />
                    <Timelines />
                    <HowTo />
                    <Prizes />
                    <GetCode />
                    <Footer />
                </div>
            </div>
        );
    }

    private handleCheckboxClick = () => {
        this.setState({
            hasConfirmed: !this.state.hasConfirmed,
        });
    };

    private onChange = (value: string) => {
        this.setState({
            recaptchaConfirmed: true,
            recaptcha_response: value,
        });
    };

    private handleChangeEmail = (value: string) => {
        this.setState({
            email: value,
        });
    };

    private handleChangePassword = (value: string) => {
        this.setState({
            password: value,
        });
    };

    private handleChangeConfirmPassword = (value: string) => {
        this.setState({
            confirmPassword: value,
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
        this.props.history.push('/signin');
    };

    private handleSignUp = () => {
        const { email, password, recaptcha_response, refId } = this.state;

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
                default:
                    this.props.signUp({
                        email,
                        password,
                        recaptcha_response,
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
                        recaptcha_response,
                        lang: i18n.toUpperCase(),
                    });
                    break;
            }
        }
    };

    private renderModalHeader = () => {
        return (
            <div className="pg-exchange-modal-submit-header">
                {this.props.intl.formatMessage({ id: 'page.header.signUp.modal.header' })}
            </div>
        );
    };

    private renderModalBody = () => {
        return (
            <div className="pg-exchange-modal-submit-body">
                <h2>{this.props.intl.formatMessage({ id: 'page.header.signUp.modal.body' })}</h2>
            </div>
        );
    };

    private renderModalFooter = () => {
        return (
            <div className="pg-exchange-modal-submit-footer">
                <Button className="pg-exchange-modal-submit-footer__button-inverse" label="OK" onClick={this.closeModal} />
            </div>
        );
    };

    private closeModal = () => {
        this.setState({ showModal: false });
        this.props.history.push('/signin');
    };

    private extractRefID = (url: string) => new URLSearchParams(url).get('refid');

    private handleValidateForm = () => {
        const { email, password, confirmPassword } = this.state;
        const isEmailValid = email.match(EMAIL_REGEX);
        const isPasswordValid = password.match(PASSWORD_REGEX);
        const isConfirmPasswordValid = password === confirmPassword;

        if (!isEmailValid && !isPasswordValid) {
            this.setState({
                confirmationError: '',
                emailError: this.props.intl.formatMessage({ id: ERROR_INVALID_EMAIL }),
                passwordError: this.props.intl.formatMessage({ id: ERROR_INVALID_PASSWORD }),
                hasConfirmed: false,
            });
            return;
        }

        if (!isEmailValid) {
            this.setState({
                confirmationError: '',
                emailError: this.props.intl.formatMessage({ id: ERROR_INVALID_EMAIL }),
                passwordError: '',
                hasConfirmed: false,
            });
            return;
        }

        if (!isPasswordValid) {
            this.setState({
                confirmationError: '',
                emailError: '',
                passwordError: this.props.intl.formatMessage({ id: ERROR_INVALID_PASSWORD }),
                hasConfirmed: false,
            });
            return;
        }

        if (!isConfirmPasswordValid) {
            this.setState({
                confirmationError: this.props.intl.formatMessage({ id: ERROR_PASSWORD_CONFIRMATION }),
                emailError: '',
                passwordError: '',
                hasConfirmed: false,
            });
            return;
        }
    };

    private getTotalTickets() {
        let total = 0;

        if (this.props.direct) {
            total += this.props.direct.emrxTickets;
            total += this.props.direct.usdTickets;
            total += this.props.direct.ticketForRegistration;
        }

        if (this.props.referral) {
            this.props.referrals.map((record: ReferralPayload) => {
                total += /* record.isActive * */ (record.tickets + record.activeSubreferrals);
            });
        }

        if (this.props.bonus) {
            this.props.bonus.map((record: BonusPayload) => {
                total += record.tickets;
                return true;
            });
        }

        return total;
    }
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    requireVerification: selectSignUpRequireVerification(state),
    i18n: selectCurrentLanguage(state),
    user: selectUserInfo(state),
    bonuses: selectReferralTicketsBonuses(state),
    direct: selectReferralTicketsDirect(state),
    referrals: selectReferralTicketsReferrals(state),
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    signUp: credentials => dispatch(signUp(credentials)),
    fetchReferralTickets: () => dispatch(referralTicketsFetch()),
});

// tslint:disable
const ReferralScreen = injectIntl(connect(
    mapStateToProps,
    mapDispatchProps
)(Referral) as any);

export { ReferralScreen };
