import * as React from 'react';
import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';

import { CopyableTextField } from '../../../components/CopyableTextField';

import { Pagination, Table } from '@openware/components';

import { setDocumentTitle } from '../../../helpers';
import {
    alertPush,
    currenciesFetch,
    Currency,
    referralCommissionBalancesFetch,
    ReferralCommissionBalancesInterface,
    referralCommissionCurrencyChange,
    referralCommissionParticipantsFetch,
    referralCommissionReferralsFetch,
    ReferralCommissionReferralsInterface,
    RootState,
    selectCurrencies,
    selectReferralCommission,
} from '../../../modules';
import { InfoCard, LevelCard } from '../../components/ReferralCommission';

import { getExchangeRates } from '../../../api';

interface DispatchProps {
    fetchReferralCommissionBalances: typeof referralCommissionBalancesFetch;
    fetchReferralCommissionReferrals: typeof referralCommissionReferralsFetch;
    fetchReferralCommissionParticipants: typeof referralCommissionParticipantsFetch;
    changeCurrency: typeof referralCommissionCurrencyChange;
}

interface ReduxProps {
    commissionsInfo: {
        currencyId: string;
        data: {
            trade: ReferralCommissionReferralsInterface;
            ieo: ReferralCommissionReferralsInterface;
            balances: ReferralCommissionBalancesInterface;
        };
    };
    currencies: Currency[];
}

type Props = DispatchProps & InjectedIntlProps & ReduxProps;

interface ConvertedResponse {
    symbol: string;
    amount: number;
    quote: [{
        symbol: string;
        price: number;
    }];
}

interface State {
    tradingPage: number;
    ieoPage: number;
    referralsPage: number;
    pageSize: number;
    tradeConverted?: ConvertedResponse;
    ieoConverted?: ConvertedResponse;
    referralConverted?: ConvertedResponse;
}

