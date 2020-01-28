import * as React from 'react';
import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { setDocumentTitle } from '../../../helpers';
import {
    referralCommissionBalancesFetch,
    referralCommissionReferralsFetch,
    ReferralCommissionBalancesInterface,
    ReferralCommissionReferralsInterface,
    RootState,
    selectReferralCommissionIeo,
    selectReferralCommissionBalances,
    selectReferralCommissionTrading,
} from '../../../modules';
import {Card, ReferralHeader, Summary, TradingDetails} from '../../components/ReferralCommission';

interface DispatchProps {
    fetchReferralCommissionBalances: typeof referralCommissionBalancesFetch;
    fetchReferralCommissionReferrals: typeof referralCommissionReferralsFetch;
}

interface ReduxProps {
    trade: ReferralCommissionReferralsInterface;
    ieo: ReferralCommissionReferralsInterface;
    balances: ReferralCommissionBalancesInterface;
}

type Props = DispatchProps & InjectedIntlProps & ReduxProps;

class ReferralCommission extends React.Component<Props> {

    public componentDidMount() {
        setDocumentTitle('Referral Commission');
        this.props.fetchReferralCommissionBalances({currencyId: this.props.currencyId});
    }

    public render(){

        return (
            <div className="pg-referral-commission">
                <div className="top-holder">
                    <section id="top">
                        <ReferralHeader context={this.props.balances} link="#summary">
                            <Card context={this.props.balances.trade} link="#trading"/>
                            <Card context={this.props.balances.ieo} link="#ieo"/>
                        </ReferralHeader>
                    </section>
                </div>
                <section id="trading">
                    <div className="container">
                        <TradingDetails entity="trading" context={this.props.trade} header="Trading commission details"/>
                    </div>
                </section>
                <section id="ieo">
                    <div className="container">
                        <TradingDetails entity="ieo" context={this.props.ieo} header="IEO commission details"/>
                    </div>
                </section>
                {/* <section id="summary">
                    <div className="container">
                        <Summary entity="summary" context={this.props.balances} header="Transaction commission details" />
                    </div>
                </section> */}
            </div>
          );
    }
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    trade: selectReferralCommissionTrading(state),
    ieo: selectReferralCommissionIeo(state),
    balances: selectReferralCommissionBalances(state),
    currency: selectReferralCommissionCurrency(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    fetchReferralCommissionBalances: (payload) => dispatch(referralCommissionBalancesFetch(payload)),
    fetchReferralCommissionReferrals: (payload) => dispatch(referralCommissionReferralsFetch(payload)),
});

export const ReferralCommissionScreen = injectIntl(connect(mapStateToProps, mapDispatchToProps)(ReferralCommission));
