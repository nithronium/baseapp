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

import { InjectedIntlProps, injectIntl } from 'react-intl';

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

type Props = DispatchProps & ReduxProps & RouteComponentProps & InjectedIntlProps;

// tslint:disable:jsx-no-lambda
class Trading extends React.Component<Props, StateProps> {
    public state = {
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
        'BCH/BTC': { title: 'bchbtc_title', description: 'bchbtc_description' },
        'BTC/USD': { title: 'btcusd_title', description: 'btcusd_description' },
        'BTC/USDT': { title: 'btcusdt_title', description: 'btcusdt_description' },
        'EMRX/BTC': { title: 'emrxbtc_title', description: 'emrxbtc_description' },
        'ETH/BTC': { title: 'ethbtc_title', description: 'ethbtc_description' },
        'ETH/USD': { title: 'ethusd_title', description: 'ethusd_description' },
        'ETH/USDT': { title: 'ethusdt_title', description: 'ethusdt_description' },
        'LTC/BTC': { title: 'ltcbtc_title', description: 'ltcbtc_description' },
        'T69/EUR': { title: 't69eur_title', description: 't69eur_description' },
        'T69/USDT': { title: 't69usdt_title', description: 't69usdt_description' },
        'USD/EUR': { title: 'usdeur_title', description: 'usdeur_description' },
        'USDT/USD': { title: 'usdtusd_title', description: 'usdtusd_description' },
        'BTC/AED': { title: 'btcaed_title', description: 'btcaed_description' },
        'ETH/AED': { title: 'ethaed_title', description: 'ethaed_description' },
        'USDT/AED': { title: 'usdtaed_title', description: 'usdtaed_description' },
        'BTC/EUR': { title: 'btceur_title', description: 'btceur_description' },
        'ETH/EUR': { title: 'etheur_title', description: 'etheur_description' },
        'BCH/USDT': { title: 'bchusdt_title', description: 'bchusdt_description' },
        'USDT/EUR': { title: 'usdteur_title', description: 'usdteur_description' },
        'USDC/USDT': { title: 'usdcusdt_title', description: 'usdcusdt_description' },
        'BTC/USDC': { title: 'btcusdc_title', description: 'btcusdc_description' },
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
        document.getElementsByTagName('html')[0].lang = this.props.currentLanguage;
        const { currentLanguage, currentMarket, history, markets, userLoggedIn } = this.props;

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
    //tslint:disable
    private setMarketFromUrlIfExists = (markets: Market[]): void => {
        const { currentLanguage } = this.props;
        const urlPart = currentLanguage === 'en' ? 2 : 3;
        const urlMarket: string = getUrlPart(urlPart, window.location.pathname);
        const market: Market | undefined = markets.find(item => item.id === urlMarket);
        if (market) {
            this.props.setCurrentMarket(market);
        }
    };

    private setPageTitle = (market: Market) => {
        const { currentLanguage } = this.props;
        let marketName = market ? market.name : '';
        if (market) {
            const link = `https://emirex.com${
                currentLanguage === 'en' ? '/' : '/' + currentLanguage + '/'
            }trading/${marketName.replace('/', '').toLowerCase()}`;
            const linkEn = `https://emirex.com/trading/${marketName.replace('/', '').toLowerCase()}`;
            const linkRu = `https://emirex.com/ru/trading/${marketName.replace('/', '').toLowerCase()}`;
            const linkZh = `https://emirex.com/zh/trading/${marketName.replace('/', '').toLowerCase()}`;

            if (this.pageTitles[marketName]) {
                // tslint:disable
                const title = this.props.intl.formatMessage({ id: this.pageTitles[`${marketName}`].title });
                const description = this.props.intl.formatMessage({ id: this.pageTitles[marketName].description });
                return (
                    <Helmet>
                        <link rel="canonical" href={link} />
                        <title>{title}</title>
                        <meta name="description" content={description} />
                        <link key="ru" rel="alternate" href={linkRu} hrefLang="ru" title="Русский" />
                        <link key="en" rel="alternate" href={linkEn} hrefLang="en" title="English" />
                        <link key="zh" rel="alternate" href={linkZh} hrefLang="zh" title="中国人" />
                    </Helmet>
                );
            } else {
                return (
                    <Helmet>
                        <link rel="canonical" href={link} />
                        <title>Trading</title>
                        <meta name="description" content={''} />
                        <link key="ru" rel="alternate" href={linkRu} hrefLang="ru" title="Русский" />
                        <link key="en" rel="alternate" href={linkEn} hrefLang="en" title="English" />
                        <link key="zh" rel="alternate" href={linkZh} hrefLang="zh" title="中国人" />
                    </Helmet>
                );
            }
        } else {
            return <Helmet />;
        }
    };

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

const TradingScreen = injectIntl(
    withRouter(
        connect(
            mapStateToProps,
            mapDispatchToProps
            // tslint:disable-next-line: no-any
        )(Trading) as any
    )
);

export { TradingScreen };