class ReferralCommission extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            tradingPage: 1,
            ieoPage: 1,
            referralsPage: 1,
            pageSize: 10,
        };
    }

    private tradeFields = ['email', 'trades', 'commission',
        'tradersUnder', 'tradesUnder', 'commissionUnder'];

    private ieoFields = ['email', 'ieo', 'investment', 'commission',
        'investmentUnder', 'commissionUnder'];

    public componentDidMount() {
        setDocumentTitle('Referral Commission');
        const { tradingPage, ieoPage, referralsPage, pageSize } = this.state;
        this.props.fetchCurrencies();
        this.props.fetchReferralCommissionBalances({currencyId: this.props.commissionsInfo.currencyId});
        this.props.fetchReferralCommissionParticipants({ limit: pageSize, skip: (referralsPage - 1) * pageSize });
        this.props.fetchReferralCommissionReferrals({
            currencyId: this.props.commissionsInfo.currencyId, type:'trade',
            limit: pageSize,
            skip: (tradingPage - 1) * pageSize,
        });
        this.props.fetchReferralCommissionReferrals({
            currencyId: this.props.commissionsInfo.currencyId, type:'ieo',
            limit: pageSize,
            skip: (ieoPage - 1) * pageSize,
        });
    }

    public componentWillReceiveProps(nextProps) {
        const { currencies } = this.props;

        if (nextProps.currencies.length === 0 && nextProps.currencies !== currencies) {
            this.props.fetchCurrencies();
        }
        // tslint:disable-next-line
        this.loadConvertedValues(nextProps);
    }

    public getCurrencies = () => {
        const { user } = this.props;
        return {
            fiat: user.activeCurrency || 'USD',
            crypto: user.cryptoCurrency || 'BTC',
            emrx: 'EMRX',
        };
    };

    public loadConvertedValues = async nextProps => {
        const { balances } = this.props;
        const user = this.getUser();
        console.log('user', user);
        if (
            balances.earned && (
                balances.earned.trade !== nextProps.balances.earned.trade ||
                balances.earned.ieo !== nextProps.balances.earned.ieo ||
                user.activeCurrency !== nextProps.user.activeCurrency
                // user.cryptoCurrency !== nextProps.user.cryptoCurrency
            )
        ) {
            const totalReferrals = balances.participants.reduce((acc, item) => {
                return Number(acc) + Number(item.total);
            }, 0);

            const currencies = this.getCurrencies();
            const currenciesArray = [currencies.crypto, currencies.emrx, currencies.fiat];

            const tradeConverted = await getExchangeRates(
                'USD', nextProps.balances.earned.trade, currenciesArray,
            );
            const ieoConverted = await getExchangeRates(
                'USD', nextProps.balances.earned.ieo, currenciesArray,
            );
            const referralConverted = await getExchangeRates(
                'USD', nextProps.balances.earned.trade / totalReferrals, currenciesArray,
            );
            this.setState({
                tradeConverted,
                ieoConverted,
                referralConverted,
            });

            console.log('converted',
            tradeConverted,
            ieoConverted,
            referralConverted,
            );
        }
    };

    public getCoverteValue = (converted: ConvertedResponse|undefined, curr: string) => {
        if (!converted) {
            return 0;
        }
        return converted.quote.filter(item => {
            return item.symbol.toLowerCase() === curr.toLowerCase();
        })[0].price;
    };

    public changeCurrentCurrency = currencyId => {
        // const currencyIdFormatted = currencyId.toLowerCase();

        const { tradingPage, ieoPage, referralsPage, pageSize } = this.state;
        this.props.fetchCurrencies();
        this.props.fetchReferralCommissionBalances({currencyId: this.props.commissionsInfo.currencyId});
        this.props.fetchReferralCommissionParticipants({ limit: pageSize, skip: (referralsPage - 1) * pageSize });
        this.props.fetchReferralCommissionReferrals({
            currencyId: this.props.commissionsInfo.currencyId, type:'trade',
            limit: pageSize,
            skip: (tradingPage - 1) * pageSize,
        });
        this.props.fetchReferralCommissionReferrals({
            currencyId: this.props.commissionsInfo.currencyId, type:'ieo',
            limit: pageSize,
            skip: (ieoPage - 1) * pageSize,
        });
    }

    public changePage = (currencyId, type, skip, limit) => {
        this.props.fetchReferralCommissionReferrals({currencyId, type, skip, limit});
    }

    public getUser = () => {
        let { user } = this.props;
        // console.log('user', user);
        user = user && user.userData;
        user = user && user.user;
        return user || {};
    };

    public render(){
        const { trade, ieo, participants, balances } = this.props;
        const { tradeConverted, ieoConverted, referralConverted } = this.state;
        const user = this.getUser();
        console.log('user', user);

        const currencies = this.getCurrencies();

        const levelTrade = balances.commission.trade.map((val, index) => {
            const participant = balances.participants[index] || { total: 0 };
            const refs = participant.total;
            return {
                header: `Commission: ${val * 100}%`,
                subheader: `≈ ${val / 10}% from each trade!`,
                caption: `Your Referrals: ${refs}`,
            };
        });

        const tradeMaxCommission = Math.floor(balances.commission.trade.reduce((acc, item) => {
            return Number(acc) + Number(item);
        }, 0) * 1000) / 10;

        const tradeRefs = balances.participants.reduce((acc, item) => {
            return Number(acc) + Number(item.total);
        }, 0);


        const levelIeo = balances.commission.ieo.map((val, index) => {
            const inverstor = balances.investors[index] || { total: 0 };
            const refs = inverstor.total;
            return {
                header: `Commission: ${val * 100}%`,
                subheader: `= ${val * 100}% from each investment!`,
                caption: `Your Investors: ${refs}`,
            };
        });

        const ieoMaxCommission = Math.floor(balances.commission.ieo.reduce((acc, item) => {
            return Number(acc) + Number(item);
        }, 0) * 1000) / 10;

        const ieoInvestors = balances.investors.reduce((acc, item) => {
            return Number(acc) + Number(item.total);
        }, 0);


        const levelPart = balances.participants.map(item => {
            return {
                header: `Your referrals: ${item.total}`,
                caption: `Active referrals: ${item.active}`,
            };
        });

        const totalReferrals = balances.participants.reduce((acc, item) => {
            return Number(acc) + Number(item.total);
        }, 0);
        const activeReferrals = balances.participants.reduce((acc, item) => {
            return Number(acc) + Number(item.active);
        }, 0);


        let tradeData = trade.referrals.map(data => {
            const res = this.tradeFields.map(key => data[key]);
            res.push(Number(data.commissions) + Number(data.commissionUnder));
            return res;
        });

        tradeData = this.addTradeTotal(tradeData);
        tradeData = this.addTradeText(tradeData);

        const tradeHeaders = [
            'Email',
            '# of L1 trades',
            'Commision L1 (BTC)',
            '# of L2-L5 users',
            '# of L2-L5 trades',
            'Commision L2-L5 (BTC)',
            'Total Amount',
        ];
        const title = '';

        const ieoHeaders = [
            'Email',
            'IEO',
            'Invested',
            'Commision (BTC)',
            'Invested L2-L5',
            'Commision (BTC) L2-L5',
        ];

        let ieoData = ieo.referrals.map(row => {
            return this.ieoFields.map(key => row[key]);
        });
        ieoData = this.addIeoTotal(ieoData);
        ieoData = this.addIeoText(ieoData);

        const headersPart = [
            'L1 Referral',
            'Active',
            'Level 2 Referrals Total / Active',
            'Level 3 Referrals Total / Active',
            'Level 4 Referrals Total / Active',
            'Level 5 Referrals Total / Active',
        ];

        let partData = participants.participants.map(row => {
            const res = [row.email, row.active];
            for (const key of ['l2', 'l3', 'l4', 'l5']) {
                res.push(`${row[`total_${key}`]} / ${row[`active_${key}`]} `);
            }
            return res;
        });

        partData = this.addPartTotal(partData);

        console.log('origin', window.location.origin);

        return (
            <div className="pg-referral-commission">
                <div className="pg-referral-commission__container">
                    <div className="section section-margin">
                        <div className="section__header">
                            Referral Traiding
                        </div>

                        <div className="info-card__wrap">
                            <InfoCard
                                iconName="commission"
                                title="Commission rate"
                                text={`MAX = ${tradeMaxCommission}%`}
                            />
                            <InfoCard
                                iconName="referrals"
                                title="Your referrals"
                                text={tradeRefs}
                            />
                            <InfoCard
                                iconName="fee"
                                title="Trade fee"
                                text="0.2%"
                            />
                            <InfoCard
                                iconName="profit"
                                title="Your Profit"
                                text={`${this.getCoverteValue(tradeConverted, currencies.crypto)} ${currencies.crypto}`}
                                emrxConverted={`${this.getCoverteValue(tradeConverted, currencies.emrx)} ${currencies.emrx}`}
                                usdConverted={`≈ ${this.getCoverteValue(tradeConverted, currencies.fiat)} ${currencies.fiat}`}
                            />
                        </div>
                        <div>
                            <fieldset className={'copyable-text-field'} onClick={this.onCopy}>
                                <legend className={'copyable-title'}>
                                    Referral link
                                </legend>
                                <CopyableTextField
                                    className={'cr-deposit-crypto__copyable-area'}
                                    value={`${window.location.origin}/signup?refid=${user.uid}`}
                                    fieldId={'copy_referral_link'}
                                    copyButtonText={'COPY'}
                                />
                            </fieldset>
                        </div>
                    </div>

                    <div className="section--transparent">
                        {levelTrade.map((item, index) => {
                            return <LevelCard
                                level={Number(index) + 1}
                                header={item.header}
                                subheader={item.subheader}
                                caption={item.caption}
                                key={index}
                            />;
                        })}
                    </div>

                    {tradeData.length && <div className="section table">
                        <div className="section__header">
                            <span>Referral Trading Details</span>
                            {/* <span>Export to CSV</span> */}
                        </div>
                        <Table
                            data={tradeData}
                            header={tradeHeaders}
                            titleComponent={title}
                        />
                        <Pagination
                            firstElemIndex={Number(trade.skip) + 1}
                            lastElemIndex={Number(trade.skip) + Number(trade.referrals.length)}
                            total={trade.count}
                            page={Math.ceil(trade.skip / trade.limit)}
                            nextPageExists={true}
                            onClickPrevPage={this.onClickPrevTrade}
                            onClickNextPage={this.onClickNextTrade}
                        />
                    </div>}


                    <div className="section section-margin">
                        <div className="section__header">
                            Referral IEO
                        </div>

                        <div className="info-card__wrap">
                            <InfoCard
                                iconName="commission"
                                title="Commission rate"
                                text={`MAX = ${ieoMaxCommission}%`}
                            />
                            <InfoCard
                                iconName="referrals"
                                title="Your investors"
                                text={ieoInvestors}
                            />
                            <InfoCard
                                iconName="profit"
                                title="Your Profit"
                                text={`${this.getCoverteValue(ieoConverted, currencies.crypto)} ${currencies.crypto}`}
                                emrxConverted={`${this.getCoverteValue(ieoConverted, currencies.emrx)} ${currencies.emrx}`}
                                usdConverted={`≈ ${this.getCoverteValue(ieoConverted, currencies.fiat)} ${currencies.fiat}`}
                            />
                        </div>
                        <div>
                            <fieldset className={'copyable-text-field'} onClick={this.onCopy}>
                                <legend className={'copyable-title'}>
                                    Referral link
                                </legend>
                                <CopyableTextField
                                    className={'cr-deposit-crypto__copyable-area'}
                                    value={`${window.location.origin}/signup?refid=${user.uid}`}
                                    fieldId={'copy_referral_link'}
                                    copyButtonText={'COPY'}
                                />
                            </fieldset>
                        </div>
                    </div>

                    <div className="section--transparent">
                        {levelIeo.map((item, index) => {
                            return <LevelCard
                                level={Number(index) + 1}
                                header={item.header}
                                subheader={item.subheader}
                                caption={item.caption}
                                key={index}
                            />;
                        })}
                    </div>

                    {ieoData.length && <div className="section table">
                        <div className="section__header">
                            <span>IEO Investment Details</span>
                            {/* <span>Export to CSV</span> */}
                        </div>

                        <Table
                            data={ieoData}
                            header={ieoHeaders}
                            titleComponent={title}
                        />
                        <Pagination
                            firstElemIndex={Number(ieo.skip) + 1}
                            lastElemIndex={Number(ieo.skip) + Number(ieo.referrals.length)}
                            total={ieo.count}
                            page={Math.ceil(ieo.skip / ieo.limit)}
                            nextPageExists={true}
                            onClickPrevPage={this.onClickPrevIeo}
                            onClickNextPage={this.onClickNextIeo}
                        />
                    </div>}


                    <div className="section section-margin">
                        <div className="section__header">
                            Referrals List
                        </div>

                        <div className="info-card__wrap">
                            <InfoCard
                                iconName="total-referrals"
                                title="Total referrals"
                                text={totalReferrals}
                            />
                            <InfoCard
                                iconName="active-referrals"
                                title="Active referrals (Deposit)"
                                text={activeReferrals}
                            />
                            <InfoCard
                                iconName="active-ratio"
                                title="Active Ratio"
                                text={`${Math.floor(activeReferrals / totalReferrals * 10) / 10}%`}
                            />
                            <InfoCard
                                iconName="profit"
                                title="Profit per referral"
                                text={`${this.getCoverteValue(referralConverted, currencies.crypto)} ${currencies.crypto}`}
                                emrxConverted={`${this.getCoverteValue(referralConverted, currencies.emrx)} ${currencies.emrx}`}
                                usdConverted={`≈ ${this.getCoverteValue(referralConverted, currencies.fiat)} ${currencies.fiat}`}
                            />
                        </div>
                        <div>
                            <fieldset className={'copyable-text-field'} onClick={this.onCopy}>
                                <legend className={'copyable-title'}>
                                    Referral link
                                </legend>
                                <CopyableTextField
                                    className={'cr-deposit-crypto__copyable-area'}
                                    value={`${window.location.origin}/signup?refid=${user.uid}`}
                                    fieldId={'copy_referral_link'}
                                    copyButtonText={'COPY'}
                                />
                            </fieldset>
                        </div>
                    </div>

                    <div className="section--transparent">
                        {levelPart.map((item, index) => {
                            return <LevelCard
                                level={Number(index) + 1}
                                header={item.header}
                                subheader={item.subheader}
                                caption={item.caption}
                                key={index}
                            />;
                        })}
                    </div>

                    {partData.length && <div className="section table">
                        <div className="section__header">
                            <span>Your Referrals</span>
                            {/* <span>Export to CSV</span> */}
                        </div>

                        <Table
                            data={partData}
                            header={headersPart}
                            titleComponent={title}
                        />
                        <Pagination
                            firstElemIndex={Number(participants.skip) + 1}
                            lastElemIndex={Number(participants.skip) + Number(participants.participants.length)}
                            total={participants.count}
                            page={Math.ceil(participants.skip / participants.limit)}
                            nextPageExists={true}
                            onClickPrevPage={this.onClickPrevPart}
                            onClickNextPage={this.onClickNextPart}
                        />
                    </div>}
                </div>
            </div>
          );
    }


    private addTradeTotal = list => {
        // return list;
        const newList = [...list];
        const totalRow: Array<string|number> = ['Total amount'];

        const fields = this.tradeFields.slice(1);
        for (let i = 1; i < fields.length + 1; i++) {
            const sum = newList.reduce((acc, row) => Number(acc) + Number(row[i]), 0);
            totalRow[i] = sum;
        }
        totalRow.push(Number(totalRow[2]) + Number(totalRow[5]));

        newList.push(totalRow);
        return newList;
    };

    private addTradeText = list => {
        const trades = x => `${x} trades`;
        const curr = x => `${x} BTC`;
        const users = x => `${x} users`;
        const map = [x => x, trades, curr, users, trades, curr, curr];
        return list.map(row => {
            return row.map((item, index) => {
                return map[index](item);
            });
        });
    };

    private addIeoTotal = list => {
        const totalCommission = list.reduce((acc, row) => Number(acc) + Number(row[3]), 0);
        const totalCommissionL2 = list.reduce((acc, row) => Number(acc) + Number(row[5]), 0);

        const totalRow: Array<string|number> = [
            'Total amount', '', '',
            totalCommission, '', totalCommissionL2,
        ];
        return [...list, totalRow];
    };

    private addIeoText = list => {
        const map = [
            x => x, x => (x || '').toUpperCase(),
            (x, curr) => `${x} ${curr}`,
            x => `${x} BTC`,
            (x, curr) => `${x} ${curr}`,
            x => `${x} BTC`,
        ];
        const { ieo } = this.props;

        return list.map((row, rowIndex) => {
            if (rowIndex === list.length - 1) {
                return row;
            }
            return row.map((item, colIndex) => {
                const originalRow = ieo.referrals[rowIndex];

                if ([1, 3].includes(colIndex)) {
                    return map[colIndex](item, originalRow.investment_currency_id);
                } else {
                    return map[colIndex](item, '');
                }
            });
        });
    };

    private addPartTotal = list => {
        const res = ['Total amount', ''];
        const { participants } = this.props;

        for (const key of ['l2', 'l3', 'l4', 'l5']) {
            const sumActive = participants.participants.reduce((acc, item) => {
                return Number(acc) + Number(item[`active_${key}`]);
            }, 0);
            const sumTotal = participants.participants.reduce((acc, item) => {
                return Number(acc) + Number(item[`total_${key}`]);
            }, 0);
            res.push(`${sumTotal} / ${sumActive}`);
        }

        return [...list, res];
    };

    private onClickNextTrade = () => {
        // const { trade } = this.props;
        // const { count, limit } = trade;
        const { tradingPage } = this.state;
        // const totalPages = Math.ceil(count / limit);

        // if (tradingPage >= totalPages) {
        //     return;
        // }
        this.setState({
            tradingPage: tradingPage + 1,
        }, this.fetchTrade);
    };

    private onClickPrevTrade = () => {
        const { tradingPage } = this.state;

        if (tradingPage <= 1) {
            return;
        }
        this.setState({
            tradingPage: tradingPage - 1,
        }, this.fetchTrade);
    };

    private fetchTrade = () => {
        const { pageSize, tradingPage } = this.state;
        this.props.fetchReferralCommissionReferrals({
            currencyId: this.props.commissionsInfo.currencyId, type:'trade',
            limit: pageSize,
            skip: (tradingPage - 1) * pageSize,
        });
    };


    private onClickNextIeo = () => {
        const { ieo } = this.props;
        const { count, limit } = ieo;
        const { ieoPage } = this.state;
        const totalPages = Math.ceil(count / limit);

        if (ieoPage >= totalPages) {
            return;
        }
        this.setState({
            ieoPage: ieoPage + 1,
        }, this.fetchIeo);
    };

    private onClickPrevIeo = () => {
        const { ieoPage } = this.state;

        if (ieoPage <= 1) {
            return;
        }
        this.setState({
            ieoPage: ieoPage - 1,
        }, this.fetchIeo);
    };

    private fetchIeo = () => {
        const { pageSize, ieoPage } = this.state;
        this.props.fetchReferralCommissionReferrals({
            currencyId: this.props.commissionsInfo.currencyId, type:'ieo',
            limit: pageSize,
            skip: (ieoPage - 1) * pageSize,
        });
    };


    private onClickNextPart = () => {
        const { participants } = this.props;
        const { count, limit } = participants;
        const { referralsPage } = this.state;
        const totalPages = Math.ceil(count / limit);

        if (referralsPage >= totalPages) {
            return;
        }
        this.setState({
            referralsPage: referralsPage + 1,
        }, this.fetchPart);
    };

    private onClickPrevPart = () => {
        const { referralsPage } = this.state;

        if (referralsPage <= 1) {
            return;
        }
        this.setState({
            referralsPage: referralsPage - 1,
        }, this.fetchPart);
    };

    private fetchPart = () => {
        const { pageSize, referralsPage } = this.state;
        this.props.fetchReferralCommissionParticipants({
            currencyId: this.props.commissionsInfo.currencyId,
            limit: pageSize,
            skip: (referralsPage - 1) * pageSize,
        });
    };

    private onCopy = () => {
        this.props.fetchSuccess({ message: ['referralCommission.copied'], type: 'success' });
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    commissionsInfo: selectReferralCommission(state),
    currencies: selectCurrencies(state),
    balances: selectReferralCommission(state).data.balances,
    trade: selectReferralCommission(state).data.trade,
    ieo: selectReferralCommission(state).data.ieo,
    participants: selectReferralCommission(state).data.participants,
    user: state.user.profile,
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    fetchCurrencies: () => dispatch(currenciesFetch()),
    fetchReferralCommissionBalances: payload => dispatch(referralCommissionBalancesFetch(payload)),
    fetchReferralCommissionReferrals: payload => dispatch(referralCommissionReferralsFetch(payload)),
    fetchReferralCommissionParticipants: payload => dispatch(referralCommissionParticipantsFetch(payload)),
    fetchSuccess: payload => dispatch(alertPush(payload)),
    changeCurrency: payload => dispatch(referralCommissionCurrencyChange(payload)),
});

export const ReferralCommissionScreen = injectIntl(connect(mapStateToProps, mapDispatchToProps)(ReferralCommission));
