// import { Decimal } from '@openware/components';
import * as React from 'react';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Grid } from '../../../components/Grid';
import { TradingChart, WalletsFetch } from '../../../containers';
import { OrderComponent } from '../../../containers/Order';
import { OpenOrdersPanel, OrderBook, ToolBar } from '../../containers';

import { Helmet } from 'react-helmet';
import { saveParametersFromUrl } from '../../../custom/helpers';

import { getUrlPart } from '../../../helpers';
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
        bchbtc: { title: 'bchbtc_title', description: 'bchbtc_description' },
        btcusd: { title: 'btcusd_title', description: 'btcusd_description' },
        btcusdt: { title: 'btcusdt_title', description: 'btcusdt_description' },
        emrxbtc: { title: 'emrxbtc_title', description: 'emrxbtc_description' },
        ethbtc: { title: 'ethbtc_title', description: 'ethbtc_description' },
        ethusd: { title: 'ethusd_title', description: 'ethusd_description' },
        ethusdt: { title: 'ethusdt_title', description: 'ethusdt_description' },
        ltcbtc: { title: 'ltcbtc_title', description: 'ltcbtc_description' },
        t69eur: { title: 't69eur_title', description: 't69eur_description' },
        t69usdt: { title: 't69usdt_title', description: 't69usdt_description' },
        usdeur: { title: 'usdeur_title', description: 'usdeur_description' },
        usdtusd: { title: 'usdtusd_title', description: 'usdtusd_description' },
        btcaed: { title: 'btcaed_title', description: 'btcaed_description' },
        ethaed: { title: 'ethaed_title', description: 'ethaed_description' },
        usdtaed: { title: 'usdtaed_title', description: 'usdtaed_description' },
        btceur: { title: 'btceur_title', description: 'btceur_description' },
        etheur: { title: 'etheur_title', description: 'etheur_description' },
        bchusdt: { title: 'bchusdt_title', description: 'bchusdt_description' },
        usdteur: { title: 'usdteur_title', description: 'usdteur_description' },
        usdcusdt: { title: 'usdcusdt_title', description: 'usdcusdt_description' },
        btcusdc: { title: 'btcusdc_title', description: 'btcusdc_description' },
        maticbtc: { title: 'maticbtc_title', description: 'maticbtc_description' },
        maticusdt: { title: 'maticusdt_title', description: 'maticusdt_description' },
        zpaebtc: { title: 'zpaebtc_title', description: 'zpaebtc_description' },
        zpaeusdt: { title: 'zpaeusdt_title', description: 'zpaeusdt_description' },
        chzbtc: { title: 'chzbtc_title', description: 'chzbtc_description' },
        chzusdt: { title: 'chzusdt_title', description: 'chzusdt_description' },
        ethbusd: { title: 'ethbusd_title', description: 'ethbusd_description' },
        btcbusd: { title: 'btcbusd_title', description: 'btcbusd_description' },
        enjbtc: { title: 'enjbtc_title', description: 'enjbtc_description' },
        enjusdt: { title: 'enjusdt_title', description: 'enjusdt_description' },
    };

    public componentDidMount() {
        saveParametersFromUrl(this.props.location.search);
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
        const { rgl, userLoggedIn } = this.props;

        return (
            <div className={'pg-trading-screen'}>
                <div className={'pg-trading-wrap'}>
                    {this.setPageTitle()}
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
        const urlMarket: string = this.getMarketFromUrl();
        const market: Market | undefined = markets.find(item => item.id === urlMarket);
        if (market) {
            this.props.setCurrentMarket(market);
        }
    };

    private setPageTitle = () => {
        const { currentLanguage } = this.props;
        const urlMarket = this.getMarketFromUrl();
        if (!!this.pageTitles[`${urlMarket}`]) {
            const link = `https://emirex.com${
                currentLanguage === 'en' ? '/' : '/' + currentLanguage + '/'
            }trading/${urlMarket.toLowerCase()}`;
            const linkEn = `https://emirex.com/trading/${urlMarket.toLowerCase()}`;
            const linkRu = `https://emirex.com/ru/trading/${urlMarket.toLowerCase()}`;
            const linkZh = `https://emirex.com/zh/trading/${urlMarket.toLowerCase()}`;

            if (this.pageTitles[urlMarket]) {
                // tslint:disable
                const title = this.props.intl.formatMessage({ id: this.pageTitles[`${urlMarket}`].title });
                const description = this.props.intl.formatMessage({ id: this.pageTitles[urlMarket].description });
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

    private getMarketFromUrl = () => {
        const { currentLanguage } = this.props;
        const urlPart: number = currentLanguage === 'en' ? 2 : 3;
        return getUrlPart(urlPart, window.location.pathname);
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
