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
    currenciesFetch,
    Currency,
    referralCommissionBalancesFetch,
    ReferralCommissionBalancesInterface,
    referralCommissionCurrencyChange,
    referralCommissionReferralsFetch,
    ReferralCommissionReferralsInterface,
    RootState,
    selectCurrencies,
    selectReferralCommission,
} from '../../../modules';
import { InfoCard, LevelCard } from '../../components/ReferralCommission';

interface DispatchProps {
    fetchReferralCommissionBalances: typeof referralCommissionBalancesFetch;
    fetchReferralCommissionReferrals: typeof referralCommissionReferralsFetch;
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

class ReferralCommission extends React.Component<Props> {

    public componentDidMount() {
        setDocumentTitle('Referral Commission');
        this.props.fetchCurrencies();
        this.props.fetchReferralCommissionBalances({currencyId: this.props.commissionsInfo.currencyId});
        this.props.fetchReferralCommissionReferrals({currencyId: this.props.commissionsInfo.currencyId, type:'trade'});
        this.props.fetchReferralCommissionReferrals({currencyId: this.props.commissionsInfo.currencyId, type:'ieo'});
    }

    public componentWillReceiveProps(nextProps) {
        const { currencies } = this.props;

        if (nextProps.currencies.length === 0 && nextProps.currencies !== currencies) {
            this.props.fetchCurrencies();
        }
    }

    public changeCurrentCurrency = currencyId => {
        const currencyIdFormatted = currencyId.toLowerCase();
        this.props.fetchReferralCommissionBalances({currencyId: currencyIdFormatted});
        this.props.fetchReferralCommissionReferrals({currencyId: currencyIdFormatted, type:'trade'});
        this.props.fetchReferralCommissionReferrals({currencyId: currencyIdFormatted, type:'ieo'});
        this.props.changeCurrency({currencyId: currencyId});
    }

    public changePage = (currencyId, type, skip, limit) => {
        this.props.fetchReferralCommissionReferrals({currencyId, type, skip, limit});
    }

