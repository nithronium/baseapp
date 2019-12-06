import { Loader } from '@openware/components';
import { History } from 'history';
import * as React from 'react';
import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Route, Switch } from 'react-router';
import { Redirect, withRouter } from 'react-router-dom';
import { minutesUntilAutoLogout } from '../../api';
import { buildPath } from '../../custom/helpers';
import {
    ReferralCommissionScreen,
    ReferralScreen,
    ReferralTicketsScreen,
    TradingScreen,
} from '../../custom/screens';
import { toggleColorTheme } from '../../helpers';
import {
    logoutFetch,
    Market,
    RootState,
    selectCurrentColorTheme,
    selectCurrentLanguage,
    selectCurrentMarket,
    selectUserFetching,
    selectUserInfo,
    selectUserLoggedIn,
    User,
    userFetch,
    walletsReset,
} from '../../modules';
import {
    ChangeForgottenPasswordScreen,
    ConfirmScreen,
    EmailVerificationScreen,
    ForgotPasswordScreen,
    HistoryScreen,
    OrdersTabScreen,
    ProfileScreen,
    ProfileTwoFactorAuthScreen,
    SignInScreen,
    SignUpScreen,
    VerificationScreen,
    WalletsScreen,
} from '../../screens';

interface ReduxProps {
    currentLanguage: string;
    colorTheme: string;
    currentMarket: Market | undefined;
    user: User;
    isLoggedIn: boolean;
    userLoading?: boolean;
}

interface DispatchProps {
    logout: typeof logoutFetch;
    userFetch: typeof userFetch;
    walletsReset: typeof walletsReset;
}

interface OwnProps {
    history: History;
}

export type LayoutProps = ReduxProps & DispatchProps & OwnProps;

const renderLoader = () => (
    <div className="pg-loader-container">
        <Loader />
    </div>
);

const CHECK_INTERVAL = 15000;
const STORE_KEY = 'lastAction';

//tslint:disable-next-line no-any
const PrivateRoute: React.FunctionComponent<any> = ({ component: CustomComponent, loading, isLogged, ...rest }) => {
    if (loading) {
        return renderLoader();
    }
    const renderCustomerComponent = props => <CustomComponent {...props} />;

    if (isLogged) {
        return <Route {...rest} render={renderCustomerComponent} />;
    }

    return (
        <Route {...rest}>
            <Redirect to={buildPath('/signin', rest.currentLanguage)} />
        </Route>
    );
};

//tslint:disable-next-line no-any
const PublicRoute: React.FunctionComponent<any> = ({ component: CustomComponent, loading, isLogged, ...rest }) => {
    if (loading) {
        return renderLoader();
    }

    if (isLogged) {
        return(
            <Route {...rest}>
                <Redirect to={buildPath('/wallets', rest.currentLanguage)} />
            </Route>
        );
    }

    const renderCustomerComponent = props => <CustomComponent {...props} />;
    return <Route {...rest} render={renderCustomerComponent} />;
};

class LayoutComponent extends React.Component<LayoutProps> {
    public static eventsListen = ['click', 'keydown', 'scroll', 'resize', 'mousemove', 'TabSelect', 'TabHide'];

    public timer;
    public walletsFetchInterval;

    constructor(props: LayoutProps) {
        super(props);
        this.initListener();
    }

    public componentDidMount() {
        this.props.userFetch();
        this.initInterval();
        this.check();
    }

    public componentDidUpdate(next: LayoutProps) {
        const {
            currentLanguage,
            isLoggedIn,
            history,
        } = this.props;
        const siteState = localStorage.getItem('uil');

        if (isLoggedIn && !siteState) {
            localStorage.setItem('uil', 'true');
        } else if (isLoggedIn && siteState === 'false') {
            this.props.logout();
        } else if (!isLoggedIn) {
            localStorage.removeItem('uil');
        }

        if (!isLoggedIn && next.isLoggedIn) {
            this.props.walletsReset();
            if ((!history.location.pathname.includes('/trading')) && (!history.location.pathname.includes('/referral'))) {
                history.push(buildPath('/trading/', currentLanguage));
            }
        }
    }
    public componentWillUnmount() {
        for (const type of LayoutComponent.eventsListen) {
            document.body.removeEventListener(type, this.reset);
        }
        clearInterval(this.timer);
        clearInterval(this.walletsFetchInterval);
    }

    // public removeSlash = (path: string): string => {
    //     const { history } = this.props;
    //     if (path.slice(-1) === '/') {
    //         history.replace(path.slice(0, -1));
    //         return path.slice(0, -1);
    //     } else {
    //         return path;
    //     }
    // }

