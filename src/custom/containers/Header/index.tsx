import * as React from 'react';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { NavBar } from '../../../containers';
import {
    Market,
    RootState,
    selectCurrentColorTheme,
    selectCurrentLanguage,
    selectCurrentMarket,
    selectMarketSelectorState,
    selectMobileWalletUi,
    selectSidebarState,
    setMobileWalletUi,
    toggleMarketSelector,
    toggleSidebar,
} from '../../../modules';


interface ReduxProps {
    currentMarket: Market | undefined;
    colorTheme: string;
    currentLanguage: string;
    mobileWallet: string;
    sidebarOpened: boolean;
    marketSelectorOpened: boolean;
}

interface DispatchProps {
    setMobileWalletUi: typeof setMobileWalletUi;
    toggleSidebar: typeof toggleSidebar;
    toggleMarketSelector: typeof toggleMarketSelector;
}

// tslint:disable no-any jsx-no-multiline-js
class Head extends React.Component<any> {
    public render() {
        const {
            location,
            mobileWallet,
        } = this.props;
        const tradingCls = window.location.pathname.includes('/trading') ? 'pg-container-trading' : '';

        return (
            <React.Fragment>
            {!['/confirm'].some(r => location.pathname.includes(r)) &&
                <header className={`pg-header`}>
                    <div className={`pg-container pg-header__content ${tradingCls}`}>
                        <div className="pg-header__location">
                            {mobileWallet ? <span>{mobileWallet}</span> : <span>{location.pathname.split('/')[1]}</span>}
                        </div>
                        {this.renderMobileWalletNav()}
                        <div className="pg-header__navbar">
                            <NavBar onLinkChange={this.closeMenu}/>
                        </div>
                    </div>
                </header>}
          </React.Fragment>
        );
    }

    public renderMobileWalletNav = () => {
        const { colorTheme, mobileWallet } = this.props;
        const isLight = colorTheme === 'light' ? 'Light' : '';

        return mobileWallet && (
            <div onClick={this.backWallets} className="pg-header__toggler">
                <img src={require(`./back${isLight}.svg`)} />
            </div>
        );
    };

    public translate = (id: string) => {
        return id ? this.props.intl.formatMessage({ id }) : '';
    };

    private backWallets = () => this.props.setMobileWalletUi('');

    private closeMenu = (e: any) => this.props.setMobileWalletUi('');
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    currentMarket: selectCurrentMarket(state),
    colorTheme: selectCurrentColorTheme(state),
    currentLanguage: selectCurrentLanguage(state),
    mobileWallet: selectMobileWalletUi(state),
    sidebarOpened: selectSidebarState(state),
    marketSelectorOpened: selectMarketSelectorState(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        setMobileWalletUi: payload => dispatch(setMobileWalletUi(payload)),
        toggleSidebar: payload => dispatch(toggleSidebar(payload)),
        toggleMarketSelector: () => dispatch(toggleMarketSelector()),
    });

const Header = injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(Head) as any) as any);

export {
    Header,
};
