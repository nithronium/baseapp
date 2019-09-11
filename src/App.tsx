import { History } from 'history';
import * as React from 'react';
import CookieConsent from 'react-cookie-consent';
import { IntlProvider } from 'react-intl';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { Router } from 'react-router';
import { GuardModal } from './components';
import { Alerts, ErrorWrapper, Header } from './containers';
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
    setLicenseExpiration,
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
}

interface DispatchProps {
    closeGuardModal: typeof closeGuardModal;
    licenseFetch: typeof licenseFetch;
    setLicenseExpiration: typeof setLicenseExpiration;
}

type Props = AppProps & ReduxProps & DispatchProps;

class AppLayout extends React.Component<Props, {}, {}> {
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
                            <CookieConsent
                                buttonText="Got it!"
                                contentClasses="cookie-consent__content"
                                buttonClasses="cookie-consent__button"
                            >
                                <span>The exchange works in BETA-testing mode. Some operations may be limited. All the
                                    users and ballances will migrate from BITMEEX exchange within several days. We
                                    would like to get your feedback and recommendations for improvement
                                    at <a href="mailto:beta_testing@emirex.com">beta_testing@emirex.com</a>.
                                </span>
                            </CookieConsent>
                            <Header/>
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
