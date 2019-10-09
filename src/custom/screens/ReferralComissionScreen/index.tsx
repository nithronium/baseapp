import * as React from 'react';
import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { referralComissionFetch, ReferralComissionPayload, RootState, selectReferralComission } from '../../../modules';
import {Card, CardContextInterface, ReferralHeader, ReferralHeaderInterface, Summary, TradingDetails} from '../../components/ReferralComission';

interface DispatchProps {
    fetchReferralComission: typeof referralComissionFetch;
}

interface ReduxProps {
    referralComission: ReferralComissionPayload;
    loading: boolean;
}

type Props = DispatchProps & InjectedIntlProps & ReduxProps;

interface State {
    ieo: CardContextInterface;
    summary: ReferralHeaderInterface;
    trading: CardContextInterface;
}

class ReferralComission extends React.Component<Props, State> {

    constructor(props){
        super(props);

        this.state = {
            trading: {
                details: [],
                legend: [],
                earned: 0,
                title: '',
            },
            ieo: {
                details: [],
                legend: [],
                earned: 0,
                title: '',
            },
            summary: {
                title: '',
                legend: [],
                btc: 0,
                usd: 0,
            },
        };
    }

    public componentDidMount(){
        fetch('/json/ReferralComission/transitions.json')
        .then(async res => res.json())
        .then(
            result => {
                this.setState({
                    ieo: result['ieo-comission'],
                    trading: result['trading-comission'],
                    summary: result.summary,
                });
            },

            error => {
                //console.log(error);
            },
        );
    }

    public render(){

        return (
            <div className="pg-referral-comission">
                <div className="top-holder">
                    <section className="top">
                        <ReferralHeader context={this.state.summary} link="#summary">
                            <Card context={this.state.trading} link="#trading"/>
                            <Card context={this.state.ieo} link="#ieo"/>
                        </ReferralHeader>
                    </section>
                </div>
                <section className="trading">
                    <div className="container">
                        <TradingDetails entity="trading" context={this.state.trading} header="Trading commision details"/>
                    </div>
                </section>
                <section className="ieo">
                    <div className="container">
                        <TradingDetails entity="ieo" context={this.state.ieo} header="IEO comission commision details"/>
                    </div>
                </section>
                <section className="summary">
                    <div className="container">
                        <Summary entity="summary" context={this.state.summary} header="Transaction commision details" />
                    </div>
                </section>
            </div>
          );
    }
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    referralComission: selectReferralComission(state).data,
    loading: selectReferralComission(state).loading,
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    fetchReferralComission: () => dispatch(referralComissionFetch()),
});

export const ReferralComissionScreen = injectIntl(connect(mapStateToProps, mapDispatchToProps)(ReferralComission));
