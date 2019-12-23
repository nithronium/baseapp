//tslint:disable
import * as qs from 'qs';
import classnames from 'classnames';
import { Loader } from '@openware/components';
import { History } from 'history';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Route, Switch } from 'react-router';
import { Redirect, withRouter } from 'react-router-dom';
import { minutesUntilAutoLogout } from '../../api';
import {
    BuyWithCreditCardScreen,
    ChatelloScreen,
    ReferralCommissionScreen,
    ReferralScreen,
    ReferralTicketsScreen,
    TradingScreen
} from '../../custom/screens';
import { buildPath, saveParametersFromUrl } from '../../custom/helpers';
import { LoginModal } from '../../custom/components/KYCLoginModal';
import { ConfirmScreen } from '../../custom/screens';
import { toggleColorTheme } from '../../helpers';
import {
    changeLanguage,
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
import { renderPluginsRoutes } from '../../plugins/routes';
import {
    ChangeForgottenPasswordScreen,
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
    PricePackagesScreen
} from '../../screens';
import { ExpiredSessionModal } from '../../components';

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
    changeLanguage: typeof changeLanguage;
}

interface OwnProps {
    history: History<{ fromSignIn }>;
}

interface LayoutState {
    isShownExpSessionModal: boolean;
    diplayKYCLoginModal: boolean;
    prevRouteCheck: boolean;
}

export type LayoutProps = ReduxProps & DispatchProps & OwnProps & InjectedIntlProps;

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
    saveParametersFromUrl(rest.location.search);
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
const PublicRoute: React.FunctionComponent<any> = ({ component: CustomComponent, loading, isLogged, noReditect, ...rest }) => {
    if (loading) {
        return renderLoader();
    }
    saveParametersFromUrl(rest.location.search);

    if (isLogged && !noReditect) {
        let url = '/profile';
        const parsed = qs.parse(window.location.search, { ignoreQueryPrefix: true });
        if (parsed.redirect_url) {
            url = parsed.redirect_url;
        }
        console.log('signin', url, window.location.href);
        if (url === '/') {
            window.location.replace('/');
            return null;
        }
        return (
            <Route {...rest}>
                <Redirect to={buildPath(url, rest.currentLanguage)} />
            </Route>
        );
    }

    const renderCustomerComponent = props => <CustomComponent {...props} />;
    return <Route {...rest} render={renderCustomerComponent} />;
};

class LayoutComponent extends React.Component<LayoutProps, LayoutState> {
    constructor(props: LayoutProps) {
        super(props);
        this.initListener();

        this.state = {
            isShownExpSessionModal: false,
            diplayKYCLoginModal: false,
            prevRouteCheck: false,
        };
    }
    public static eventsListen = [
        'click',
        'keydown',
        'scroll',
        'resize',
        'mousemove',
        'TabSelect',
        'TabHide',
    ];

    public timer;
    public walletsFetchInterval;

    
    //tslint:disable
    public componentDidMount() {
        this.props.userFetch();
        this.initInterval();
        this.check();
        const pathname = this.props.history.location.pathname;
        const search = this.props.history.location.search;
        if (pathname.split('/')[1].length === 2) {
            this.props.changeLanguage(pathname.split('/')[1]);
            this.props.history.replace(`${pathname}${search}`);
        } else {
            this.props.changeLanguage('en');
            this.props.history.replace(`${pathname}${search}`);
        }
    }

    public componentWillReceiveProps(next: LayoutProps) {
        const { history, isLoggedIn } = this.props;

        if (history.location.state && history.location.state.fromSignIn) {
            this.setState({
                prevRouteCheck: true,
            });
        }

        if (!isLoggedIn && next.isLoggedIn && this.state.prevRouteCheck) {
            this.handleOpenLoginModal();
        }
    }

