import * as React from 'react';
import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
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
import {Card, ReferralHeader, TradingDetails} from '../../components/ReferralCommission';

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
        const balances = this.props.commissionsInfo.data.balances;
        const currencyId = this.props.commissionsInfo.currencyId;
        const trade = this.props.commissionsInfo.data.trade;
        const ieo = this.props.commissionsInfo.data.ieo;
        const currenciesNames = this.props.currencies.map(el => el.id);

        return (
            <div className="pg-referral-commission">
                <div className="top-holder">
                    <section id="top">
                        <ReferralHeader title={this.props.intl.formatMessage({id: 'referralCommission.rootScreen.totalEarnings'})} currencies={currenciesNames} context={balances} currencyId={currencyId} changeCurrentCurrency={this.changeCurrentCurrency} link="#summary">
                            <Card earned={balances.earned.trade} commission={balances.commission.trade} currencyId={currencyId} header={this.props.intl.formatMessage({id: 'referralCommission.rootScreen.tradingCommission'})} link="#trade"/>
                            <Card earned={balances.earned.ieo} commission={balances.commission.ieo} currencyId={currencyId} header={this.props.intl.formatMessage({id: 'referralCommission.rootScreen.ieoCommission'})} link="#ieo"/>
                        </ReferralHeader>
                    </section>
                </div>
                <section id="trade">
                    <div className="container">
                        <TradingDetails entity="trade" changePage={this.changePage} context={trade} currencyId={currencyId} header={this.props.intl.formatMessage({id: 'referralCommission.rootScreen.tradingCommissionDetails'})}/>
                    </div>
                </section>
                <section id="ieo">
                    <div className="container">
                        <TradingDetails entity="ieo" changePage={this.changePage} context={ieo} currencyId={currencyId} header={this.props.intl.formatMessage({id: 'referralCommission.rootScreen.ieoCommissionDetails'})}/>
                    </div>
                </section>
                {/* <section id="summary"><div className="container"><Summary entity="summary" context={this.props.balances} header="Transaction commission details" /></div></section> */}
            </div>
          );
    }
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
