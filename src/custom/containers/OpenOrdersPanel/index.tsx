import cx from 'classnames';
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
import { TabPanel } from '../../../components';
import {
    Market,
    ordersCancelAllFetch,
    PublicTrade,
    resetHistory,
    RootState,
    selectCancelOpenOrdersFetching,
    selectCurrentMarket,
    selectCurrentPrice,
    selectUserLoggedIn,
    setCurrentPrice,
} from '../../../modules';
import { selectRecentTradesOfCurrentMarket } from '../../../modules/public/recentTrades';

interface ReduxProps {
    recentTrades: PublicTrade[];
    currentMarket?: Market;
    currentPrice?: number;
    userLoggedIn: boolean;
    cancelFetching: boolean;
}

interface DispatchProps {
    resetHistory: typeof resetHistory;
    setCurrentPrice: typeof setCurrentPrice;
    ordersCancelAll: typeof ordersCancelAllFetch;
}

interface State {
    tab: string;
    additionalTab: string;
}

type Props = ReduxProps & DispatchProps & InjectedIntlProps;

export class OpenOrdersPanelContainer extends React.Component<Props, State> {
    public tabs = ['openOrders', 'orderHistory', 'tradeHistory', 'balances'];
    public state = { tab: 'openOrders', additionalTab: 'market' };

    public componentWillUnmount() {
        this.props.resetHistory();
    }

    public componentWillReceiveProps(nextProps: Props) {
        const { userLoggedIn } = this.props;
        if (userLoggedIn && userLoggedIn !== nextProps.userLoggedIn) {
            this.setState({ tab: 'openOrders' });
        }
    }

    public render() {
        return (
            <div className="pg-open-orders-panel">
                <TabPanel
                    panels={this.renderTabs()}
                    onTabChange={this.handleMakeRequest}
                    optionalHead={this.renderOptionalHead()}
                    currentTabIndex={this.tabs.indexOf(this.state.tab)}
                />
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
                content: tab === 'tradeHistory' ? this.renderTradeHistory() : null,
                label: this.props.intl.formatMessage({ id: 'page.body.trade.header.tradeHistory' }),
            },
            {
                content: tab === 'balances' ? <Balances /> : null,
                label: this.props.intl.formatMessage({ id: 'page.body.trade.header.balances' }),
            },
        ] : [
            {
                content: tab === 'openOrders' ? <OpenOrdersTab /> : null,
                label: this.props.intl.formatMessage({ id: 'page.body.trade.header.openOrders' }),
            },
            {
                content: tab === 'tradeHistory' ? this.renderTradeHistory() : null,
                label: this.props.intl.formatMessage({ id: 'page.body.trade.header.tradeHistory' }),
            },
        ];
    };

    private handleMakeRequest = (index: number) => {
        const tabMapping = this.props.userLoggedIn ?
            ['openOrders', 'orderHistory', 'tradeHistory', 'balances', 'market', 'yours', 'market' ] :
            ['openOrders', 'tradeHistory'];
        if (this.state.tab === tabMapping[index]) {
            return;
        }

        this.props.resetHistory();
        this.setState({ tab: tabMapping[index] });
    };

    private handleCancelAll = () => {
        const { currentMarket } = this.props;
        this.props.ordersCancelAll({market: currentMarket.id});
    };

    private renderTabPanel = (label: string, index: number) => {
        const { additionalTab } = this.state;

        const active = additionalTab === label;
        const className = cx('cr-tab', {
            'cr-tab__active': active,
        });

        return (
            <div
                className={className}
                key={index}
                onClick={this.createOnTabChangeHandler(label)}
                role="tab"
                tabIndex={index}
            >
                {this.props.intl.formatMessage({ id: `page.body.trade.header.${label}` })}
                {active && <span className="cr-tab__pointer" />}
            </div>
        );
    };

    private renderOptionalHead = () => {
        const { tab } = this.state;
        const additionalTabs = ['market', 'yours'];

        switch (tab) {
            case 'openOrders':
                return (
                    <span className="cr-table-header__cancel" onClick={this.handleCancelAll}>
                        {this.props.intl.formatMessage({ id: 'page.body.openOrders.header.button.cancelAll' })}
                        <span className="cr-table-header__close" />
                    </span>
                );
            case 'tradeHistory':
                return (
                    <div className="cr-tab-panel__optinal-head-container">
                        {additionalTabs.map(this.renderTabPanel)}
                    </div>
                );
            default:
                return;
        }
    };

    private renderTradeHistory = () => {
        const { additionalTab } = this.state;

        switch (additionalTab) {
            case 'market':
                return <MarketTab />;
            case 'yours':
                return <YoursTab />;
            default:
                return;
        }
    };

    private createOnTabChangeHandler = (label: string) => () => {
        this.setState({ additionalTab: label });
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    recentTrades: selectRecentTradesOfCurrentMarket(state),
    currentMarket: selectCurrentMarket(state),
    currentPrice: selectCurrentPrice(state),
    cancelFetching: selectCancelOpenOrdersFetching(state),
    userLoggedIn: selectUserLoggedIn(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    setCurrentPrice: payload => dispatch(setCurrentPrice(payload)),
    resetHistory: () => dispatch(resetHistory()),
    ordersCancelAll: payload => dispatch(ordersCancelAllFetch(payload)),
});

export type OpenOrdersPanelProps = ReduxProps;

export const OpenOrdersPanel = injectIntl(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    )(OpenOrdersPanelContainer),
);
