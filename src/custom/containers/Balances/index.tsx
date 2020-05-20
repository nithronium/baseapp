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

import { getExchangeRates } from '../../../api';

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


interface RatesItem {
    symbol: string;
    price: number;
}

interface State {
    rates: {
        symbol: string;
        amount: number;
        quote: RatesItem[];
    };
}

class BalancesComponent extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            rates: {
                amount: 1,
                symbol: 'USD',
                quote: [],
            },
        };
    }

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


        if (wallets.length !== 0) {
            // tslint:disable-next-line
            this.loadRates(this.props);
        }
    }

    public async componentWillReceiveProps(next: Props) {
        const {
            currencies,
            fetchCurrencies,
            tickers,
            marketsData,
            wallets,
        } = this.props;

        if (next.marketsData.length === 0 && next.marketsData !== marketsData) {
            tickers();
        }

        if (next.currencies.length === 0 && next.currencies !== currencies) {
            fetchCurrencies();
        }

        if (wallets.length !== next.wallets.length) {
            // tslint:disable-next-line
            this.loadRates(next);
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

    private loadRates = async (props: Props) => {
        const currencies = props.wallets.map(item => {
            return item.currency.toLowerCase();
        });
        const rates = await getExchangeRates('USD', 1, currencies);
        this.setState({ rates });
        console.log(rates);
    };

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

    private getValuationCurrency = (props?: Props) => {
        const {
            wallets,
        } = (props || this.props);

        const valuationWallet = wallets.find(item => (item.currency === VALUATION_CURRENCY)) || wallets.find(item => (item.type === 'fiat'));
        const valuationCurrency = valuationWallet ? valuationWallet.currency : '';
        return valuationCurrency;
    };

    private getData = () => {
        const {
            currencies,
            wallets,
        } = this.props;

        const valuationCurrency = this.getValuationCurrency();

        const formattedWallets = wallets.map((wallet: WalletItemProps) => {
            return ({
                ...wallet,
                currency: wallet.currency.toUpperCase(),
                valuation: this.convertValation(wallet, valuationCurrency),
                walletPrecision: handleCCYPrecision(currencies, wallet.currency, DEFAULT_WALLET_PRECISION),
            });
        });

        return [...formattedWallets].length > 0
            ? [...formattedWallets].map(this.renderRow)
            : [[[''], this.translate('page.noDataToShow')]];
    };


    private getCurrencyPrice = (curr: string): number => {
        const { rates } = this.state;
        const { quote } = rates;
        const item = quote.filter(c => {
            return c.symbol.toLowerCase() === curr.toLowerCase();
        })[0];
        if (!item) {
            return 1;
        }
        return item.price || 1;
    };

    private convertValation = (wallet: WalletItemProps, valuationCurrency: string): number => {
        const valuationPrice: number = this.getCurrencyPrice(valuationCurrency);
        const walletPrice = this.getCurrencyPrice(wallet.currency);
        const valueInWallet = Number(wallet.balance);
        const valueInUsd = valueInWallet / walletPrice;
        const valuationValue = valueInUsd * valuationPrice;
        return valuationValue;
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
            <span key={id}><Decimal fixed={walletPrecision}>{valuation.toString()}</Decimal></span>,
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
