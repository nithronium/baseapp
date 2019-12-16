import { Decimal } from '@openware/components';
import classnames from 'classnames';
import * as React from 'react';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { Link } from 'react-router-dom';
import { WalletItemProps } from '../../../components/WalletItem';
import { VALUATION_PRIMARY_CURRENCY } from '../../../constants';
import { estimateValue } from '../../../helpers/estimateValue';
import {
    currenciesFetch,
    Currency,
    Deposit,
    fetchHistory,
    Label,
    labelFetch,
    marketsFetch,
    marketsTickersFetch,
    selectCurrencies,
    selectHistory,
    selectLabelData,
    selectMarkets,
    selectMarketTickers,
    selectUserInfo,
    selectUserLoggedIn,
    selectWithdrawLimit,
    User,
    WalletHistoryList,
    withdrawLimitFetch,
} from '../../../modules';
import { Market, Ticker } from '../../../modules/public/markets';
import { rangerConnectFetch, RangerConnectFetch } from '../../../modules/public/ranger';
import { RangerState } from '../../../modules/public/ranger/reducer';
import { selectRanger } from '../../../modules/public/ranger/selectors';
import { WithdrawLimit } from '../../../modules/user/withdrawLimit';

interface ReduxProps {
    currencies: Currency[];
    depositHistory: WalletHistoryList;
    label: Label[];
    markets: Market[];
    tickers: {
        [key: string]: Ticker,
    };
    rangerState: RangerState;
    withdrawLimitData: WithdrawLimit;
    user: User;
    userLoggedIn: boolean;
}

interface DispatchProps {
    fetchCurrencies: typeof currenciesFetch;
    fetchHistory: typeof fetchHistory;
    fetchLabels: typeof labelFetch;
    fetchMarkets: typeof marketsFetch;
    fetchTickers: typeof marketsTickersFetch;
    fetchWithdrawLimit: typeof withdrawLimitFetch;
    rangerConnect: typeof rangerConnectFetch;
}

interface State {
    formattedDepositHistory: WalletItemProps[];
    evaluatedDepositsTotal: string;
}

type Props = ReduxProps & DispatchProps & InjectedIntlProps;

class ProfileVerificationComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            formattedDepositHistory: [],
            evaluatedDepositsTotal: '',
        };
    }

    public componentDidMount() {
        const {
            currencies,
            fetchCurrencies,
            fetchLabels,
            fetchMarkets,
            fetchTickers,
            fetchWithdrawLimit,
            markets,
            rangerState: {connected},
            userLoggedIn,
        } = this.props;

        fetchLabels();
        fetchWithdrawLimit();

        this.props.fetchHistory({ type: 'deposits' });

        if (markets.length === 0) {
            fetchMarkets();
            fetchTickers();
        }

        if (currencies.length === 0) {
            fetchCurrencies();
        }

        if (!connected) {
            this.props.rangerConnect({withAuth: userLoggedIn});
        }
    }

    public componentWillReceiveProps(nextProps: Props) {
        const { currencies, depositHistory } = this.props;
        const { formattedDepositHistory } = this.state;

        if (nextProps.depositHistory.length && currencies.length &&
            (JSON.stringify(nextProps.depositHistory) !== JSON.stringify(depositHistory) || !formattedDepositHistory.length)) {
            if (nextProps.depositHistory[0].confirmations !== undefined) {
                const fiatDepositHistory = this.handleFilterDepositHistory(currencies, nextProps.depositHistory);
                this.setState({ formattedDepositHistory: this.handleFormatDepositHistory(fiatDepositHistory) });
            }
        }
    }

    public componentDidUpdate(prevProps: Props, prevState: State) {
        const {
            currencies,
            markets,
            tickers,
        } = this.props;
        const { formattedDepositHistory } = this.state;
        if (formattedDepositHistory.length && currencies.length && markets.length && tickers &&
            JSON.stringify(prevState.formattedDepositHistory) !== JSON.stringify(formattedDepositHistory)) {
            this.setState({
                evaluatedDepositsTotal: estimateValue(VALUATION_PRIMARY_CURRENCY, currencies, formattedDepositHistory, markets, tickers),
            });
        }
    }

    public renderUserLevel(level: number) {
        const zeroCircleClassName = classnames('pg-profile-verification__level__circle', {
            'pg-profile-verification__level__circle--active': level === 0 || level === 1,
        });

        const firstCircleClassName = classnames('pg-profile-verification__level__circle', {
            'pg-profile-verification__level__circle--active': level === 2 || level === 3,
        });

        const secondCircleClassName = classnames('pg-profile-verification__level__circle', {
            'pg-profile-verification__level__circle--active': level === 4 || level === 5,
        });

        const thirdCircleClassName = classnames('pg-profile-verification__level__circle', {
            'pg-profile-verification__level__circle--active': level === 6,
        });

        return (
            <div className="pg-profile-verification__level">
                <div className={zeroCircleClassName}>0</div>
                <div className="pg-profile-verification__level__line" />
                <div className={firstCircleClassName}>1</div>
                <div className="pg-profile-verification__level__line" />
                <div className={secondCircleClassName}>2</div>
                <div className="pg-profile-verification__level__line" />
                <div className={thirdCircleClassName}>3</div>
            </div>
        );
    }

    public renderUpgradeLevelLink() {
        return (
            <Link to="/confirm" className="pg-profile-verification__upgrade-level">
                <FormattedMessage id="page.body.profile.header.account.profile.upgrade"/>
            </Link>
        );
    }


    public renderDocumentPending() {
        return (
            <span className="pg-profile-verification__know-more__document-pending">
                <FormattedMessage id="resource.profile.document"/>
            </span>
        );
    }

    public renderUserAbilities(level: number, withdrawLimitData: WithdrawLimit) {
        const withdrawalLimitCurrency = withdrawLimitData.withdraw.currency.toLocaleLowerCase().includes('usd') ?
            '$' : ` ${withdrawLimitData.withdraw.currency.toUpperCase()}`;

        // tslint:disable-next-line: prefer-switch
        if (level === 2 || level === 3) {
            const firstAbility = this.props.intl.formatMessage(
                { id: 'page.body.profile.header.account.profile.abilities.first.message1' },
                { amount: withdrawLimitData.withdraw.limit, currency: withdrawalLimitCurrency },
            );

            return (
                <div className="pg-profile-verification__abilities">
                    <p >{firstAbility}</p>
                    <FormattedMessage id="page.body.profile.header.account.profile.abilities.first.message2" />
                </div>
            );
        }

        // tslint:disable-next-line: prefer-switch
        if (level === 4 || level === 5) {
            const firstAbility = this.props.intl.formatMessage(
                { id: 'page.body.profile.header.account.profile.abilities.second.message1' },
                { amount: withdrawLimitData.withdraw.limit, currency: withdrawalLimitCurrency },
            );

            const secondAbility = this.props.intl.formatMessage(
                { id: 'page.body.profile.header.account.profile.abilities.second.message2' },
                { amount: withdrawLimitData.withdraw.limit, currency: withdrawalLimitCurrency },
            );

            return (
                <div className="pg-profile-verification__abilities">
                    <p>{firstAbility}</p>
                    <p>{secondAbility}</p>
                </div>
            );
        }

        if (level === 6) {
            return (
                <div className="pg-profile-verification__abilities">
                    <FormattedMessage id="page.body.profile.header.account.profile.abilities.third" />
                </div>
            );
        }

        return (
            <div className="pg-profile-verification__abilities pg-profile-verification__abilities--blank" />
        );
    }

    public renderWithdrawLimit(userLevel: number, withdrawLimitData: WithdrawLimit) {
        if (!userLevel || userLevel === 1 || userLevel === 6) {
            return (
                <div className="pg-profile-verification__withdraw-limit" />
            );
        }

        const percentage = Math.round(+withdrawLimitData.withdraw.withdrawal_amount / +withdrawLimitData.withdraw.limit * 100);
        const withdrawalLimitCurrency = withdrawLimitData.withdraw.currency.toLocaleLowerCase().includes('usd') ?
            '$' : ` ${withdrawLimitData.withdraw.currency.toUpperCase()}`;
        // const currentCurrency = this.props.currencies.find(currecy => currecy.id.toLowerCase() === withdrawLimitData.withdraw.currency.toLowerCase() ? currecy : 'USD');
        // const currencyPrecision = currentCurrency && currentCurrency.precision || 2;
        // const currentCurrency = 'USD';
        const currencyPrecision = 2;
        return (
            <div className="pg-profile-verification__withdraw-limit">
                <div className="pg-profile-verification__withdraw-limit__wrap">
                    <div className="pg-profile-verification__withdraw-limit__wrap__progress-bar">
                        <div
                            className="pg-profile-verification__withdraw-limit__wrap__progress-bar--filled"
                            style={{width: `${percentage < 100 ? percentage : 100}%`}}
                        />
                    </div>
                    <span className="pg-profile-verification__withdraw-limit__wrap__text">
                        <FormattedMessage id="page.body.profile.header.account.profile.withdraw" />
                        &nbsp;{Decimal.format(withdrawLimitData.withdraw.withdrawal_amount, currencyPrecision)} / {Decimal.format(withdrawLimitData.withdraw.limit, currencyPrecision)}{withdrawalLimitCurrency}
                    </span>
                </div>
                <div className="pg-profile-verification__withdraw-limit__know-more" />
            </div>
        );
    }

    public renderDepositLimit(userLevel: number, withdrawLimitData: WithdrawLimit) {
        const { evaluatedDepositsTotal } = this.state;

        if (!userLevel || userLevel === 1 || userLevel === 6) {
            return (
                <div className="pg-profile-verification__deposit-limit">
                    <div className="pg-profile-verification__deposit-limit__wrap" />
                </div>
            );
        }
        const percentage = Math.round(+evaluatedDepositsTotal / +withdrawLimitData.deposit.limit * 100);
        const currentCurrency = 'USD';
        const currencyPrecision = 2;

        return (
            <div className="pg-profile-verification__deposit-limit">
                <div className="pg-profile-verification__deposit-limit__wrap">
                    <div className="pg-profile-verification__deposit-limit__wrap__progress-bar">
                        <div
                            className="pg-profile-verification__deposit-limit__wrap__progress-bar--filled"
                            style={{width: `${percentage < 100 ? percentage : 100}%`}}
                        />
                    </div>
                    <span className="pg-profile-verification__deposit-limit__wrap__text">
                        <FormattedMessage id="page.body.profile.header.account.profile.deposit" />
                        &nbsp;{Decimal.format(evaluatedDepositsTotal, currencyPrecision)} / {Decimal.format(withdrawLimitData.deposit.limit, currencyPrecision)}{currentCurrency}
                    </span>
                </div>
            </div>
        );
    }


    public render() {
        const {
            label,
            user,
            withdrawLimitData,
        } = this.props;
        const userLevel = user.level;

        const withdrawLimitDataExists = withdrawLimitData &&
            withdrawLimitData.withdraw &&
            withdrawLimitData.deposit;

        const pendingDocumentLabel = label.find(l => l.key === 'document' && l.value === 'pending' && l.scope === 'private');

        return (
            <div className="pg-profile-verification">
                <div className="pg-profile-verification__title">
                    <FormattedMessage id="page.body.profile.header.account.profile"/>
                </div>
                <div className="pg-profile-verification__user-level">
                    {this.renderUserLevel(userLevel)}
                    {userLevel < 6 && this.renderUpgradeLevelLink()}
                </div>
                <div className="pg-profile-verification__know-more">
                    <a href="https://knowledge-base.emirex.com/emirex">
                        <FormattedMessage id="page.body.profile.header.account.profile.knowMore" />
                    </a>
                    {pendingDocumentLabel && this.renderDocumentPending()}
                </div>
                {withdrawLimitDataExists && this.renderUserAbilities(userLevel, withdrawLimitData)}
                {withdrawLimitDataExists && this.renderWithdrawLimit(userLevel, withdrawLimitData)}
                {withdrawLimitDataExists && this.renderDepositLimit(userLevel, withdrawLimitData)}
            </div>
        );
    }

    private handleFilterDepositHistory = (currencies: Currency[], depositHistory: WalletHistoryList) => {
        const fiatDepositHistory: WalletHistoryList = [];

        for (const currency of currencies) {
            if (currency.type === 'fiat') {
                for (const deposit of depositHistory as Deposit[]) {
                    if (deposit.currency === currency.id) {
                        fiatDepositHistory.push(deposit);
                    }
                }
            }
        }

        return fiatDepositHistory;
    }

    private handleFormatDepositHistory = (depositHistory: WalletHistoryList) => {
        const depositsAsWallets: WalletItemProps[] = [];

        for (const deposit of depositHistory as Deposit[]) {
            depositsAsWallets.push({
                balance: +deposit.amount,
                currency: deposit.currency,
                name: '',
                fee: 0,
                type: 'fiat',
                fixed: 0,
            });
        }

        return depositsAsWallets;
    }
}

const mapStateToProps = state => ({
    currencies: selectCurrencies(state),
    depositHistory: selectHistory(state),
    label: selectLabelData(state),
    markets: selectMarkets(state),
    tickers: selectMarketTickers(state),
    rangerState: selectRanger(state),
    withdrawLimitData: selectWithdrawLimit(state),
    user: selectUserInfo(state),
    userLoggedIn: selectUserLoggedIn(state),
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        fetchCurrencies: () => dispatch(currenciesFetch()),
        fetchHistory: params => dispatch(fetchHistory(params)),
        fetchLabels: () => dispatch(labelFetch()),
        fetchMarkets: () => dispatch(marketsFetch()),
        fetchTickers: () => dispatch(marketsTickersFetch()),
        fetchWithdrawLimit: () => dispatch(withdrawLimitFetch()),
        rangerConnect: (payload: RangerConnectFetch['payload']) => dispatch(rangerConnectFetch(payload)),
    });

const ProfileVerification = injectIntl(connect(mapStateToProps, mapDispatchProps)(ProfileVerificationComponent));

export {
    ProfileVerification,
};