    public render() {
        const {
            colorTheme,
            currentLanguage,
            isLoggedIn,
            userLoading,
        } = this.props;

        toggleColorTheme(colorTheme);

        return (
            <div className="container-fluid pg-layout">
                <Switch>
                    <PublicRoute loading={userLoading} isLogged={isLoggedIn} path={buildPath('/signin', currentLanguage)} component={SignInScreen} currentLanguage={currentLanguage} />
                    <PublicRoute loading={userLoading} isLogged={isLoggedIn} path={buildPath('/accounts/confirmation', currentLanguage)} component={VerificationScreen} currentLanguage={currentLanguage} />
                    <PublicRoute loading={userLoading} isLogged={isLoggedIn} path={buildPath('/signup', currentLanguage)} component={SignUpScreen} currentLanguage={currentLanguage} />
                    <PublicRoute loading={userLoading} isLogged={isLoggedIn} path={buildPath('/forgot_password', currentLanguage)} component={ForgotPasswordScreen} currentLanguage={currentLanguage} />
                    <PublicRoute loading={userLoading} isLogged={isLoggedIn} path={buildPath('/accounts/password_reset', currentLanguage)} component={ChangeForgottenPasswordScreen} currentLanguage={currentLanguage} />
                    <PublicRoute loading={userLoading} isLogged={isLoggedIn} path={buildPath('/email-verification', currentLanguage)} component={EmailVerificationScreen} currentLanguage={currentLanguage} />
                    <Route loading={userLoading} isLogged={isLoggedIn} path={buildPath('/referral', currentLanguage)} component={ReferralScreen} />
                    <Route loading={userLoading} isLogged={isLoggedIn} path={'/ru/referral'} component={ReferralScreen} />
                    <Route exact={true} path={buildPath('/trading/:market?', currentLanguage)} component={TradingScreen} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path={buildPath('/orders', currentLanguage)} component={OrdersTabScreen} currentLanguage={currentLanguage} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path={buildPath('/history', currentLanguage)} component={HistoryScreen} currentLanguage={currentLanguage} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path={buildPath('/confirm', currentLanguage)} component={ConfirmScreen} currentLanguage={currentLanguage} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path={buildPath('/profile', currentLanguage)} component={ProfileScreen} currentLanguage={currentLanguage} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path={buildPath('/wallets', currentLanguage)} component={WalletsScreen} currentLanguage={currentLanguage} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path={buildPath('/security/2fa', currentLanguage)} component={ProfileTwoFactorAuthScreen} currentLanguage={currentLanguage} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path={buildPath('/referral-tickets', currentLanguage)} component={ReferralTicketsScreen} currentLanguage={currentLanguage} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path={buildPath('/referral-commission', currentLanguage)} component={ReferralCommissionScreen} currentLanguage={currentLanguage} />
                    <Route path="**"><Redirect to={buildPath('/trading/', currentLanguage)} /></Route>
                </Switch>
            </div>
        );
    }


    private getLastAction = () => {
        if (localStorage.getItem(STORE_KEY) !== null) {
            return parseInt(localStorage.getItem(STORE_KEY) || '0', 10);
        }
        return 0;
    };

    private setLastAction = (lastAction: number) => {
        localStorage.setItem(STORE_KEY, lastAction.toString());
    };

    private initListener = () => {
        this.reset();
        for (const type of LayoutComponent.eventsListen) {
            document.body.addEventListener(type, this.reset);
        }
    };

    private reset = () => {
        this.setLastAction(Date.now());
    };

    private initInterval = () => {
        this.timer = setInterval(() => {
            this.check();
        }, CHECK_INTERVAL);
    };

    private check = () => {
        const { user } = this.props;
        const now = Date.now();
        const timeleft = this.getLastAction() + parseFloat(minutesUntilAutoLogout()) * 60 * 1000;
        const diff = timeleft - now;
        const isTimeout = diff < 0;
        if (isTimeout && user.email) {
            localStorage.removeItem('uil');
            this.props.logout();
        }
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    colorTheme: selectCurrentColorTheme(state),
    currentLanguage: selectCurrentLanguage(state),
    currentMarket: selectCurrentMarket(state),
    user: selectUserInfo(state),
    isLoggedIn: selectUserLoggedIn(state),
    userLoading: selectUserFetching(state),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
    logout: () => dispatch(logoutFetch()),
    userFetch: () => dispatch(userFetch()),
    walletsReset: () => dispatch(walletsReset()),
});

// tslint:disable no-any
const Layout = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps,
)(LayoutComponent) as any) as any;

export { Layout };
