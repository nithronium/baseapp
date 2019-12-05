import classnames from 'classnames';
import { History } from 'history';
import * as React from 'react';
import CookieConsent from 'react-cookie-consent';
import { IntlProvider } from 'react-intl';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { Router } from 'react-router';
import { GuardModal } from './components';
import { Alerts, ErrorWrapper, Header } from './containers';
import { GuardWrapper } from './containers/Guard';
import { LoginModal } from './custom/components/KYCLoginModal';
import {
    closeGuardModal,
    licenseFetch,
    RootState,
    selectAppVersion,
    selectBuildExpire,
    selectGuardModalOpened,
    selectTenkoPublicKey,
    selectToken,
    selectTokenFetching,
    selectUserInfo,
    selectUserLoggedIn,
    setLicenseExpiration,
    User,
} from './modules';
import { Layout } from './routes';

interface Locale {
    lang: string;
    messages: object;
}

interface AppProps {
    history: History;
}

interface ReduxProps {
    locale: Locale;
    guardModal: boolean;
    version: string;
    buildExpire: string;
    tenkoKey: string;
    token: string;
    tokenFetching: boolean;
    userData: User;
    isLoggedIn: boolean;
}

interface DispatchProps {
    closeGuardModal: typeof closeGuardModal;
    licenseFetch: typeof licenseFetch;
    setLicenseExpiration: typeof setLicenseExpiration;
}
interface State {
    diplayKYCLoginModal: boolean;
}

type Props = AppProps & ReduxProps & DispatchProps;

class AppLayout extends React.Component<Props, State, {}> {
    public state = {
        diplayKYCLoginModal: false,
    };

    public componentWillReceiveProps(nextProps) {
        if (!this.props.isLoggedIn && nextProps.isLoggedIn) {
            this.handleOpenLoginModal();
        }
    }

    public render() {
        const {
            locale,
            history,
            guardModal,
            version,
            buildExpire,
            tenkoKey,
            token,
            tokenFetching,
            userData,
        } = this.props;
        const { lang, messages } = locale;

        const cx = classnames('pg-kyc-login',{
            'pg-kyc-login--visible': this.state.diplayKYCLoginModal &&
                !location.pathname.startsWith('/confirm') &&
                userData.level % 2 !== 0,
        });

        return (
            <IntlProvider locale={lang} messages={messages} key={lang}>
                <GuardWrapper
                    version={version}
                    buildExpire={buildExpire}
                    tenkoKey={tenkoKey}
                    licenseFetch={this.props.licenseFetch}
                    setLicenseExpiration={this.props.setLicenseExpiration}
                    token={token}
                    tokenFetching={tokenFetching}
                >
                    <Router history={history}>
                        <ErrorWrapper>
                            <CookieConsent
                                buttonText="Got it!"
                                contentClasses="cookie-consent__content"
                                buttonClasses="cookie-consent__button"
                            >
                                <span>The exchange is in alpha testing mode. Exchange operation is limited.</span>
                            </CookieConsent>
                            <Header/>
                            <Alerts/>
                            <Layout/>
                        </ErrorWrapper>
                    </Router>
                    {guardModal && <GuardModal onClose={this.props.closeGuardModal}/>}
                    <LoginModal
                        classname={cx}
                        closeModal={this.handleDisplayModal}
                        userLevel={userData.level}
                        history={history}
                    />
                </GuardWrapper>
            </IntlProvider>
        );
    }

    private handleOpenLoginModal = () => {
        this.setState({
            diplayKYCLoginModal: true,
        }, () => {
            document.addEventListener('click', this.handleCloseLoginModal);
        });
    };

    private handleCloseLoginModal = () => {
        this.setState({
            diplayKYCLoginModal: false,
        }, () => {
            document.removeEventListener('click', this.handleCloseLoginModal);
        });
    }

    private handleDisplayModal = (value: boolean) => {
        this.setState({
            diplayKYCLoginModal: value,
        });
    }
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> =
    (state: RootState): ReduxProps => ({
        locale: state.public.i18n,
        guardModal: selectGuardModalOpened(state),
        version: selectAppVersion(state),
        buildExpire: selectBuildExpire(state),
        tenkoKey: selectTenkoPublicKey(state),
        token: selectToken(state),
        tokenFetching: selectTokenFetching(state),
        userData: selectUserInfo(state),
        isLoggedIn: selectUserLoggedIn(state),
    });

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        closeGuardModal: () => dispatch(closeGuardModal()),
        licenseFetch: () => dispatch(licenseFetch()),
        setLicenseExpiration: payload => dispatch(setLicenseExpiration(payload)),
    });

// tslint:disable-next-line:no-any
const App = connect(mapStateToProps, mapDispatchToProps)(AppLayout) as any;

export {
    AppProps,
    App,
};
