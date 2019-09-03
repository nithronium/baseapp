import { History } from 'history';
import * as React from 'react';
// import CookieConsent from 'react-cookie-consent';
import { IntlProvider } from 'react-intl';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { Router } from 'react-router';
import { GuardModal } from './components';
import { Alerts, ErrorWrapper, Header, Sidebar } from './containers';
import { GuardWrapper } from './containers/Guard';
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

import { googleTranslateElementInit, initLanguageChangeEvent } from './helpers/googleTranslate';

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

type Props = AppProps & ReduxProps & DispatchProps;

class AppLayout extends React.Component<Props, {}, {}> {

    public googleTranslateUnsubscribe?: () => void;

    public componentWillReceiveProps(nextProps: Props) {
        const prevLang = this.props.locale.lang;
        const nextLang = nextProps.locale.lang;

        if (prevLang !== nextLang) {
            setTimeout(() => {
                googleTranslateElementInit(nextLang);
            }, 0);
        }
    }

    public componentDidMount() {
        /**
         * At the time `componentDidMount` is called, the google translate
         * object may not be initialized yet because scripts haven't loaded yet.
         * We can't use the default callback 'cause we can't just pass
         * `componentDidMount` of whatever function as a callback.
         *
         * So in the google translate callback we fire an event
         * `google-translate-loaded` (see public/index.html) and
         * also set a global flag `googleTranslateLoaded`, so we can track
         * the state of google scripts in our components.
         */
        if ('googleTranslateLoaded' in window) {
            this.initGoogleTranslate();
            this.initLangChange();
        } else {
            window.addEventListener('google-translate-loaded', () => {
                this.initGoogleTranslate();
                this.initLangChange();
            });
        }
    }

    public initLangChange = () => {
        const unsubscribe = initLanguageChangeEvent();
        this.googleTranslateUnsubscribe = unsubscribe;
    };

    public initGoogleTranslate = () => {
        const { locale } = this.props;
        googleTranslateElementInit(locale.lang);
    };

    public componentWillUnmount() {
        this.googleTranslateUnsubscribe && this.googleTranslateUnsubscribe();
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
        } = this.props;
        const { lang, messages } = locale;

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
                            {/* <CookieConsent */}
                                {/* buttonText="Got it!" */}
                                {/* contentClasses="cookie-consent__content" */}
                                {/* buttonClasses="cookie-consent__button" */}
                            {/* > */}
                                {/* <span>The exchange is in alpha testing mode. Exchange operation is limited.</span> */}
                            {/* </CookieConsent> */}
                            <Header/>
                            <Sidebar/>
                            <Alerts/>
                            <Layout/>
                        </ErrorWrapper>
                    </Router>
                    {guardModal && <GuardModal onClose={this.props.closeGuardModal}/>}
                </GuardWrapper>
            </IntlProvider>
        );
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
