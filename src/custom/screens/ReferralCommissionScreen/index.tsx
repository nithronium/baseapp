import * as React from 'react';
import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { setDocumentTitle } from '../../../helpers';
import {
    referralCommissionFetch,
    ReferralCommissionSummaryInterface,
    ReferralCommissionTradingInterface,
    RootState,
    selectReferralCommissionIeo,
    selectReferralCommissionSummary,
    selectReferralCommissionTrading,
} from '../../../modules';
import {Card, ReferralHeader, Summary, TradingDetails} from '../../components/ReferralCommission';

interface DispatchProps {
    fetchReferralCommission: typeof referralCommissionFetch;
}

interface ReduxProps {
    trading: ReferralCommissionTradingInterface;
    ieo: ReferralCommissionTradingInterface;
    summary: ReferralCommissionSummaryInterface;
}

type Props = DispatchProps & InjectedIntlProps & ReduxProps;

class ReferralCommission extends React.Component<Props> {

    public componentDidMount() {
        setDocumentTitle('Referral Commission');
        this.props.fetchReferralCommission();
    }

    public render(){

        return (
            <div className="pg-referral-commission">
                <div className="top-holder">
                    <section id="top">
                        <ReferralHeader context={this.props.summary} link="#summary">
                            <Card context={this.props.trading} link="#trading"/>
                            <Card context={this.props.ieo} link="#ieo"/>
                        </ReferralHeader>
                    </section>
                </div>
                <section id="trading">
                    <div className="container">
                        <TradingDetails entity="trading" context={this.props.trading} header="Trading commission details"/>
                    </div>
                </section>
                <section id="ieo">
                    <div className="container">
                        <TradingDetails entity="ieo" context={this.props.ieo} header="IEO commission details"/>
                    </div>
                </section>
                <section id="summary">
                    <div className="container">
                        <Summary entity="summary" context={this.props.summary} header="Transaction commission details" />
                    </div>
                </section>
            </div>
          );
    }
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    trading: selectReferralCommissionTrading(state),
    ieo: selectReferralCommissionIeo(state),
    summary: selectReferralCommissionSummary(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    fetchReferralCommission: () => dispatch(referralCommissionFetch()),
});

export const ReferralCommissionScreen = injectIntl(connect(mapStateToProps, mapDispatchToProps)(ReferralCommission));
