import {
    Decimal,
    Table,
} from '@openware/components';
import classnames from 'classnames';
import * as React from 'react';
import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { WalletItemProps } from '../../../components/WalletItem';
import { handleCCYPrecision } from '../../../helpers';
import { estimateUnitValue } from '../../../helpers/estimateValue';
import {
    currenciesFetch,
    Currency,
    Market,
    marketsFetch,
    marketsTickersFetch,
    RootState,
    selectCurrencies,
    selectMarkets,
    selectMarketsLoading,
    selectMarketTickers,
    selectWallets,
    selectWalletsLoading,
    Ticker,
    walletsData,
    walletsFetch,
} from '../../../modules';
import {
    DEFAULT_WALLET_PRECISION,
    VALUATION_CURRENCY,
} from '../../constants';
import { getWalletTotal } from '../../helpers';

interface ReduxProps {
    currencies: Currency[];
    marketsLoading?: boolean;
    marketTickers: {
        [key: string]: Ticker,
    };
    marketsData: Market[];
    wallets: WalletItemProps[];
    walletsLoading?: boolean;
}

interface DispatchProps {
    fetchCurrencies: typeof currenciesFetch;
    fetchMarkets: typeof marketsFetch;
    tickers: typeof marketsTickersFetch;
    clearWallets: () => void;
    fetchWallets: typeof walletsFetch;
}

type Props = ReduxProps & DispatchProps & InjectedIntlProps;

class BalancesComponent extends React.Component<Props> {
    public translate = (id: string) => this.props.intl.formatMessage({ id });

    public componentDidMount() {
        const {
            currencies,
            fetchCurrencies,
            fetchMarkets,
            fetchWallets,
            marketsData,
            tickers,
            wallets,
        } = this.props;

        if (wallets.length === 0) {
            fetchWallets();
        }

        if (marketsData.length === 0) {
            fetchMarkets();
            tickers();
        }

        if (currencies.length === 0) {
            fetchCurrencies();
        }
    }

    public componentWillReceiveProps(next: Props) {
        const {
            currencies,
            fetchCurrencies,
            tickers,
            marketsData,
        } = this.props;

        if (next.marketsData.length === 0 && next.marketsData !== marketsData) {
            tickers();
        }

        if (next.currencies.length === 0 && next.currencies !== currencies) {
            fetchCurrencies();
        }
    }

    public render() {
        const { wallets } = this.props;
        const className = classnames('cr-funds', {
            'cr-tab-content__noData': wallets && wallets.length === 0,
        });

        return (
            <div className={className}>
                {this.renderContent()}
            </div>
        );
    }

    private renderContent = () => {
        return (
            <React.Fragment>
                <Table
                    header={this.getHeaders()}
                    data={this.getData()}
                />
            </React.Fragment>
        );
    };

    private getHeaders = () => {
        const { wallets } = this.props;
        const firstWalletFIAT = wallets.find(item => (item.currency === VALUATION_CURRENCY)) || wallets.find(item => (item.type === 'fiat'));

        const firstFIAT = firstWalletFIAT ? firstWalletFIAT.currency : '';
        return [
            this.translate('page.body.trade.header.funds.content.coin'),
            this.translate('page.body.trade.header.funds.content.name'),
            this.translate('page.body.trade.header.funds.content.available'),
            this.translate('page.body.trade.header.funds.content.locked'),
            this.translate('page.body.trade.header.funds.content.total'),
            <span key={4}>{this.translate('page.body.trade.header.funds.content.value')}{firstFIAT.toUpperCase()}</span>,
        ];
    };

    private getData = () => {
        const {
            currencies,
            marketsData,
            marketTickers,
            wallets,
        } = this.props;

        const valuationWallet = wallets.find(item => (item.currency === VALUATION_CURRENCY)) || wallets.find(item => (item.type === 'fiat'));
        const valuationCurrency = valuationWallet ? valuationWallet.currency : '';

        const formattedWallets = wallets.map((wallet: WalletItemProps) => {
            return ({
                ...wallet,
                currency: wallet.currency.toUpperCase(),
                valuation: estimateUnitValue(valuationCurrency, wallet.currency, getWalletTotal(wallet), currencies, marketsData, marketTickers),
                walletPrecision: handleCCYPrecision(currencies, wallet.currency, DEFAULT_WALLET_PRECISION),
            });
        });

        return [...formattedWallets].length > 0
            ? [...formattedWallets].map(this.renderRow)
            : [[[''], this.translate('page.noDataToShow')]];
    };

    private renderRow = (item, id) => {
        const {
            balance,
            currency,
            locked,
            valuation,
            walletPrecision,
            name,
        } = item;

        const available = balance - locked;

        return [
            <span key={id}>{currency}</span>,
            <span key={id}>{name}</span>,
            <span key={id}><Decimal fixed={walletPrecision}>{available.toString()}</Decimal></span>,
            <span key={id}><Decimal fixed={walletPrecision}>{locked.toString()}</Decimal></span>,
            <span key={id}>{balance}</span>,
            <span key={id}>{valuation}</span>,
        ];
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    currencies: selectCurrencies(state),
    marketsData: selectMarkets(state),
    marketsLoading: selectMarketsLoading(state),
    marketTickers: selectMarketTickers(state),
    wallets: selectWallets(state),
    walletsLoading: selectWalletsLoading(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        fetchCurrencies: () => dispatch(currenciesFetch()),
        fetchMarkets: () => dispatch(marketsFetch()),
        tickers: () => dispatch(marketsTickersFetch()),
        fetchWallets: () => dispatch(walletsFetch()),
        clearWallets: () => dispatch(walletsData([])),
    });

export const Balances = injectIntl(connect(mapStateToProps, mapDispatchToProps)(BalancesComponent));
