import { Decimal, Table } from '@openware/components';
import classnames from 'classnames';
import * as React from 'react';
import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { capitalize, localeDate, setTradeColor } from '../../../helpers';
import {
    Market,
    PublicTrade,
    RootState,
    selectCurrentMarket,
    selectCurrentPrice,
    setCurrentPrice,
} from '../../../modules';
import { recentTradesFetch, selectRecentTradesOfCurrentMarket } from '../../../modules/public/recentTrades';

interface ReduxProps {
    recentTrades: PublicTrade[];
    currentMarket: Market | undefined;
    currentPrice: number | undefined;
}

interface DispatchProps {
    tradesFetch: typeof recentTradesFetch;
    setCurrentPrice: typeof setCurrentPrice;
}

type Props = DispatchProps & ReduxProps & InjectedIntlProps;

class MarketComponent extends React.Component<Props> {
    public componentWillReceiveProps(next: Props) {
        if (next.currentMarket && this.props.currentMarket !== next.currentMarket) {
            this.props.tradesFetch(next.currentMarket);
        }
    }

    public componentDidMount() {
        if (this.props.currentMarket) {
            this.props.tradesFetch(this.props.currentMarket);
        }
    }

    public render() {
        const className = classnames('pg-recent-trades__market', {
            'cr-tab-content__noData': this.getTrades(this.props.recentTrades)[0][1] === this.props.intl.formatMessage({ id: 'page.noDataToShow' }),
        });

        return (
            <div className={className}>
                <Table
                    data={this.getTrades(this.props.recentTrades)}
                    header={this.getHeaders()}
                    onSelect={this.handleOnSelect}
                />
            </div>
        );
    }

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

    private getTrades(trades: PublicTrade[]) {
        const { currentMarket } = this.props;
        const priceFixed = currentMarket ? currentMarket.price_precision : 0;
        const amountFixed = currentMarket ? currentMarket.amount_precision : 0;

        const renderRow = item => {
            const { id, created_at, taker_type, price, volume, market, funds } = item;
            const fullDate = localeDate(created_at, 'fullDate').split(' ');
            const marketName = currentMarket ? currentMarket.name : market;

            return [
                <span key={id}><span style={{ color: '#FFFFFF' }}>{fullDate[0]}</span> {fullDate[1]}</span>,
                <span style={{ color: setTradeColor(taker_type).color }} key={id}>{capitalize(taker_type)}</span>,
                marketName,
                <span key={id}><Decimal fixed={priceFixed} thousSep=",">{price}</Decimal></span>,
                <span key={id}><Decimal fixed={amountFixed} thousSep=",">{volume}</Decimal></span>,
                <span key={id}><Decimal fixed={amountFixed} thousSep=",">{funds}</Decimal></span>,
            ];
        };
        return (trades.length > 0)
            ? trades.map(renderRow)
            : [[[''], this.props.intl.formatMessage({ id: 'page.noDataToShow' })]];
    }

    private handleOnSelect = (index: string) => {
        const { recentTrades, currentPrice } = this.props;
        const priceToSet = recentTrades[Number(index)] ? recentTrades[Number(index)].price : '';

        if (currentPrice !== priceToSet) {
            this.props.setCurrentPrice(priceToSet);
        }
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    recentTrades: selectRecentTradesOfCurrentMarket(state),
    currentMarket: selectCurrentMarket(state),
    currentPrice: selectCurrentPrice(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    tradesFetch: market => dispatch(recentTradesFetch(market)),
    setCurrentPrice: payload => dispatch(setCurrentPrice(payload)),
});

const MarketTab = injectIntl(connect(mapStateToProps, mapDispatchToProps)(MarketComponent));

export {
    MarketTab,
};
