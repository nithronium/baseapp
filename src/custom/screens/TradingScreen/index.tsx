// import { Decimal } from '@openware/components';
import * as React from 'react';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Grid } from '../../../components/Grid';
import { ToolBar, TradingChart, WalletsFetch } from '../../../containers';
import { OrderComponent } from '../../../containers/Order';
import { OpenOrdersPanel, OrderBook } from '../../containers';

import { Helmet } from 'react-helmet';

import { getUrlPart, setDocumentTitle } from '../../../helpers';
import {
    RootState,
    selectCurrentLanguage,
    selectCurrentMarket,
    selectMarketTickers,
    selectUserInfo,
    selectUserLoggedIn,
    setCurrentMarket,
    setCurrentPrice,
    Ticker,
    User,
} from '../../../modules';
import { GridLayoutState, saveLayouts, selectGridLayoutState } from '../../../modules/public/gridLayout';
import { Market, marketsFetch, selectMarkets } from '../../../modules/public/markets';
import { depthFetch } from '../../../modules/public/orderBook';
import { rangerConnectFetch, RangerConnectFetch } from '../../../modules/public/ranger';
import { RangerState } from '../../../modules/public/ranger/reducer';
import { selectRanger } from '../../../modules/public/ranger/selectors';
import { selectWallets, Wallet, walletsFetch } from '../../../modules/user/wallets';
// import { OpenOrdersPanel, OrderBook, OrderComponent } from '../../containers';
import { buildPath } from '../../helpers';

const breakpoints = {
    lg: 1200,
    md: 996,
    sm: 768,
    xs: 480,
    xxs: 0,
};

const cols = {
    lg: 24,
    md: 24,
    sm: 12,
    xs: 12,
    xxs: 12,
};

interface ReduxProps {
    currentLanguage: string;
    currentMarket: Market | undefined;
    markets: Market[];
    wallets: Wallet[];
    user: User;
    rangerState: RangerState;
    userLoggedIn: boolean;
    rgl: GridLayoutState;
    tickers: {
        [pair: string]: Ticker;
    };
}

interface DispatchProps {
    depthFetch: typeof depthFetch;
    marketsFetch: typeof marketsFetch;
    accountWallets: typeof walletsFetch;
    rangerConnect: typeof rangerConnectFetch;
    setCurrentPrice: typeof setCurrentPrice;
    setCurrentMarket: typeof setCurrentMarket;
    saveLayouts: typeof saveLayouts;
}

interface StateProps {
    orderComponentResized: number;
}

type Props = DispatchProps & ReduxProps & RouteComponentProps;

// tslint:disable:jsx-no-lambda
class Trading extends React.Component<Props, StateProps> {
    public  state = {
        orderComponentResized: 10,
        marketId: '',
    };

    private gridItems = [
        {
            i: 1,
            render: () => <OrderComponent size={this.state.orderComponentResized} />,
        },
        {
            i: 2,
            render: () => <TradingChart />,
        },
        {
            i: 3,
            render: () => <OrderBook />,
        },
        {
            i: 4,
            render: () => <OpenOrdersPanel />,
        },
    ];

    private pageTitles = {
         'BTC/USDT': { title: 'BTC to USDT. Bitcoin Exchange | Emirex.com', description: 'BTC to USDT Exchange and converter BTC/USDT. Real-time prices and charts. 24/7 global customer support. You can buy & sell using up to date Bitcoin exchange rates' } ,
         'ETH/USDT': { title: 'ETH to USDT. Ethereum Exchange | Emirex.com', description: 'ETH to USDT Exchange and converter ETH/USDT. Real-time prices and charts. 24/7 global customer support. You can buy & sell using up to date exchange rates' } ,
         'ETH/BTC': { title: 'ETH to BTC. Price Ethereum Bitcoin | Emirex.com', description: 'ETH to BTC Exchange and converter BTC/ETH. Real-time prices and charts. 24/7 global customer support. You can buy & sell using up to date exchange rates' } ,
         'EMRX/BTC': { title: 'EMRX to BTC. EMRX Exchange | Emirex.com', description: 'EMRX to BTC Exchange and converter Emirex Token (EMRX) in Bitcoin. Real-time prices and charts. 24/7 support. You can buy & sell using up to date exchange rates' } ,
         'LTC/BTC': { title: 'LTC to BTC Converter | Price | Emirex.com', description: 'LTC to BTC Exchange. Real-time prices and charts. Converter Litecoin (LTC) in Bitcoin (BTC). 24/7 support. You can buy & sell using up to date exchange rates' } ,
         'BCH/BTC': { title: 'BCH to BTC. Bitcoin Cash Exchange | Emirex.com', description: 'BCH to BTC Exchange. Real-time prices and charts. Converter Bitcoin Cash in Bitcoin (BTC). 24/7 support. You can buy & sell using up to date exchange rates' } ,
    };