    public render(){
        // const currencyId = this.props.commissionsInfo.currencyId;
        // const currenciesNames = this.props.currencies.map(el => el.id);
        // const currencyPrecision = (this.props.currencies.find(el => el.id === currencyId.toLowerCase()) || {}).precision;
        // const balances = this.props.commissionsInfo.data.balances;
        // const trade = this.props.commissionsInfo.data.trade;
        // const ieo = this.props.commissionsInfo.data.ieo;

        const levels = [{
            header: 'Commission: 20%',
            subheader: '≈ 0.02% from each trade!',
            caption: 'Your Referrals: 180',
        }, {
            header: 'Commission: 10%',
            subheader: '≈ 0.01% from each trade!',
            caption: 'Your Referrals: 1380',
        }];


        const tableData = new Array(5).fill(1).map(() => [
            'erfxxx.sd@gmail.com',
            '16 trades',
            '1003909.8970953 BTC',
            '9',
            '16 trades',
            '1003909.8970953 BTC',
            '1003909.8970953 BTC',
        ]);
        const headers = [
            'Email',
            '# of L1 trades',
            'Commision L1 (BTC)',
            '# of L2 users',
            '# of L2 trades',
            'Commision L2 (BTC)',
            'Total Amount',
        ];
        const title = '';

        const headers2 = [
            'Email',
            'Level',
            'IEO',
            'Invested',
            'Commision (BTC)',
            'Invested L2-L3',
            'Commision (BTC) L2-L3',
        ];

        const tableData2 = new Array(5).fill(1).map(() => [
            'erfxxx.sd@gmail.com',
            'Level 1',
            'EMRX',
            '1000 USD',
            '1003909.8970953 BTC',
            '',
            '',
        ]);

        const headers3 = [
            'L1 Referral',
            'Active',
            'Level 2 Referrals Total / Active',
        ];

        const tableData3 = new Array(5).fill(1).map(() => [
            'erfxxx.sd@gmail.com',
            'Yes',
            '5 / 2',
        ]);


        return (
            <div className="pg-referral-commission">
                <div className="container">
                    <div className="section">
                        <div className="section__header">
                            Referral Traiding
                        </div>

                        <div className="info-card__wrap">
                            <InfoCard
                                iconName="commission"
                                title="Commission rate"
                                text="MAX - 30%"
                            />
                            <InfoCard
                                iconName="referrals"
                                title="Your referrals"
                                text="1233"
                            />
                            <InfoCard
                                iconName="fee"
                                title="Trade fee"
                                text="0.2%"
                            />
                            <InfoCard
                                iconName="profit"
                                title="Your Profit"
                                text="9.0956767 BTC"
                                emrxConverted="23.3434 EMRX"
                                usdConverted="≈  456.8 USD"
                            />
                        </div>
                        <div>
                            <fieldset className={'copyable-text-field'} onClick={this.onCopy}>
                                <legend className={'copyable-title'}>
                                    Referral link
                                </legend>
                                <CopyableTextField
                                    className={'cr-deposit-crypto__copyable-area'}
                                    value={'www.google.com'}
                                    fieldId={'copy_referral_link'}
                                    copyButtonText={'COPY'}
                                />
                            </fieldset>
                        </div>
                    </div>

                    <div className="section--transparent">
                        {levels.map((item, index) => {
                            return <LevelCard
                                level={index + 1}
                                header={item.header}
                                subheader={item.subheader}
                                caption={item.caption}
                                key={index}
                            />;
                        })}
                    </div>

                    <div className="section table">
                        <div className="section__header">
                            <span>Referral Trading Details</span>
                            <span>Export to CSV</span>
                        </div>

                        <Table
                            data={tableData}
                            header={headers}
                            titleComponent={title}
                        />
                        <Pagination
                            firstElemIndex={0}
                            lastElemIndex={tableData.length}
                            total={105}
                            page={1}
                            nextPageExists={true}
                            onClickPrevPage={this.onClickPrevPage}
                            onClickNextPage={this.onClickNextPage}
                        />
                    </div>


                    <div className="section section-margin">
                        <div className="section__header">
                            Referral IEO
                        </div>

                        <div className="info-card__wrap">
                            <InfoCard
                                iconName="commission"
                                title="Commission rate"
                                text="MAX - 30%"
                            />
                            <InfoCard
                                iconName="referrals"
                                title="Your investors"
                                text="1233"
                            />
                            <InfoCard
                                iconName="profit"
                                title="Your Profit"
                                text="9.0956767 BTC"
                                emrxConverted="23.3434 EMRX"
                                usdConverted="≈  456.8 USD"
                            />
                        </div>
                        <div>
                            <fieldset className={'copyable-text-field'} onClick={this.onCopy}>
                                <legend className={'copyable-title'}>
                                    Referral link
                                </legend>
                                <CopyableTextField
                                    className={'cr-deposit-crypto__copyable-area'}
                                    value={'www.google.com'}
                                    fieldId={'copy_referral_link'}
                                    copyButtonText={'COPY'}
                                />
                            </fieldset>
                        </div>
                    </div>

                    <div className="section--transparent">
                        {levels.map((item, index) => {
                            return <LevelCard
                                level={index + 1}
                                header={item.header}
                                subheader={item.subheader}
                                caption={item.caption}
                                key={index}
                            />;
                        })}
                    </div>

                    <div className="section table">
                        <div className="section__header">
                            <span>Referral Trading Details</span>
                            <span>Export to CSV</span>
                        </div>

                        <Table
                            data={tableData2}
                            header={headers2}
                            titleComponent={title}
                        />
                        <Pagination
                            firstElemIndex={0}
                            lastElemIndex={tableData.length}
                            total={105}
                            page={1}
                            nextPageExists={true}
                            onClickPrevPage={this.onClickPrevPage}
                            onClickNextPage={this.onClickNextPage}
                        />
                    </div>


                    <div className="section section-margin">
                        <div className="section__header">
                            Referrals List
                        </div>

                        <div className="info-card__wrap">
                            <InfoCard
                                iconName="total-referrals"
                                title="Total referrals"
                                text="1231"
                            />
                            <InfoCard
                                iconName="active-referrals"
                                title="Active referrals (Deposit)"
                                text="720"
                            />
                            <InfoCard
                                iconName="active-ratio"
                                title="Active Ratio"
                                text="58.4%"
                            />
                            <InfoCard
                                iconName="profit"
                                title="Your Profit"
                                text="9.0956767 BTC"
                                emrxConverted="23.3434 EMRX"
                                usdConverted="≈ 456.8 USD"
                            />
                        </div>
                        <div>
                            <fieldset className={'copyable-text-field'} onClick={this.onCopy}>
                                <legend className={'copyable-title'}>
                                    Referral link
                                </legend>
                                <CopyableTextField
                                    className={'cr-deposit-crypto__copyable-area'}
                                    value={'www.google.com'}
                                    fieldId={'copy_referral_link'}
                                    copyButtonText={'COPY'}
                                />
                            </fieldset>
                        </div>
                    </div>

                    <div className="section--transparent">
                        {levels.map((item, index) => {
                            return <LevelCard
                                level={index + 1}
                                header={item.header}
                                subheader={item.subheader}
                                caption={item.caption}
                                key={index}
                            />;
                        })}
                    </div>

                    <div className="section table">
                        <div className="section__header">
                            <span>Your Referrals</span>
                            <span>Export to CSV</span>
                        </div>

                        <Table
                            data={tableData3}
                            header={headers3}
                            titleComponent={title}
                        />
                        <Pagination
                            firstElemIndex={0}
                            lastElemIndex={tableData.length}
                            total={105}
                            page={1}
                            nextPageExists={true}
                            onClickPrevPage={this.onClickPrevPage}
                            onClickNextPage={this.onClickNextPage}
                        />
                    </div>
                </div>
            </div>
          );
    }

    private onClickPrevPage = () => {
        setDocumentTitle('Referral Commission');
    };

    private onClickNextPage = () => {
        setDocumentTitle('Referral Commission');
    };


    private onCopy = () => {
        setDocumentTitle('copy');
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    commissionsInfo: selectReferralCommission(state),
    currencies: selectCurrencies(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    fetchCurrencies: () => dispatch(currenciesFetch()),
    fetchReferralCommissionBalances: payload => dispatch(referralCommissionBalancesFetch(payload)),
    fetchReferralCommissionReferrals: payload => dispatch(referralCommissionReferralsFetch(payload)),
    changeCurrency: payload => dispatch(referralCommissionCurrencyChange(payload)),
});

export const ReferralCommissionScreen = injectIntl(connect(mapStateToProps, mapDispatchToProps)(ReferralCommission));
