import { TabPanel } from '@openware/components';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import {
    Balances,
    MarketTab,
    OpenOrdersTab,
    OrderHistory,
    YoursTab,
} from '../';
import {
    Market,
    PublicTrade,
    resetHistory,
    RootState,
    selectCurrentMarket,
    selectCurrentPrice,
    selectUserLoggedIn,
    setCurrentPrice,
} from '../../../modules';
import { selectRecentTradesOfCurrentMarket } from '../../../modules/public/recentTrades';

interface ReduxProps {
    recentTrades: PublicTrade[];
    currentMarket: Market | undefined;
    currentPrice: number | undefined;
    userLoggedIn: boolean;
}

interface DispatchProps {
    resetHistory: typeof resetHistory;
    setCurrentPrice: typeof setCurrentPrice;
}

interface State {
    tab: string;
}

type Props = ReduxProps & DispatchProps & InjectedIntlProps;

export class OpenOrdersPanelContainer extends React.Component<Props, State> {
    public state = { tab: 'openOrders' };

    public componentWillUnmount() {
        this.props.resetHistory();
    }

    public render() {
        return (
            <div className="pg-open-orders-panel">
                <TabPanel panels={this.renderTabs()} onTabChange={this.handleMakeRequest} />
            </div>
        );
    }

    private renderTabs = () => {
        const { tab } = this.state;
        return this.props.userLoggedIn ? [
            {
                content: tab === 'openOrders' ? <OpenOrdersTab /> : null,
                label: this.props.intl.formatMessage({ id: 'page.body.trade.header.openOrders' }),
            },
            {
                content: tab === 'orderHistory' ? <OrderHistory /> : null,
                label: this.props.intl.formatMessage({ id: 'page.body.trade.header.orderHistory' }),
            },
            {
                content: tab === 'tradeHistory' ? <MarketTab /> : null,
                label: this.props.intl.formatMessage({ id: 'page.body.trade.header.tradeHistory' }),
            },
            {
                content: tab === 'balances' ? <Balances /> : null,
                label: this.props.intl.formatMessage({ id: 'page.body.trade.header.balances' }),
            },
            {
                content: tab === 'market' ? <MarketTab /> : null,
                label: this.props.intl.formatMessage({ id: 'page.body.trade.header.market' }),
                hidden: tab !== 'tradeHistory' && tab !== 'market' && tab !== 'yours',
            },
            {
                content: tab === 'yours' ? <YoursTab /> : null,
                label: this.props.intl.formatMessage({ id: 'page.body.trade.header.yours' }),
                hidden: tab !== 'tradeHistory' && tab !== 'market' && tab !== 'yours',
            },
        ] : [
            {
                content: tab === 'openOrders' ? <OpenOrdersTab /> : null,
                label: this.props.intl.formatMessage({ id: 'page.body.trade.header.openOrders' }),
            },
            {
                content: tab === 'market' ? <MarketTab /> : null,
                label: this.props.intl.formatMessage({ id: 'page.body.trade.header.market' }),
            },
        ];
    };

    private handleMakeRequest = (index: number) => {
        const tabMapping = this.props.userLoggedIn ? ['openOrders', 'orderHistory', 'tradeHistory', 'balances', 'market', 'yours', 'market' ] : ['openOrders', 'market'];
        if (this.state.tab === tabMapping[index]) {
            return;
        }

        this.props.resetHistory();
        this.setState({ tab: tabMapping[index] });
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    recentTrades: selectRecentTradesOfCurrentMarket(state),
    currentMarket: selectCurrentMarket(state),
    currentPrice: selectCurrentPrice(state),
    userLoggedIn: selectUserLoggedIn(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    setCurrentPrice: payload => dispatch(setCurrentPrice(payload)),
    resetHistory: () => dispatch(resetHistory()),
});

export type OpenOrdersPanelProps = ReduxProps;

export const OpenOrdersPanel = injectIntl(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    )(OpenOrdersPanelContainer),
);