    public componentDidMount() {
        setDocumentTitle('Trading');
        const {
            currentLanguage,
            currentMarket,
            markets,
            rangerState: { connected },
            userLoggedIn,
            wallets,
        } = this.props;

        if (markets.length < 1) {
            this.props.marketsFetch();
        }
        if (!wallets || wallets.length === 0) {
            this.props.accountWallets();
        }
        if (currentMarket) {
            this.props.depthFetch(currentMarket);
        }
        if (!connected) {
            this.props.rangerConnect({ withAuth: userLoggedIn });
        }
        if (!userLoggedIn && currentMarket) {
            this.props.history.replace(buildPath(`/trading/${currentMarket.id}`, currentLanguage));
        }
    }

    public componentWillUnmount() {
        this.props.setCurrentPrice(undefined);
    }

    public componentWillReceiveProps(nextProps) {
        const {
            currentLanguage,
            currentMarket,
            history,
            markets,
            userLoggedIn,
        } = this.props;

        if (userLoggedIn !== nextProps.userLoggedIn) {
            this.props.rangerConnect({ withAuth: nextProps.userLoggedIn });
        }

        if (markets.length !== nextProps.markets.length) {
            this.setMarketFromUrlIfExists(nextProps.markets);
        }

        if (nextProps.currentMarket && currentMarket !== nextProps.currentMarket) {
            history.replace(buildPath(`/trading/${nextProps.currentMarket.id}`, currentLanguage));
            this.props.depthFetch(nextProps.currentMarket);
        }

        // if (nextProps.currentMarket && nextProps.tickers) {
        //     this.setTradingTitle(nextProps.currentMarket, nextProps.tickers);
        // }
    }

    public render() {
        const rowHeight = 14;
        const allGridItems = [...this.gridItems];
        const { rgl, userLoggedIn, currentMarket } = this.props;

        return (
            <div className={'pg-trading-screen'}>
                <div className={'pg-trading-wrap'}>
                    {this.setPageTitle(currentMarket)}
                    <ToolBar />
                    <Grid
                        breakpoints={breakpoints}
                        className="layout"
                        children={allGridItems}
                        cols={cols}
                        draggableHandle=".cr-table-header__content, .pg-trading-screen__tab-panel, .draggable-container"
                        layouts={rgl.layouts}
                        rowHeight={rowHeight}
                        // tslint:disable-next-line: jsx-no-multiline-js
                        onLayoutChange={() => {
                            return;
                        }}
                        handleResize={this.handleResize}
                    />
                    {userLoggedIn && <WalletsFetch />}
                </div>
            </div>
        );
    }

    private setMarketFromUrlIfExists = (markets: Market[]): void => {
        const urlMarket: string = getUrlPart(3, window.location.pathname);
        const market: Market | undefined = markets.find(item => item.id === urlMarket);

        if (market) {
            this.props.setCurrentMarket(market);
        }
    };

    private setPageTitle = (market?: Market) => {
        let marketName = 'ETH/USDT';
        if (market) {
            marketName = market.name;
        }
        if (this.pageTitles[marketName]) {
            const title = this.pageTitles[`${marketName}`].title;

            const description = this.pageTitles[marketName].description;
            const link = `https://emirex.com/trading/${marketName.replace('/','').toLowerCase()}`;
            return (
                <Helmet>
                    <link rel="canonical" href={link}/>
                    <title>{title}</title>
                    <meta name="description" content={description} />
                </Helmet>
            );
        } else {
            return (
                <Helmet>
                    <title>Trading</title>
                </Helmet>
            );
        }

    }

    // private setTradingTitle = (market: Market, tickers: ReduxProps['tickers']) => {
    //     const tickerPrice = tickers[market.id] ? tickers[market.id].last : '0.0';
    //     document.title = `${Decimal.format(tickerPrice, market.price_precision)} ${market.name}`;
    // };

    private handleResize = (layout, oldItem, newItem) => {
        switch (oldItem.i) {
            case '1':
                this.setState({
                    orderComponentResized: newItem.w,
                });
                break;
            default:
                break;
        }
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    currentLanguage: selectCurrentLanguage(state),
    currentMarket: selectCurrentMarket(state),
    markets: selectMarkets(state),
    wallets: selectWallets(state),
    user: selectUserInfo(state),
    rangerState: selectRanger(state),
    userLoggedIn: selectUserLoggedIn(state),
    rgl: selectGridLayoutState(state),
    tickers: selectMarketTickers(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    marketsFetch: () => dispatch(marketsFetch()),
    depthFetch: payload => dispatch(depthFetch(payload)),
    accountWallets: () => dispatch(walletsFetch()),
    rangerConnect: (payload: RangerConnectFetch['payload']) => dispatch(rangerConnectFetch(payload)),
    setCurrentPrice: payload => dispatch(setCurrentPrice(payload)),
    setCurrentMarket: payload => dispatch(setCurrentMarket(payload)),
    saveLayouts: payload => dispatch(saveLayouts(payload)),
});

const TradingScreen = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps,
    // tslint:disable-next-line: no-any
)(Trading) as any);

export { TradingScreen };
