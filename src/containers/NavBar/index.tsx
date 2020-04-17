import {History} from 'history';
import * as React from 'react';
import {FormattedMessage} from 'react-intl';
import {connect, MapDispatchToPropsFunction, MapStateToProps} from 'react-redux';
import {Link, RouteProps, withRouter} from 'react-router-dom';
// import { LogoutIcon } from '../../assets/images/LogoutIcon';
// import { Moon } from '../../assets/images/Moon';
// import { Sun } from '../../assets/images/Sun';
import logo = require('../../assets/images/logo.svg');
import {
    AEDIcon,
    CNYIcon,
    DownloadIcon,
    EURIcon,
    LeftMenuIcon,
    OpenUserMenu,
    RightMenuIcon,
    RUBIcon,
    USDIcon,
    UserIcon,
} from '../../assets/images/NavBarIcons';
import {coinOption, earnOption, ordersOption, tradeOption, userOption} from '../../constants';
import {buildPath} from '../../custom/helpers';
import {
    changeColorTheme,
    changeLanguage,
    getBalanceFetch,
    logoutFetch,
    Market,
    openGuardModal,
    RootState,
    selectAppVersion,
    selectCurrentColorTheme,
    selectCurrentLanguage,
    selectCurrentMarket,
    selectUserInfo,
    selectUserLoggedIn,
    User,
    walletsReset,
} from '../../modules';

export interface ReduxProps {
    colorTheme: string;
    currentMarket: Market | undefined;
    address: string;
    isLoggedIn: boolean;
    lang: string;
    success?: boolean;
    user: User;
    version: string;
    currentLanguage: string;
}

interface DispatchProps {
    changeColorTheme: typeof changeColorTheme;
    changeLanguage: typeof changeLanguage;
    logout: typeof logoutFetch;
    walletsReset: typeof walletsReset;
    openGuardModal: typeof openGuardModal;
    getBalanceFetch: typeof getBalanceFetch;
}

export interface OwnProps {
    onLinkChange?: () => void;
    history: History;
}

type NavbarProps = OwnProps & ReduxProps & RouteProps & DispatchProps;

interface NavbarState {
    isOpen: boolean;
    isOpenLanguage: boolean;
    openMenuType: string;
    openMobileMenu: string;
    email: string;
    message: string;
    name: string;
    recaptchaResponse: string;
    errorModal: boolean;
}

// tslint:disable:jsx-no-lambda
class NavBarComponent extends React.Component<NavbarProps, NavbarState> {
    public readonly state = {
        isOpen: false,
        isOpenLanguage: false,
        openMenuType: '',
        openMobileMenu: '',
        email: '',
        name: '',
        message: '',
        recaptchaResponse: '',
        errorModal: false,
    };
    public componentDidMount(): void {
        this.props.getBalanceFetch(['btc', 'usd']);
    }

    private openDropdown = (type: string) => {
        const {openMenuType} = this.state;
        this.setState({openMenuType: openMenuType === type ? '' : type});
    };

    private openMobileMenu = (type: string) => {
        const {openMobileMenu} = this.state;
        this.setState({openMobileMenu: openMobileMenu === type ? '' : type});
    };

