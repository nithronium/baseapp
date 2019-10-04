import * as React from 'react';
import BonusTicketDetails from '../../components/ReferralTickets/BonusTicketDetails';
import Card from '../../components/ReferralTickets/Card';
import DirectTicketDetails from '../../components/ReferralTickets/DirectTicketDetails';
import ReferralBallance from '../../components/ReferralTickets/ReferralBallance';
import ReferralTicketDetails from '../../components/ReferralTickets/ReferralTicketDetails';

interface State {
  directDetails: {
    legend: Array<{
      count: number;
    }>,
  };
  referralDetails: {
    legend: Array<{
      count: number;
    }>,
  };
  bonusDetails: {
    legend: Array<{
      count: number;
    }>,
  };
}

class ReferralTicketsScreen extends React.Component<{}, State> {

    constructor(props){
        super(props);

        this.state = {
            directDetails: {
                legend: [],
            },
            referralDetails: {
                legend: [],
            },
            bonusDetails: {
                legend: [],
            },
        };
    }

    public componentDidMount() {
        fetch('/json/ReferralTickets/referal.json')
        .then(async res => res.json())
        .then(
            result => {
                this.setState({
                    directDetails: result['direct-ballance'],
                    referralDetails: result['referral-ballance'],
                    bonusDetails: result['bonus-ballance'],
                });
            },

            error => {
                //console.log(error);
            },
        );
    }

    private getTotalTickets() {
        let total = 0;

        if (this.state.directDetails.legend) {

            this.state.directDetails.legend.map((record, index) => {
                total += record.count;
                return true;
            });
        }

        if (this.state.referralDetails.legend) {

            this.state.referralDetails.legend.map((record, index) => {
                total += record.count;
                return true;
            });
        }

        if (this.state.bonusDetails.legend) {

            this.state.bonusDetails.legend.map((record, index) => {
                total += record.count;
                return true;
            });
        }

        return total;
    }

    // tslint:disable-next-line:member-ordering
    public render() {
        return (
            <div className="pg-referral-tickets">
                <div className="top-holder">
                    <section id="top">
                        <ReferralBallance totalTickets={this.getTotalTickets()}>
                            <Card context={this.state.directDetails} link="#direct"/>
                            <Card context={this.state.referralDetails} link="#referral"/>
                            <Card context={this.state.bonusDetails} link="#bonus"/>
                        </ReferralBallance>
                    </section>
                    <section id="direct">
                        <DirectTicketDetails context={this.state.directDetails} />
                    </section>
                </div>
                <section id="referral">
                    <div className="container">
                        <ReferralTicketDetails context={this.state.referralDetails} />
                    </div>
                </section>
                <section id="bonus">
                    <div className="container">
                        <BonusTicketDetails context={this.state.bonusDetails} />
                    </div>
                </section>
            </div>);
        }
    }

export {
  ReferralTicketsScreen,
};
