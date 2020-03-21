import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { Decimal } from '../../../components';
import { WalletItemProps } from '../../../components/WalletItem';
// import { VALUATION_PRIMARY_CURRENCY, VALUATION_SECONDARY_CURRENCY } from '../../../constants';
// import { estimateUnitValue, estimateValue } from '../../../helpers/estimateValue';
import {
    currenciesFetch,
    Currency,
    marketsFetch,
    marketsTickersFetch,
    RootState,
    selectCurrencies,
    selectMarkets,
    selectMarketTickers,
    selectUserLoggedIn,
} from '../../../modules';

import {
    getBalance,
} from '../../../api';

import { Market, Ticker } from '../../../modules/public/markets';
import { rangerConnectFetch, RangerConnectFetch } from '../../../modules/public/ranger';
import { RangerState } from '../../../modules/public/ranger/reducer';
import { selectRanger } from '../../../modules/public/ranger/selectors';

interface EstimatedValueProps {
    wallets: WalletItemProps[];
    hello: string;
}

interface State {
    estimated: { [key: string]: number };
}

interface ReduxProps {
    currencies: Currency[];
    markets: Market[];
    tickers: {
        [key: string]: Ticker,
    };
    rangerState: RangerState;
    userLoggedIn: boolean;
}

interface DispatchProps {
    fetchCurrencies: typeof currenciesFetch;
    fetchMarkets: typeof marketsFetch;
    fetchTickers: typeof marketsTickersFetch;
    rangerConnect: typeof rangerConnectFetch;
}

type Props = DispatchProps & ReduxProps & EstimatedValueProps & InjectedIntlProps;

class EstimatedValueContainer extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            estimated: {},
        };
    }

    public async componentDidMount() {

        const data = await getBalance(['btc', 'usd']);
        this.setState({ estimated: data.quote });
    }

    public componentWillReceiveProps(next: Props) {
        const {
            currencies,
            fetchCurrencies,
            fetchMarkets,
            fetchTickers,
            markets,
        } = this.props;

        if (next.markets.length === 0 && next.markets !== markets) {
            fetchMarkets();
            fetchTickers();
        }

        if (next.currencies.length === 0 && next.currencies !== currencies) {
            fetchCurrencies();
        }
    }

    public render(): React.ReactNode {
        let { estimated } = this.state;
        estimated = estimated || {};

        return (
            <div className="pg-estimated-value">
                <div className="pg-estimated-value__container">
                    {this.translate('page.body.wallets.estimated_value')}
                    <span className="value-container">
                        <span className="value">
                            {Decimal.format(estimated.USD, 8)}
                        </span>
                        <span className="value-sign">USD</span>
                    </span>
                    {this.renderSecondaryCurrencyValuation()}
                </div>
            </div>
        );
    }

    public translate = (key: string) => this.props.intl.formatMessage({id: key});

    private renderSecondaryCurrencyValuation = () => {
        let { estimated } = this.state;
        estimated = estimated || {};

        return (
            <span className="value-container">
                <span className="value">
                    {Decimal.format(estimated.BTC, 8)}
                </span>
                <span className="value-sign">BTC</span>
            </span>
        );
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    currencies: selectCurrencies(state),
    markets: selectMarkets(state),
    tickers: selectMarketTickers(state),
    rangerState: selectRanger(state),
    userLoggedIn: selectUserLoggedIn(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    fetchCurrencies: () => dispatch(currenciesFetch()),
    fetchMarkets: () => dispatch(marketsFetch()),
    fetchTickers: () => dispatch(marketsTickersFetch()),
    rangerConnect: (payload: RangerConnectFetch['payload']) => dispatch(rangerConnectFetch(payload)),
});

// tslint:disable-next-line:no-any
export const EstimatedValue = injectIntl(connect(mapStateToProps, mapDispatchToProps)(EstimatedValueContainer)) as any;
