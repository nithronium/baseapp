// tslint:disable
import { Decimal } from '@openware/components';
import classnames from 'classnames';
import * as React from 'react';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import {Link} from 'react-router-dom';
// import { Link } from 'react-router-dom';

import { WalletItemProps } from '../../../components/WalletItem';
import { 
    VALUATION_PRIMARY_CURRENCY,
} from '../../../constants';
import { estimateValue } from '../../../helpers/estimateValue';
import {
    alertPush,
    currenciesFetch,
    Currency,
    Deposit,
    fetchHistory,
    Label,
    labelFetch,
    marketsFetch,
    marketsTickersFetch,
    selectCurrencies,
    selectCurrentLanguage,
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
import checkCircleSvg = require('../../assets/images/check-circle.svg');
import clockSvg = require('../../assets/images/clock.svg');
import infoSvg = require('../../assets/images/info.svg');

import { getBalance } from '../../../api';

interface ReduxProps {
    currencies: Currency[];
    depositHistory: WalletHistoryList;
    label: Label[];
    markets: Market[];
    tickers: {
        [key: string]: Ticker;
    };
    rangerState: RangerState;
    withdrawLimitData: WithdrawLimit;
    user: User;
    userLoggedIn: boolean;
    currentLanguage: string;
}

interface DispatchProps {
    fetchCurrencies: typeof currenciesFetch;
    fetchHistory: typeof fetchHistory;
    fetchLabels: typeof labelFetch;
    fetchMarkets: typeof marketsFetch;
    fetchTickers: typeof marketsTickersFetch;
    fetchWithdrawLimit: typeof withdrawLimitFetch;
    rangerConnect: typeof rangerConnectFetch;
    fetchSuccess: typeof alertPush;
}
interface State {
    formattedDepositHistory: WalletItemProps[];
    evaluatedDepositsTotal: string;
    balance: number;
}
//tslint:disable
export type ProfileProps = ReduxProps & DispatchProps & InjectedIntlProps;
class ProfileVerificationComponent extends React.Component<ProfileProps, State> {
    constructor(props: ProfileProps) {
        super(props);
        this.state = {
            formattedDepositHistory: [],
            evaluatedDepositsTotal: '',
            balance: 0,
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
            rangerState: { connected },
            userLoggedIn,
        } = this.props;
        // tslint:disable-next-line: no-console
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
            this.props.rangerConnect({ withAuth: userLoggedIn });
        }

        getBalance(['btc', 'usd'])
            .then(data => {
                this.setState({
                    balance: (data.quote || {}).USD || 0,
                });
            })
            .catch(() => {
                this.setState({ balance: 0 });
            });
    }

    public componentWillReceiveProps(nextProps: ProfileProps) {
        const { currencies, depositHistory } = this.props;
        const { formattedDepositHistory } = this.state;

        if (
            nextProps.depositHistory.length &&
            currencies.length &&
            (JSON.stringify(nextProps.depositHistory) !== JSON.stringify(depositHistory) || !formattedDepositHistory.length)
        ) {
            if (nextProps.depositHistory[0].confirmations !== undefined) {
                const fiatDepositHistory = this.handleFilterDepositHistory(currencies, nextProps.depositHistory);
                this.setState({ formattedDepositHistory: this.handleFormatDepositHistory(fiatDepositHistory) });
            }
        }
    }

    public componentDidUpdate(prevProps: ProfileProps, prevState: State) {
        const { currencies, markets, tickers } = this.props;
        const { formattedDepositHistory } = this.state;
        if (
            formattedDepositHistory.length &&
            currencies.length &&
            markets.length &&
            tickers &&
            JSON.stringify(prevState.formattedDepositHistory) !== JSON.stringify(formattedDepositHistory)
        ) {
            this.setState({
                evaluatedDepositsTotal: estimateValue(
                    VALUATION_PRIMARY_CURRENCY,
                    currencies,
                    formattedDepositHistory,
                    markets,
                    tickers
                ),
            });
        }
    }

    public renderUserLevel(level: number) {
        const zeroCircleClassName = classnames('pg-profile-verification__level__circle', {
            'pg-profile-verification__level__circle--active': level === 4,
        });

        const firstCircleClassName = classnames('pg-profile-verification__level__circle', {
            'pg-profile-verification__level__circle--active': level === 5,
        });

        const secondCircleClassName = classnames('pg-profile-verification__level__circle', {
            'pg-profile-verification__level__circle--active': level > 5,
        });

        return (
            <div className="pg-profile-verification__level">
                <div className={zeroCircleClassName}>Starter</div>
                <div className="pg-profile-verification__level__line" />
                <div className={firstCircleClassName}>Expert</div>
                <div className="pg-profile-verification__level__line" />
                <div className={secondCircleClassName}>Master</div>
            </div>
        );
    }
    //tslint:disable
    public renderUpgradeLevelLink() {
        // tslint:disable-next-line:no-console
        console.log('...........label', this.props.label);
        return (
            <Link to={'/kyc-levels'} className="pg-profile-verification__upgrade-level">
                <FormattedMessage id="page.body.profile.header.account.profile.upgrade" />
            </Link>
        );
    }

    public renderUserAbilities(level: number, withdrawLimitData: WithdrawLimit) {
        if (level === 6 || !!withdrawLimitData.limit) {
            return (
                <div className="pg-profile-verification__abilities">
                    <FormattedMessage id="page.body.profile.header.account.profile.abilities.third" />
                </div>
            );
        }
        
        const withdrawalLimitCurrency = withdrawLimitData.withdraw.currency.toLocaleLowerCase().includes('usd')
            ? '$'
            : ` ${withdrawLimitData.withdraw.currency.toUpperCase()}`;

        // tslint:disable-next-line: prefer-switch
        if (level === 2 || level === 3) {
            const firstAbility = this.props.intl.formatMessage(
                { id: 'page.body.profile.header.account.profile.abilities.first.message1' },
                { amount: withdrawLimitData.withdraw.limit, currency: withdrawalLimitCurrency }
            );

            return (
                <div className="pg-profile-verification__abilities">
                    <p style={{ fontSize: '12px' }}>{firstAbility}</p>
                    <p style={{ fontSize: '12px' }}>
                        {this.props.intl.formatMessage({
                            id: 'page.body.profile.header.account.profile.abilities.first.message2',
                        })}
                    </p>
                </div>
            );
        }

        // tslint:disable-next-line: prefer-switch
        if (level === 4 || level === 5) {
            const firstAbility = this.props.intl.formatMessage(
                { id: 'page.body.profile.header.account.profile.abilities.second.message1' },
                { amount: withdrawLimitData.withdraw.limit, currency: withdrawalLimitCurrency }
            );

            const secondAbility = this.props.intl.formatMessage(
                { id: 'page.body.profile.header.account.profile.abilities.second.message2' }
                // { amount: withdrawLimitData.withdraw.limit, currency: withdrawalLimitCurrency },
            );

            return (
                <div className="pg-profile-verification__abilities">
                    <p>{firstAbility}</p>
                    <p>{secondAbility}</p>
                </div>
            );
        }

        return <div className="pg-profile-verification__abilities pg-profile-verification__abilities--blank" />;
    }

    public renderWithdrawLimit(userLevel: number, withdrawLimitData: WithdrawLimit) {
        if (!userLevel || userLevel === 1 || userLevel === 6) {
            return <div className="pg-profile-verification__withdraw-limit" />;
        }

        const percentage = Math.round((+withdrawLimitData.withdraw.amount / +withdrawLimitData.withdraw.limit) * 100);
        const withdrawalLimitCurrency = withdrawLimitData.withdraw.currency.toUpperCase();
        const currencyPrecision = 2;
        return (
            <div className="pg-profile-verification__withdraw-limit">
                <div className="pg-profile-verification__withdraw-limit__wrap">
                    <div className="pg-profile-verification__withdraw-limit__wrap__progress-bar">
                        <div
                            className="pg-profile-verification__withdraw-limit__wrap__progress-bar--filled"
                            style={{ width: `${percentage < 100 ? percentage : 100}%` }}
                        />
                    </div>
                    <span className="pg-profile-verification__withdraw-limit__wrap__text">
                        <FormattedMessage id="page.body.profile.header.account.profile.withdraw" />
                        &nbsp;{Decimal.format(withdrawLimitData.withdraw.amount, currencyPrecision)} /{' '}
                        {Decimal.format(withdrawLimitData.withdraw.limit, currencyPrecision)}
                        {withdrawalLimitCurrency}
                    </span>
                </div>
                <div className="pg-profile-verification__withdraw-limit__know-more" />
            </div>
        );
    }

    public renderDepositLimit(userLevel: number, withdrawLimitData: WithdrawLimit) {
        if (!userLevel || userLevel === 1 || userLevel === 6) {
            return (
                <div className="pg-profile-verification__deposit-limit">
                    <div className="pg-profile-verification__deposit-limit__wrap" />
                </div>
            );
        }
        const percentage = Math.round((+withdrawLimitData.deposit.amount / +withdrawLimitData.deposit.limit) * 100);
        const withdrawalLimitCurrency = withdrawLimitData.deposit.currency.toUpperCase();
        const currencyPrecision = 2;

        return (
            <div className="pg-profile-verification__deposit-limit">
                <div className="pg-profile-verification__deposit-limit__wrap">
                    <div className="pg-profile-verification__deposit-limit__wrap__progress-bar">
                        <div
                            className="pg-profile-verification__deposit-limit__wrap__progress-bar--filled"
                            style={{ width: `${percentage < 100 ? percentage : 100}%` }}
                        />
                    </div>
                    <span className="pg-profile-verification__deposit-limit__wrap__text">
                        <FormattedMessage id="page.body.profile.header.account.profile.deposit" />
                        &nbsp;{Decimal.format(withdrawLimitData.deposit.amount, currencyPrecision)} /{' '}
                        {Decimal.format(withdrawLimitData.deposit.limit, currencyPrecision)}
                        {withdrawalLimitCurrency}
                    </span>
                </div>
            </div>
        );
    }

    public render() {
        const { label, user, withdrawLimitData } = this.props;
        const userLevel = user.level;

        const withdrawLimitDataExists = withdrawLimitData && withdrawLimitData.withdraw && withdrawLimitData.deposit;
        return (
            <div className="pg-profile-verification">
                <div className="pg-profile-verification__title">
                    <FormattedMessage id="page.body.profile.header.account.profile" />
                </div>
                <div className="pg-profile-verification__user-level">
                    {this.renderUserLevel(userLevel)}
                </div>
                <div className="pg-profile-verification__know-more">
                    <a href="https://knowledge-base.emirex.com/emirex" target="_blank" rel="nofollow noopener">
                        <FormattedMessage id="page.body.profile.header.account.profile.knowMore" />
                    </a>
                </div>
                <hr className="pg-profile-verification__hr" />
                <div className="pg-profile-verification__know-more">
                    {userLevel < 6 && this.renderUpgradeLevelLink()}
                    {this.renderStatusIcon(label)}
                </div>
                {/*{(withdrawLimitDataExists || withdrawLimitMessageExists) && this.renderUserAbilities(userLevel, withdrawLimitData)}*/}
                {withdrawLimitDataExists && [4,5].includes(userLevel) && this.renderWithdrawLimit(userLevel, withdrawLimitData)}
                {withdrawLimitDataExists && [4,5].includes(userLevel) && this.renderDepositLimit(userLevel, withdrawLimitData)}
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
    };

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
    };

    
    private renderStatusIcon(label: Label[]) {
        const identityLabel = label.find(l => l.key === 'identity' && l.scope === 'private');
        const documentLabel = label.find(l => l.key === 'document' && l.scope === 'private');
        const questionnaireRecordedLabel = label.find(l => l.key === 'questionnaire' && l.value === 'recorded' && l.scope === 'private');
        if (questionnaireRecordedLabel) return null;
        
        if (identityLabel) {
            switch (identityLabel.value) {
                case 'pending' : {
                    return (
                        <div className="pg-profile-verification__know-more__icon-container">
                            <img className="pg-profile-verification__know-more__icon-img" width="20" height="20" src={clockSvg} alt='Pending' />
                            <div className="pg-profile-verification__know-more__icon-hover"><FormattedMessage id="resource.profile.identity.pending" /></div>
                        </div>
                    );
                }
    
                case 'denied' : {
                    return (
                        <div className="pg-profile-verification__know-more__icon-container">
                            <img className="pg-profile-verification__know-more__icon-img" width="20" height="20" src={infoSvg} alt='Denied' />
                            <div className="pg-profile-verification__know-more__icon-hover"><FormattedMessage id="resource.profile.identity.denied" /></div>
                        </div>
                    );
                }
                
                default: {
                }
            }
        }

        if (documentLabel) {
            switch (documentLabel.value) {
                case 'pending' : {
                    return (
                        <div className="pg-profile-verification__know-more__icon-container">
                            <img className="pg-profile-verification__know-more__icon-img" width="20" height="20" src={clockSvg} alt='Pending' />
                            <div className="pg-profile-verification__know-more__icon-hover"><FormattedMessage id="resource.profile.document.pending" /></div>
                        </div>
                    );
                }
    
                case 'denied' : {
                    return (
                        <div className="pg-profile-verification__know-more__icon-container">
                            <img className="pg-profile-verification__know-more__icon-img" width="20" height="20" src={infoSvg} alt='Denied' />
                            <div className="pg-profile-verification__know-more__icon-hover"><FormattedMessage id="resource.profile.document.denied" /></div>
                        </div>
                    );
                }
    
                case 'verified' : {
                    return (
                        <div className="pg-profile-verification__know-more__icon-container">
                            <img className="pg-profile-verification__know-more__icon-img" width="20" height="20" src={checkCircleSvg} alt='Verified' />
                            <div className="pg-profile-verification__know-more__icon-hover"><FormattedMessage id="resource.profile.document.verified" /></div>
                        </div>
                    );
                }
    
                default: {
                    return null;
                }
            }
        }

        return null;
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
    currentLanguage: selectCurrentLanguage(state),
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    fetchCurrencies: () => dispatch(currenciesFetch()),
    fetchHistory: params => dispatch(fetchHistory(params)),
    fetchLabels: () => dispatch(labelFetch()),
    fetchMarkets: () => dispatch(marketsFetch()),
    fetchTickers: () => dispatch(marketsTickersFetch()),
    fetchWithdrawLimit: () => dispatch(withdrawLimitFetch()),
    rangerConnect: (payload: RangerConnectFetch['payload']) => dispatch(rangerConnectFetch(payload)),
    fetchSuccess: payload => dispatch(alertPush(payload)),
});

const ProfileVerification = injectIntl(connect(mapStateToProps, mapDispatchProps)(ProfileVerificationComponent));

export { ProfileVerification };
