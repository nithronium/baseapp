import * as React from 'react';
import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { setDocumentTitle } from '../../../helpers';
import {
    referralComissionFetch,
    ReferralComissionSummaryInterface,
    ReferralComissionTradingInterface,
    RootState,
    selectReferralComissionIeo,
    selectReferralComissionSummary,
    selectReferralComissionTrading,
} from '../../../modules';
import {Card, ReferralHeader, Summary, TradingDetails} from '../../components/ReferralComission';

interface DispatchProps {
    fetchReferralComission: typeof referralComissionFetch;
}

interface ReduxProps {
    trading: ReferralComissionTradingInterface;
    ieo: ReferralComissionTradingInterface;
    summary: ReferralComissionSummaryInterface;
}

type Props = DispatchProps & InjectedIntlProps & ReduxProps;

class ReferralComission extends React.Component<Props> {

    public componentDidMount() {
        setDocumentTitle('Referral Comission');
        this.props.fetchReferralComission();
    }

    public render(){

        return (
            <div className="pg-referral-comission">
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
                        <TradingDetails entity="trading" context={this.props.trading} header="Trading commision details"/>
                    </div>
                </section>
                <section id="ieo">
                    <div className="container">
                        <TradingDetails entity="ieo" context={this.props.ieo} header="IEO comission commision details"/>
                    </div>
                </section>
                <section id="summary">
                    <div className="container">
                        <Summary entity="summary" context={this.props.summary} header="Transaction commision details" />
                    </div>
                </section>
            </div>
          );
    }
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    trading: selectReferralComissionTrading(state),
    ieo: selectReferralComissionIeo(state),
    summary: selectReferralComissionSummary(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    fetchReferralComission: () => dispatch(referralComissionFetch()),
});

export const ReferralComissionScreen = injectIntl(connect(mapStateToProps, mapDispatchToProps)(ReferralComission));