    public componentDidUpdate(next: LayoutProps) {
        const {
            // currentLanguage,
            isLoggedIn,
            // history,
        } = this.props;

        // const base = currentLanguage === 'en' ? '' : `/${currentLanguage}`
        const siteState = localStorage.getItem('uil');

        if (isLoggedIn && !siteState) {
            localStorage.setItem('uil', 'true');
        } else if (isLoggedIn && siteState === 'false') {
            this.props.logout();
        }

        // if (!isLoggedIn && next.isLoggedIn) {
        //     this.props.walletsReset();
        //     if ((!history.location.pathname.includes(`${base}/trading`)) && (!history.location.pathname.includes(`${base}/referral`))) {
        //         history.push(buildPath('/trading/', currentLanguage));
        //     }
        // }
    }
    public componentWillUnmount() {
        for (const type of LayoutComponent.eventsListen) {
            document.body.removeEventListener(type, this.reset);
        }
        clearInterval(this.timer);
        clearInterval(this.walletsFetchInterval);
    }

    public translate = (key: string) => this.props.intl.formatMessage({id: key});

    public render() {
        const {
            colorTheme,
            isLoggedIn,
            userLoading,
            currentLanguage,
            user,
        } = this.props;
        const { isShownExpSessionModal } = this.state;

        const tradingCls = window.location.pathname.includes('/trading') ? 'trading-layout' : '';
        toggleColorTheme(colorTheme);

        const cx = classnames('pg-kyc-login', {
            'pg-kyc-login--visible':
                this.state.diplayKYCLoginModal && !this.props.history.location.pathname.startsWith('/confirm') && user.level === 1,
        });

        return (
            <div className={`container-fluid pg-layout ${tradingCls}`}>
                <Switch>
                    <PublicRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/signin'}
                        component={SignInScreen}
                        currentLanguage={currentLanguage}
                    />
                    <PublicRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/ru/signin'}
                        component={SignInScreen}
                        currentLanguage={currentLanguage}
                    />
                    <PublicRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/accounts/confirmation'}
                        component={VerificationScreen}
                        currentLanguage={currentLanguage}
                    />
                    <PublicRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/ru/accounts/confirmation'}
                        component={VerificationScreen}
                        currentLanguage={currentLanguage}
                    />
                    <PublicRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/signup'}
                        component={SignUpScreen}
                        currentLanguage={currentLanguage}
                    />
                    <PublicRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/ru/signup'}
                        component={SignUpScreen}
                        currentLanguage={currentLanguage}
                    />
                    <PublicRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/forgot_password'}
                        component={ForgotPasswordScreen}
                        currentLanguage={currentLanguage}
                    />
                    <PublicRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/ru/forgot_password'}
                        component={ForgotPasswordScreen}
                        currentLanguage={currentLanguage}
                    />
                    <PublicRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/accounts/password_reset'}
                        component={ChangeForgottenPasswordScreen}
                        currentLanguage={currentLanguage}
                    />
                    <PublicRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/ru/accounts/password_reset'}
                        component={ChangeForgottenPasswordScreen}
                        currentLanguage={currentLanguage}
                    />
                    <PublicRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/email-verification'}
                        component={EmailVerificationScreen}
                        currentLanguage={currentLanguage}
                    />
                    <PublicRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/ru/email-verification'}
                        component={EmailVerificationScreen}
                        currentLanguage={currentLanguage}
                    />
                    {/* <Route loading={userLoading} isLogged={isLoggedIn} path={buildPath('/referral', currentLanguage)} component={ReferralScreen} /> */}
                    <Route exact={true} path={'/ru/referral'} component={ReferralScreen} />
                    <Route exact={true} path={'/referral'} component={ReferralScreen} />
                    <Route exact={true} path={'/trading/:market'} component={TradingScreen} />
                    <Route exact={true} path={'/ru/trading/:market'} component={TradingScreen} />
                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/orders'}
                        component={OrdersTabScreen}
                        currentLanguage={currentLanguage}
                    />
                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/ru/orders'}
                        component={OrdersTabScreen}
                        currentLanguage={currentLanguage}
                    />
                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/history/:history'}
                        component={HistoryScreen}
                        currentLanguage={currentLanguage}
                    />
                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/ru/history/:history'}
                        component={HistoryScreen}
                        currentLanguage={currentLanguage}
                    />
                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/confirm'}
                        component={ConfirmScreen}
                        currentLanguage={currentLanguage}
                    />
                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/ru/confirm'}
                        component={ConfirmScreen}
                        currentLanguage={currentLanguage}
                    />
                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/profile'}
                        component={ProfileScreen}
                        currentLanguage={currentLanguage}
                    />
                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/ru/profile'}
                        component={ProfileScreen}
                        currentLanguage={currentLanguage}
                    />
                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/wallets'}
                        component={WalletsScreen}
                        currentLanguage={currentLanguage}
                    />
                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/ru/wallets'}
                        component={WalletsScreen}
                        currentLanguage={currentLanguage}
                    />
                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/security/2fa'}
                        component={ProfileTwoFactorAuthScreen}
                        currentLanguage={currentLanguage}
                    />
                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/ru/security/2fa'}
                        component={ProfileTwoFactorAuthScreen}
                        currentLanguage={currentLanguage}
                    />
                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/referral-tickets'}
                        component={ReferralTicketsScreen}
                        currentLanguage={currentLanguage}
                    />
                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/ru/referral-tickets'}
                        component={ReferralTicketsScreen}
                        currentLanguage={currentLanguage}
                    />
                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/referral-commission'}
                        component={ReferralCommissionScreen}
                        currentLanguage={currentLanguage}
                    />
                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/ru/referral-commission'}
                        component={ReferralCommissionScreen}
                        currentLanguage={currentLanguage}
                    />
                    <PublicRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        noReditect={true}
                        path={'/buycrypto'}
                        component={BuyWithCreditCardScreen}
                        currentLanguage={currentLanguage}
                    />
                    <PublicRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        noReditect={true}
                        path={'/ru/buycrypto'}
                        component={BuyWithCreditCardScreen}
                        currentLanguage={currentLanguage}
                    />
                    <PublicRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        noReditect={true}
                        path={'/zh/buycrypto'}
                        component={BuyWithCreditCardScreen}
                        currentLanguage={currentLanguage}
                    />

                    <PublicRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/zh/signin'}
                        component={SignInScreen}
                        currentLanguage={currentLanguage}
                    />
                    <PublicRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/zh/accounts/confirmation'}
                        component={VerificationScreen}
                        currentLanguage={currentLanguage}
                    />
                    <PublicRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/zh/signup'}
                        component={SignUpScreen}
                        currentLanguage={currentLanguage}
                    />
                    <PublicRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/zh/forgot_password'}
                        component={ForgotPasswordScreen}
                        currentLanguage={currentLanguage}
                    />
                    <PublicRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/zh/accounts/password_reset'}
                        component={ChangeForgottenPasswordScreen}
                        currentLanguage={currentLanguage}
                    />
                    <PublicRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/zh/email-verification'}
                        component={EmailVerificationScreen}
                        currentLanguage={currentLanguage}
                    />
                    <Route path={'/zh/referral'} component={ReferralScreen} />
                    <Route path={'/zh/trading/:market'} component={TradingScreen} />

                    <PublicRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/chatello'}
                        component={ChatelloScreen}
                        currentLanguage={currentLanguage}
                        exact={true}
                        noReditect={true}
                    />
                    <PublicRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/ru/chatello'}
                        component={ChatelloScreen}
                        currentLanguage={currentLanguage}
                        exact={true}
                        noReditect={true}
                    />
                    <PublicRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/zh/chatello'}
                        component={ChatelloScreen}
                        currentLanguage={currentLanguage}
                        exact={true}
                        noReditect={true}
                    />
                    <PublicRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/tr/chatello'}
                        component={ChatelloScreen}
                        currentLanguage={currentLanguage}
                        exact={true}
                        noReditect={true}
                    />
                    <PublicRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/chatello/:amount'}
                        component={ChatelloScreen}
                        currentLanguage={currentLanguage}
                        noReditect={true}
                    />
                    <PublicRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/ru/chatello/:amount'}
                        component={ChatelloScreen}
                        currentLanguage={currentLanguage}
                        noReditect={true}
                    />
                    <PublicRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/zh/chatello/:amount'}
                        component={ChatelloScreen}
                        currentLanguage={currentLanguage}
                        noReditect={true}
                    />
                    <PublicRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/tr/chatello/:amount'}
                        component={ChatelloScreen}
                        currentLanguage={currentLanguage}
                        noReditect={true}
                    />

                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/zh/orders'}
                        component={OrdersTabScreen}
                        currentLanguage={currentLanguage}
                    />
                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/zh/history/:history'}
                        component={HistoryScreen}
                        currentLanguage={currentLanguage}
                    />
                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/zh/confirm'}
                        component={ConfirmScreen}
                        currentLanguage={currentLanguage}
                    />
                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/zh/profile'}
                        component={ProfileScreen}
                        currentLanguage={currentLanguage}
                    />
                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/zh/wallets'}
                        component={WalletsScreen}
                        currentLanguage={currentLanguage}
                    />
                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/zh/security/2fa'}
                        component={ProfileTwoFactorAuthScreen}
                        currentLanguage={currentLanguage}
                    />
                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/zh/referral-tickets'}
                        component={ReferralTicketsScreen}
                        currentLanguage={currentLanguage}
                    />
                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/zh/referral-commission'}
                        component={ReferralCommissionScreen}
                        currentLanguage={currentLanguage}
                    />
                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/kyc-levels'}
                        component={PricePackagesScreen}
                        currentLanguage={currentLanguage}
                    />
                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/ru/kyc-levels'}
                        component={PricePackagesScreen}
                        currentLanguage={currentLanguage}
                    />
                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path={'/zh/kyc-levels'}
                        component={PricePackagesScreen}
                        currentLanguage={currentLanguage}
                    />

                    ChatelloScreen

                    {renderPluginsRoutes()}
                    {/* <Route path="**"><Redirect to={'/trading/'} /></Route> */}
                    {/* <Route path="**"><Redirect to={'/ru/trading/'} /></Route> */}
                </Switch>
                <LoginModal
                    classname={cx}
                    closeModal={this.handleDisplayModal}
                    userLevel={user.level}
                    history={this.props.history}
                />
                {isShownExpSessionModal && this.handleRenderExpiredSessionModal()}
            </div>
        );
    }

