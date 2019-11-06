import { Loader } from '@openware/components';
import { History } from 'history';
import * as React from 'react';
import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Route, Switch } from 'react-router';
import { Redirect, withRouter } from 'react-router-dom';
import { minutesUntilAutoLogout } from '../../api';
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
            <Redirect to={'/signin'} />
        </Route>
    );
};

//tslint:disable-next-line no-any
const PublicRoute: React.FunctionComponent<any> = ({ component: CustomComponent, loading, isLogged, ...rest }) => {
    if (loading) {
        return renderLoader();
    }

    if (isLogged) {
        return (
            <Route {...rest}>
                <Redirect to={'/wallets'} />
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
        const { isLoggedIn, history } = this.props;
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
                history.push('/trading/');
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

    public render() {
        const { colorTheme, isLoggedIn, userLoading } = this.props;

        toggleColorTheme(colorTheme);

        return (
            <div className="container-fluid pg-layout">
                <Switch>
                    <PublicRoute loading={userLoading} isLogged={isLoggedIn} path="/signin" component={SignInScreen} />
                    <PublicRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/accounts/confirmation"
                        component={VerificationScreen}
                    />
                    <PublicRoute loading={userLoading} isLogged={isLoggedIn} path="/signup" component={SignUpScreen} />
                    <PublicRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/forgot_password"
                        component={ForgotPasswordScreen}
                    />
                    <PublicRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/accounts/password_reset"
                        component={ChangeForgottenPasswordScreen}
                    />
                    <PublicRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/email-verification"
                        component={EmailVerificationScreen}
                    />
                    <Route loading={userLoading} isLogged={isLoggedIn} path="/referral" component={ReferralScreen} />
                    <Route loading={userLoading} isLogged={isLoggedIn} path="/en/referral" component={ReferralScreen} />
                    <Route exact={true} path="/trading/:market?" component={TradingScreen} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/orders" component={OrdersTabScreen} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/history" component={HistoryScreen} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/confirm" component={ConfirmScreen} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/profile" component={ProfileScreen} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/wallets" component={WalletsScreen} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/security/2fa" component={ProfileTwoFactorAuthScreen} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/referral-tickets" component={ReferralTicketsScreen} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/referral-commission" component={ReferralCommissionScreen} />
                    <Route path="**"><Redirect to="/trading/" /></Route>
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
