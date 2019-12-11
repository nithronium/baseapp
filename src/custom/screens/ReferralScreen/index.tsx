//tslint:disable
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
    // setDocumentTitle,
} from '../../../helpers';
import {
    referralTicketsFetch,
    ReferralOverallPayload,
    RootState,
    selectCurrentLanguage,
    selectReferralTicketsOverall,
    selectSignUpRequireVerification,
    selectUserInfo,
    signUp,
    User,
} from '../../../modules';
import { Banner, Footer, GetCode, HIW, HowTo, Prizes, Timelines, Video } from '../../components/Referral';

import { buildPath } from '../../helpers';

interface ReduxProps {
    requireVerification?: boolean;
    loading?: boolean;
    user: User;
    overall: ReferralOverallPayload['overall'];
    currentLanguage: string;
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

        const lang = this.props.location.pathname.includes('/ru/') ? 'ru' : 'en';
        localStorage.setItem('lang_code', lang);
        let referralCode = this.extractRefID(this.props.location.search) || '';
        if (localStorage.getItem('refCode')) {
            referralCode = localStorage.getItem('refCode') || '';
        }
        localStorage.setItem('refCode', referralCode);
        if (localStorage.getItem('refCode')) {
            this.setState({
                refId: localStorage.getItem('refCode'),
            })
        }
        this.setState({
            refId: referralCode,
        });
        const query = '/tickets/all';
        this.props.fetchReferralTickets(query);

    }

 

    public componentWillReceiveProps(props: Props) {
        if (props.requireVerification) {
            props.history.push('/email-verification', { email: this.state.email });
        }
        
        document.getElementsByTagName('html')![0].lang = this.props.currentLanguage;
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
        const { loading, currentLanguage } = this.props;

        const className = cx('pg-referral-screen__container', { loading });

        const signupForm = () => {
            return (
                <div className={className}>
                    <div className="cr-logo">
                        <img src={logo} className="cr-logo__img" alt="Logo" />
                    </div>
                    <SignUpForm
                        labelSignIn={this.props.intl.formatMessage({ id: 'page.header.signIn' })}
                        labelSignUp={this.props.intl.formatMessage({ id: 'page.referral.signup' })}
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
                        <div className="header">{this.props.intl.formatMessage({ id: 'referral.teaser.total' })} {this.getTotalTickets()}</div>
                        <div className="content">
                        {this.props.intl.formatMessage({ id: 'referral.teaser.goto' })}<br/> <a href={buildPath('/referral-tickets', this.props.currentLanguage)}>{this.props.intl.formatMessage({ id: 'referral.teaser.balance' })}</a>
                        </div>
                    </div>
                </div>
            );
        };

        const steps = [
            {
                h3: `${this.props.intl.formatMessage({ id: 'page.referral.hiw.step' })} 1`,
                h4Green: this.props.intl.formatMessage({ id: 'page.referral.hiw.h4green1' }),
                h4Rest: this.props.intl.formatMessage({ id: 'page.referral.hiw.h4_1' }),
                text: this.props.intl.formatMessage({ id: 'page.referral.hiw.text1' }),
            },
            {
                h3: `${this.props.intl.formatMessage({ id: 'page.referral.hiw.step' })} 2`,
                h4Green: this.props.intl.formatMessage({ id: 'page.referral.hiw.h4green2' }),
                h4Rest: this.props.intl.formatMessage({ id: 'page.referral.hiw.h4_2' }),
                soon: this.props.intl.formatMessage({ id: 'page.referral.soon' }),
                text: this.props.intl.formatMessage({ id: 'page.referral.hiw.text2' }),
            },
            {
                h3: `${this.props.intl.formatMessage({ id: 'page.referral.hiw.step' })} 3`,
                h4Green: this.props.intl.formatMessage({ id: 'page.referral.hiw.h4green3' }),
                h4Rest: this.props.intl.formatMessage({ id: 'page.referral.hiw.h4_3' }),
                text: this.props.intl.formatMessage({ id: 'page.referral.hiw.text3' }),
            },
            {
                h3: `${this.props.intl.formatMessage({ id: 'page.referral.hiw.step' })} 4`,
                h4Green: this.props.intl.formatMessage({ id: 'page.referral.hiw.h4green4' }),
                h4Rest: this.props.intl.formatMessage({ id: 'page.referral.hiw.h4_4' }),
                text: this.props.intl.formatMessage({ id: 'page.referral.hiw.text4' }),
            },
        ];

        return (
            <div>
                <Helmet>
                    <title>{this.props.intl.formatMessage({ id: 'referral_title' })}</title>
                    <meta
                        name="description"
                        content={this.props.intl.formatMessage({ id: 'referral_description' })}
                    />
                    <link rel="canonical" href={`https://emirex.com${currentLanguage === 'en' ? '/' : '/' + currentLanguage + '/'}referral`} />

                    <link key="ru" rel="alternate" href="https://emirex.com/ru/referral" hrefLang="ru" title="Русский"/>
                    {/* <link key="ar" rel="alternate" href="https://emirex.com/ar/referral" hrefLang="ar" /> */}
                    <link key="en" rel="alternate" href="https://emirex.com/referral" hrefLang="en" title="English"/>

                    <meta name="og:title" content={this.props.intl.formatMessage({ id: 'referral_title' })} />
                    <meta
                        name="og:description"
                        content={this.props.intl.formatMessage({ id: 'referral_description' })}
                    />
                    <meta name="og:image" content="https://emirex.com/public/img/logo-emirex.svg" />
                </Helmet>
                <div className="pg-referral-screen">
                    <Banner lang={currentLanguage} children={this.props.user.state === 'active' ? totalTickets() : signupForm()} />                  <HIW
                        hiw={this.props.intl.formatMessage({ id: 'page.referral.hiw' })}
                        subtitle={this.props.intl.formatMessage({id: 'page.referral.hiw.subtitle'})}
                        steps={steps}
                    />
                    <Video text={this.props.intl.formatMessage({id: 'page.referral.video.text'})} lang={this.props.currentLanguage}/>
                    <Timelines
                        title={this.props.intl.formatMessage({ id: 'timeline.title' })}
                        text1={this.props.intl.formatMessage({ id: 'timeline.start.text' })}
                        date1={this.props.intl.formatMessage({ id: 'timeline.start.date' })}
                        time1={this.props.intl.formatMessage({ id: 'timeline.start.time' })}
                        text2={this.props.intl.formatMessage({ id: 'timeline.end.text' })}
                        date2={this.props.intl.formatMessage({ id: 'timeline.end.date' })}
                        time2={this.props.intl.formatMessage({ id: 'timeline.end.time' })}
                    />
                    <HowTo
                        h2={this.props.intl.formatMessage({ id: 'howto.h2' })}
                        h4={this.props.intl.formatMessage({ id: 'howto.h4' })}
                        soon={this.props.intl.formatMessage({id: 'page.referral.soon'})}
                        text1={this.props.intl.formatMessage({id: 'howto.text1'})}
                        text2={this.props.intl.formatMessage({id: 'howto.text2'})}
                        text3={this.props.intl.formatMessage({id: 'howto.text3'})}
                        text4={this.props.intl.formatMessage({id: 'howto.text4'})}
                    />
                    <Prizes intl={this.props.intl}/>
                    <GetCode intl={this.props.intl}/>
                    <Footer intl={this.props.intl}/>
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

    private extractRefID = (url: string) => {
        const refId = new URLSearchParams(url).get('refid');
        if (refId) {
            return refId!.split('?')[0];
        }
        return refId;
    };

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

        const overall = this.props.overall;
        total += overall.direct.active;
        total += overall.direct.inactive;

        total += overall.bonuses.active;
        total += overall.bonuses.inactive;

        total += overall.referrals.active;
        total += overall.referrals.inactive;

        return total;
    }
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    currentLanguage: selectCurrentLanguage(state),
    requireVerification: selectSignUpRequireVerification(state),
    i18n: selectCurrentLanguage(state),
    user: selectUserInfo(state),
    overall: selectReferralTicketsOverall(state),
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    signUp: credentials => dispatch(signUp(credentials)),
    fetchReferralTickets:data => dispatch(referralTicketsFetch(data)),
});

// tslint:disable
const ReferralScreen = injectIntl(connect(
    mapStateToProps,
    mapDispatchProps
)(Referral) as any);

export { ReferralScreen };
