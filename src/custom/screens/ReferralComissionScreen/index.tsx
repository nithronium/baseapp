import * as React from 'react';
import {Card, CardContextInterface, ReferralHeader, ReferralHeaderInterface, Summary, TradingDetails} from '../../components/ReferralComission';
//import './Comps/SCSS/styles.scss';

interface State {
    ieo: CardContextInterface;
    summary: ReferralHeaderInterface;
    trading: CardContextInterface;
}

class ReferralComissionScreen extends React.Component<{}, State> {

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

export {
    ReferralComissionScreen,
};
