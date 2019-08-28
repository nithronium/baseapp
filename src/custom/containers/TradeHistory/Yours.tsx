
import { Decimal, Loader, Table } from '@openware/components';
import classnames from 'classnames';
import * as React from 'react';
import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { capitalize, localeDate, setTradesType } from '../../../helpers';
import {
    fetchHistory,
    Market,
    marketsFetch,
    RootState,
    selectCurrentPrice,
    selectFullHistory,
    selectHistory,
    selectHistoryLoading,
    selectMarkets,
    setCurrentPrice,
    WalletHistoryList,
} from '../../../modules';

interface ReduxProps {
    marketsData: Market[];
    list: WalletHistoryList;
    fetching: boolean;
    fullHistory: number;
    currentPrice?: number;
}

interface DispatchProps {
    fetchHistory: typeof fetchHistory;
    setCurrentPrice: typeof setCurrentPrice;
    fetchMarkets: typeof marketsFetch;
}

type Props = ReduxProps & DispatchProps & InjectedIntlProps;

const timeFrom = Math.floor((Date.now() - 1000 * 60 * 60 * 24) / 1000);

class YoursComponent extends React.Component<Props> {

    public componentDidMount() {
        const { marketsData } = this.props;

        if (marketsData.length === 0) {
            this.props.fetchMarkets();
        }

        this.props.fetchHistory({ type: 'trades', page: 0, time_from: timeFrom });
    }

    public componentWillReceiveProps(next: Props) {
        const { marketsData } = this.props;

        if (next.marketsData.length === 0 && next.marketsData !== marketsData) {
            this.props.fetchMarkets();
        }
    }

    public render() {
        const { fetching } = this.props;
        const className = classnames({
            'cr-tab-content__noData': this.retrieveData()[0][1] === this.props.intl.formatMessage({ id: 'page.noDataToShow' }),
        });

        return (
            <div className={className}>
                {fetching ? <Loader /> : this.renderContent()}
            </div>
        );
    }

    public renderContent = () => {
        return (
            <React.Fragment>
                <Table
                    header={this.getHeaders()}
                    data={this.retrieveData()}
                    onSelect={this.handleOnSelect}
                />
            </React.Fragment>
        );
    };

    private getHeaders = () => (
        [
            this.props.intl.formatMessage({ id: 'page.body.trade.header.recentTrades.content.time' }),
            this.props.intl.formatMessage({ id: 'page.body.trade.header.tradeHistory.content.side' }),
            this.props.intl.formatMessage({ id: 'page.body.trade.header.tradeHistory.content.market'}),
            this.props.intl.formatMessage({ id: 'page.body.trade.header.recentTrades.content.price' }),
            this.props.intl.formatMessage({ id: 'page.body.trade.header.recentTrades.content.amount' }),
            this.props.intl.formatMessage({ id: 'page.body.trade.header.tradeHistory.content.funds' }),
        ]
    );

    private retrieveData = () => {
        const { list } = this.props;
        return [...list].length > 0
            ? [...list].map(this.renderRow)
            : [[[''], this.props.intl.formatMessage({ id: 'page.noDataToShow' })]];
    };

    private renderRow = item => {
        const { marketsData } = this.props;
        const { id, created_at, price, volume, taker_type, market, funds } = item;

        const currentTradeMarket = marketsData.find(i => i.id === market);
        const priceFixed = currentTradeMarket ? currentTradeMarket.price_precision : 0;
        const amountFixed = currentTradeMarket ? currentTradeMarket.amount_precision : 0;
        const takerSide = taker_type === 'sell' ?  'ask' : 'bid';
        const fullDate = localeDate(created_at, 'fullDate').split(' ');
        const marketName = currentTradeMarket.name;

        return [
            <span key={id}><span style={{ color: '#FFFFFF' }}>{fullDate[0]}</span> {fullDate[1]}</span>,
            <span style={{ color: setTradesType(takerSide).color }} key={id}>{capitalize(takerSide)}</span>,
            marketName,
            <span key={id}><Decimal key={id} fixed={priceFixed} thousSep=",">{price}</Decimal></span>,
            <span key={id}><Decimal key={id} fixed={amountFixed} thousSep=",">{volume}</Decimal></span>,
            <span key={id}><Decimal fixed={amountFixed} thousSep=",">{funds}</Decimal></span>,
        ];
    };

    private handleOnSelect = (index: string) => {
        const { list, currentPrice } = this.props;
        const priceToSet = list[Number(index)] ? list[Number(index)].price : '';

        if (currentPrice !== priceToSet) {
            this.props.setCurrentPrice(priceToSet);
        }
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    marketsData: selectMarkets(state),
    list: selectHistory(state),
    fetching: selectHistoryLoading(state),
    fullHistory: selectFullHistory(state),
    currentPrice: selectCurrentPrice(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        fetchHistory: params => dispatch(fetchHistory(params)),
        setCurrentPrice: payload => dispatch(setCurrentPrice(payload)),
        fetchMarkets: () => dispatch(marketsFetch()),
    });

const YoursTab = injectIntl(connect(mapStateToProps, mapDispatchToProps)(YoursComponent));

export {
    YoursTab,
};
