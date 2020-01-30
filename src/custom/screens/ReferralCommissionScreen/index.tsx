import * as React from 'react';
import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { setDocumentTitle } from '../../../helpers';
import {
    referralCommissionBalancesFetch,
    ReferralCommissionBalancesInterface,
    referralCommissionReferralsFetch,
    ReferralCommissionReferralsInterface,
    RootState,
    selectReferralCommission,
} from '../../../modules';
import {Card, ReferralHeader, TradingDetails} from '../../components/ReferralCommission';

interface DispatchProps {
    fetchReferralCommissionBalances: typeof referralCommissionBalancesFetch;
    fetchReferralCommissionReferrals: typeof referralCommissionReferralsFetch;
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
}

type Props = DispatchProps & InjectedIntlProps & ReduxProps;

class ReferralCommission extends React.Component<Props> {

    public state = {
        currentCurrencyId: 'btc',
    };

    public componentDidMount() {
        setDocumentTitle('Referral Commission');
        this.props.fetchReferralCommissionBalances({currencyId: this.props.commissionsInfo.currencyId});
        this.props.fetchReferralCommissionReferrals({currencyId: this.props.commissionsInfo.currencyId, type:'trade'});
        this.props.fetchReferralCommissionReferrals({currencyId: this.props.commissionsInfo.currencyId, type:'ieo'});
    }

    public changePage = (currencyId, type, skip, limit) => {
        this.props.fetchReferralCommissionReferrals({currencyId, type, skip, limit});
    }

    public render(){
        const balances = this.props.commissionsInfo.data.balances;
        const currencyId = this.props.commissionsInfo.currencyId;
        const trade = this.props.commissionsInfo.data.trade;
        const ieo = this.props.commissionsInfo.data.ieo;

        return (
            <div className="pg-referral-commission">
                <div className="top-holder">
                    <section id="top">
                        <ReferralHeader title="Total Earnings" context={balances} currencyId={currencyId} link="#summary">
                            <Card earned={balances.earned.trade} commission={balances.commission.trade} currencyId={currencyId} header="Trading commission" link="#trade"/>
                            <Card earned={balances.earned.ieo} commission={balances.commission.ieo} currencyId={currencyId} header="IEO commission" link="#ieo"/>
                        </ReferralHeader>
                    </section>
                </div>
                <section id="trade">
                    <div className="container">
                        <TradingDetails entity="trade" changePage={this.changePage} context={trade} currencyId={currencyId} header="Trading commission details"/>
                    </div>
                </section>
                <section id="ieo">
                    <div className="container">
                        <TradingDetails entity="ieo" changePage={this.changePage} context={ieo} currencyId={currencyId} header="IEO commission details"/>
                    </div>
                </section>
                {/* <section id="summary"><div className="container"><Summary entity="summary" context={this.props.balances} header="Transaction commission details" /></div></section> */}
            </div>
          );
    }
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    commissionsInfo: selectReferralCommission(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    fetchReferralCommissionBalances: payload => dispatch(referralCommissionBalancesFetch(payload)),
    fetchReferralCommissionReferrals: payload => dispatch(referralCommissionReferralsFetch(payload)),
});

export const ReferralCommissionScreen = injectIntl(connect(mapStateToProps, mapDispatchToProps)(ReferralCommission));