    private handleOpenLoginModal = () => {
        this.setState(
            {
                diplayKYCLoginModal: true,
            },
            () => {
                document.addEventListener('click', this.handleCloseLoginModal);
            }
        );
    };

    private handleCloseLoginModal = () => {
        this.setState(
            {
                diplayKYCLoginModal: false,
                prevRouteCheck: false,
            },
            () => {
                document.removeEventListener('click', this.handleCloseLoginModal);
            }
        );
    };

    private handleDisplayModal = (value: boolean) => {
        this.setState({
            diplayKYCLoginModal: value,
        });
    };

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
            this.handleChangeExpSessionModalState();
            this.props.logout();
        }
    };

    private handleSubmitExpSessionModal = () => {
        const { history } = this.props;
        this.handleChangeExpSessionModalState();
        history.push('/signin');
    };

    private handleRenderExpiredSessionModal = () => (
        <ExpiredSessionModal
            title={this.translate('page.modal.expired.title')}
            buttonLabel={this.translate('page.modal.expired.submit')}
            handleChangeExpSessionModalState={this.handleChangeExpSessionModalState}
            handleSubmitExpSessionModal={this.handleSubmitExpSessionModal}
        />
    );

    private handleChangeExpSessionModalState = () => {
        this.setState({
            isShownExpSessionModal: !this.state.isShownExpSessionModal,
        });
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
    changeLanguage: payload => dispatch(changeLanguage(payload)),
});

// tslint:disable-next-line no-any
const Layout = injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(LayoutComponent) as any) as any);

export { Layout };