    //tslint:disable
    public render() {
        const {
            // colorTheme,
            lang,
            currentLanguage,
            // location,
            isLoggedIn,
            user,
        } = this.props;
        const baseURL = window.document.location.origin;
        const {openMenuType, openMobileMenu} = this.state;
        return (
            <div className={'pg-navbar'}>
                <a href={currentLanguage === 'en' ? baseURL : `${baseURL}/${currentLanguage}`} className="pg-navbar__logo">
                    <span>
                        <img src={logo} className="pg-logo__img" alt="Logo" />
                    </span>
                </a>
                <ul className="pg-navbar__content">
                    <span className="pg-navbar__mobile-icon pg-navbar__left-icon" onClick={() => this.openMobileMenu('left')}>
                        <LeftMenuIcon />
                    </span>
                    <div className={`pg-navbar__mobile-menu${openMobileMenu === 'left' ? ' pg-navbar__mobile-open' : ''}`}>
                        <div className="item">
                            <a href={`${baseURL}/markets`}>
                                <FormattedMessage id={'page.body.trade.header.markets'} />
                            </a>
                        </div>
                        {this.renderBuyWithCard()}
                        {this.renderTrade()}
                        {this.renderEarn()}
                    </div>
                </ul>
                <div className={"pg-navbar__right"}>
                    <span className="pg-navbar__mobile-icon pg-navbar__right-icon" onClick={() => this.openMobileMenu('right')}>
                        <RightMenuIcon />
                    </span>
                    <div className={`pg-navbar__mobile-menu${openMobileMenu === 'right' ? ' pg-navbar__mobile-open' : ''}`}>
                        {isLoggedIn
                            ? <React.Fragment>
                                {this.renderOrders()}
                                {this.renderAssets(user.balance, user.cryptoCurrency, user.activeCurrency)}
                                {this.renderUserBlock()}
                            </React.Fragment>
                            : <React.Fragment>
                                <div className="log-btn">
                                    <a href={`${baseURL}/signin`}>
                                        <FormattedMessage id={'page.header.navbar.signIn'} />
                                    </a>
                                </div>
                                <div className="log-btn sign-up">
                                    <a href={`${baseURL}/signup`}>
                                        <FormattedMessage id={'page.header.signUp'} />
                                    </a>
                                </div>
                            </React.Fragment>
                        }
                        <div className="download">
                            {openMobileMenu === 'right' ? <FormattedMessage id={'page.header.navbar.download_mobile'} /> : <FormattedMessage id={'page.header.navbar.download'} />}
                            <span className="icon">
                                <DownloadIcon />
                            </span>
                        </div>
                        <div className="dropdown-block language" onClick={() => this.openDropdown('language')}>
                            <div className={`desktop-switcher-button${openMenuType === 'language' ? ' active-menu' : ''}`} onClick={() => this.toggleLanguageMenu()}>
                                <div>
                                    <span className="current-language">{
                                        lang === 'zh' ? '中文简体' :
                                            lang === 'en' ? 'English' : 'Русский'}</span>
                                    <span className="slash">/</span>
                                    <span className="current-currency">
                                        {user.activeCurrency}
                                    </span>
                                </div>
                                <span className="icon">
                                    <OpenUserMenu/>
                                </span>
                            </div>
                            { openMenuType === 'language' && <div className={`dropdown-menu language-menu`}>
                                <div className="left">
                                    <div className="header"> <FormattedMessage id={'nav_language'} /></div>
                                    <ul>
                                        <li className={`${lang === 'en' ? 'active-menu' : ''}`} onClick={() => this.handleChangeLanguage('en')}>
                                            <FormattedMessage id={'page.header.language.en'}/>
                                        </li>
                                        <li className={`${lang === 'ru' ? 'active-menu' : ''}`} onClick={() => this.handleChangeLanguage('ru')}>
                                            <FormattedMessage id={'page.header.language.ru'}/>
                                        </li>
                                        <li className={`${lang === 'zh' ? 'active-menu' : ''}`} onClick={() => this.handleChangeLanguage('zh')}>
                                            <FormattedMessage id={'page.header.language.zh'}/>
                                        </li>
                                        <li className={`${lang === 'ae' ? 'active-menu' : ''}`} onClick={() => this.handleChangeLanguage('ea')}>
                                            <FormattedMessage id={'page.header.language.ae'}/>
                                        </li>
                                    </ul>
                                </div>
                                <div className="right">
                                    <div className="header"> <FormattedMessage id={'nav_currency'} /></div>
                                    <ul>
                                        <li className={`${user.activeCurrency.toLowerCase() === 'usd' ? 'active-menu' : ''}`} onClick={() => this.switchCurrency('usd')}>
                                            <span className="icon">
                                                <USDIcon/>
                                            </span>
                                            <FormattedMessage id={'page.header.currency.usd'}/>
                                        </li>
                                        <li className={`${user.activeCurrency.toLowerCase() === 'eur' ? 'active-menu' : ''}`} onClick={() => this.switchCurrency('eur')}>
                                            <span className="icon">
                                                <EURIcon/>
                                            </span>
                                            <FormattedMessage id={'page.header.currency.eur'}/>
                                        </li>
                                        <li className={`${user.activeCurrency.toLowerCase() === 'rub' ? 'active-menu' : ''}`} onClick={() => this.switchCurrency('rub')}>
                                            <span className="icon">
                                                <RUBIcon/>
                                            </span>
                                            <FormattedMessage id={'page.header.currency.rub'}/>
                                        </li>
                                        <li className={`${user.activeCurrency.toLowerCase() === 'cny' ? 'active-menu' : ''}`} onClick={() => this.switchCurrency('cny')}>
                                            <span className="icon">
                                                <CNYIcon/>
                                            </span>
                                            <FormattedMessage id={'page.header.currency.cny'}/>
                                        </li>
                                        <li className={`${user.activeCurrency.toLowerCase() === 'aed' ? 'active-menu' : ''}`} onClick={() => this.switchCurrency('aed')}>
                                            <span className="icon">
                                                <AEDIcon/>
                                            </span>
                                            <FormattedMessage id={'page.header.currency.aed'}/>
                                        </li>
                                    </ul>
                                </div>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private switchCurrency = (type) => {
        this.props.getBalanceFetch(['btc', type]);
    };

    // private getLightDarkMode = () => {
    //     const { colorTheme } = this.props;

    //     if (colorTheme === 'basic') {
    //         return (
    //             <React.Fragment>
    //                 <div className="switcher-item">
    //                     <Sun fillColor={colors.light.navbar.sun}/>
    //                 </div>
    //                 <div className="switcher-item switcher-item--active">
    //                     <Moon fillColor={colors.light.navbar.moon}/>
    //                 </div>
    //             </React.Fragment>
    //         );
    //     }

    //     return (
    //         <React.Fragment>
    //             <div className="switcher-item switcher-item--active">
    //                 <Sun fillColor={colors.basic.navbar.sun}/>
    //             </div>
    //             <div className="switcher-item">
    //                 <Moon fillColor={colors.basic.navbar.moon}/>
    //             </div>
    //         </React.Fragment>
    //     );
    // };

    private renderBuyWithCard = () => {
        const options = coinOption();
        const {openMenuType, openMobileMenu} = this.state;
        const isMobileOpen = openMenuType === 'buyWithCard' && openMobileMenu === 'left';

        return (<div className={`dropdown-block${isMobileOpen ? ' mobile-background' : ''}`}>
            <div className={`desktop-switcher-button${openMenuType === 'buyWithCard' ? ' active-menu' : ''}`} onClick={() => this.openDropdown('buyWithCard')}>
                <FormattedMessage id={'page.header.navbar.buy_credit_card'}/>
                <span className="icon">
                    <OpenUserMenu/>
                </span>
            </div>
            {openMenuType === 'buyWithCard' && this.renderDropdownMenu(options, true)}
        </div>);
    };

    private renderTrade = () => {
        const options = tradeOption();
        const {openMenuType, openMobileMenu} = this.state;
        const isMobileOpen = openMenuType === 'trade' && openMobileMenu === 'left';

        return (<div className={`dropdown-block${isMobileOpen ? ' mobile-background' : ''}`}>
            <div className={`desktop-switcher-button${openMenuType === 'trade' ? ' active-menu' : ''}`} onClick={() => this.openDropdown('trade')}>
                <FormattedMessage id={'page.header.navbar.trade'}/>
                <span className="icon">
                    <OpenUserMenu/>
                </span>
            </div>
            {openMenuType === 'trade' && this.renderDropdownMenu(options, false)}
        </div>);
    };

    private renderEarn = () => {
        const options = earnOption();
        const {openMenuType, openMobileMenu} = this.state;
        const isMobileOpen = openMenuType === 'earn' && openMobileMenu === 'left';

        return (<div className={`dropdown-block${isMobileOpen ? ' mobile-background' : ''}`}>
            <div className={`desktop-switcher-button${openMenuType === 'earn' ? ' active-menu' : ''}`} onClick={() => this.openDropdown('earn')}>
                <FormattedMessage id={'page.header.navbar.earn'}/>
                <span className="icon">
                    <OpenUserMenu/>
                </span>
            </div>
            {openMenuType === 'earn' && this.renderDropdownMenu(options, false)}
        </div>);
    };

    private renderDropdownMenu = (options, isMainSite) => {
        const path = window.document.location.origin;
        const { currentLanguage } = this.props;
        return (<ul className={`dropdown-menu`}>
            {options.map(option => (
                <li className={`${option.border ? 'border' : ''}`}>
                    {!option.logout
                        ?
                        !isMainSite
                            ? <Link to={`${option.href}`}>
                                {option.label && <div className="label">
                                    <FormattedMessage id={option.label}/>
                                </div>}
                                {option.description && <div className="description">
                                    <FormattedMessage id={option.description}/>
                                </div>}
                            </Link>
                            : <a href={`${path}${currentLanguage === 'en' ? '' : `/${currentLanguage}`}${option.href}`}>
                                {option.label && <div className="label">
                                    <FormattedMessage id={option.label}/>
                                </div>}
                                {option.description && <div className="description">
                                    <FormattedMessage id={option.description}/>
                                </div>}
                            </a>
                        :  <div className="label" onClick={() => this.handleLogOut()}>
                                <FormattedMessage id={option.label}/>
                        </div>}
                </li>
            ))}
        </ul>);
    };
    private renderUserBlock = () => {
        const options = userOption();
        const { openMenuType, openMobileMenu } = this.state;
        const isMobileOpen = openMobileMenu === 'right';

        return (<div className="dropdown-block user">
            <div className={`desktop-switcher-button${openMenuType === 'orders' ? ' active-menu' : ''}`} onClick={() => this.openDropdown('user')}>
                {!isMobileOpen && <span className="icon">
                    <UserIcon />
                </span> }
            </div>
            {(openMenuType === 'user' || isMobileOpen) && this.renderDropdownMenu(options, false)}

        </div>)
    };
    private renderOrders = () => {
        const options = ordersOption();
        const { openMenuType, openMobileMenu } = this.state;
        const isMobileOpen = openMenuType === 'orders' && openMobileMenu === 'right';

        return (<div className={`dropdown-block${isMobileOpen ? ' mobile-background' : ''} orders`}>
            <div className={`desktop-switcher-button${openMenuType === 'orders' ? ' active-menu' : ''}`} onClick={() => this.openDropdown('orders')}>
                <FormattedMessage id={'page.header.orders'}/>
                <span className="icon">
                    <OpenUserMenu/>
                </span>
            </div>
            {openMenuType === 'orders' && this.renderDropdownMenu(options, false)}

        </div>)
    };
    private renderAssets = (balance, crypto, currency) => {
        const { openMenuType, openMobileMenu } = this.state;
        const isMobileOpen = openMenuType === 'assets' && openMobileMenu === 'right';

        return (<div className={`dropdown-block${isMobileOpen ? ' mobile-background' : '' } assets`}>
            <div className={`desktop-switcher-button${openMenuType === 'assets' ? ' active-menu' : ''}`} onClick={() => this.openDropdown('assets')}>
                <FormattedMessage id={'page.header.assets'}/>
                <span className="icon">
                    <OpenUserMenu/>
                </span>
            </div>
            {openMenuType === 'assets' && <ul className={`dropdown-menu assets-menu`}>
                <li className="assets">
                    <div className="header">
                        <FormattedMessage id={'page.header.current_balance'}/>
                    </div>
                    <div className="balance">
                        <span className="currency left-cur">{balance[crypto.toUpperCase()].toFixed(2)}</span>
                        <span className="type-currency">{crypto.toUpperCase()}</span>
                        <span className="sym">≈</span>
                        <span className="currency right-cur">{balance[currency.toUpperCase()].toFixed(2)}</span>
                        <span className="type-currency">{currency.toUpperCase()}</span>
                    </div>
                </li>
                <li>
                    <Link to={'/wallets'}>
                        <FormattedMessage id={'page.header.deposit_withdraw'}/>
                    </Link>
                </li>
                <li>
                    <Link to={'/buycrypto'}>
                        <FormattedMessage id={'page.header.buy_crypto'}/>
                    </Link>
                </li>
            </ul>}

        </div>)
    };


    // private handleChangeCurrentStyleMode = (value: string) => {
    //     if (this.props.version === 'Lite') {
    //         this.props.openGuardModal();
    //     } else {
    //         this.props.changeColorTheme(value);
    //     }
    // };

    // private handleRouteChange = (to: string) => () => {
    //     this.setState({isOpen: false}, () => {
    //         this.props.history.push(to);
    //     });
    // };
    //
    private handleLogOut = () => {
        localStorage.removeItem('uil');
        localStorage.removeItem('refCode');
        localStorage.removeItem('usedCoins');
        this.setState(
            {
                isOpen: false,
            },
            () => {
                this.props.logout();
            }
        );
    };

    private closeMenu = () => {
        this.setState(
            {
                isOpen: false,
            },
            () => {
                document.removeEventListener('click', this.closeMenu);
            }
        );
    };

    private toggleLanguageMenu = () => {
        this.setState(
            {
                isOpenLanguage: !this.state.isOpenLanguage,
            },
            () => {
                if (this.state.isOpenLanguage) {
                    document.addEventListener('click', this.closeLanguageMenu);
                } else {
                    document.removeEventListener('click', this.closeLanguageMenu);
                }
            }
        );
    };

    private closeLanguageMenu = () => {
        this.setState(
            {
                isOpenLanguage: false,
            },
            () => {
                document.removeEventListener('click', this.closeLanguageMenu);
            }
        );
    };

    private handleChangeLanguage = (language: string) => {
        const lang = this.props.currentLanguage;
        const l = language === 'cn' ? 'zh' : language;
        this.props.changeLanguage(l);
        let location = '';
        if (lang === 'en') {
            location = this.props.history.location.pathname;
        } else {
            location = this.props.history.location.pathname.slice(l.length + 1);
        }
        this.props.history.push(buildPath(location, l));
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = (state: RootState): ReduxProps => ({
    colorTheme: selectCurrentColorTheme(state),
    currentMarket: selectCurrentMarket(state),
    address: '',
    lang: selectCurrentLanguage(state),
    user: selectUserInfo(state),
    isLoggedIn: selectUserLoggedIn(state),
    version: selectAppVersion(state),
    currentLanguage: selectCurrentLanguage(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    changeColorTheme: payload => dispatch(changeColorTheme(payload)),
    changeLanguage: payload => dispatch(changeLanguage(payload)),
    getBalanceFetch: payload => dispatch(getBalanceFetch(payload)),
    logout: () => dispatch(logoutFetch()),
    walletsReset: () => dispatch(walletsReset()),
    openGuardModal: () => dispatch(openGuardModal()),
});
// tslint:disable no-any
const NavBar = withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBarComponent) as any) as any;

export {NavBar};
