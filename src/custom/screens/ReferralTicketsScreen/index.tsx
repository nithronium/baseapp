import * as React from 'react';
import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import {
    connect,
    MapDispatchToPropsFunction,
    MapStateToProps,
} from 'react-redux';
import { setDocumentTitle } from '../../../helpers';
import {
    referralTicketsFetch,
    ReferralTicketsPayload,
    RootState,
    selectReferralTickets,
} from '../../../modules';
import {
    BonusTicketDetails,
    Card,
    CardContextProps,
    DirectTicketDetails,
    ReferralBallance,
    ReferralTicketDetails,
} from '../../components/ReferralTickets';

interface DispatchProps {
    fetchReferralTickets: typeof referralTicketsFetch;
}

interface ReduxProps {
    referralTickets: ReferralTicketsPayload;
    loading: boolean;
}

type Props = DispatchProps & InjectedIntlProps & ReduxProps;

interface State {
  directDetails: CardContextProps;
  referralDetails: CardContextProps;
  bonusDetails: CardContextProps;
}

class ReferralTickets extends React.Component<Props, State> {

    public componentDidMount() {
        setDocumentTitle('Referral Tickets');
        this.props.fetchReferralTickets();
    }

    private getTotalTickets() {
        let total = 0;
        if (!this.props.referralTickets) { return total; }
        if (this.props.referralTickets.directDetails && this.props.referralTickets.directDetails.legend) {

            this.props.referralTickets.directDetails.legend.map((record, index) => {
                total += record.count;
                return true;
            });
        }

        if (this.props.referralTickets.referralDetails && this.props.referralTickets.referralDetails.legend) {

            this.props.referralTickets.referralDetails.legend.map((record, index) => {
                total += record.count;
                return true;
            });
        }

        if (this.props.referralTickets.bonusDetails && this.props.referralTickets.bonusDetails.legend) {

            this.props.referralTickets.bonusDetails.legend.map((record, index) => {
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
                            <Card context={this.props.referralTickets && this.props.referralTickets.directDetails} link="#direct"/>
                            <Card context={this.props.referralTickets && this.props.referralTickets.referralDetails} link="#referral"/>
                            <Card context={this.props.referralTickets && this.props.referralTickets.bonusDetails} link="#bonus"/>
                        </ReferralBallance>
                    </section>
                    <section id="direct">
                        <DirectTicketDetails context={this.props.referralTickets && this.props.referralTickets.directDetails} />
                    </section>
                </div>
                <section id="referral">
                    <div className="container">
                        <ReferralTicketDetails context={this.props.referralTickets && this.props.referralTickets.referralDetails} />
                    </div>
                </section>
                <section id="bonus">
                    <div className="container">
                        <BonusTicketDetails context={this.props.referralTickets && this.props.referralTickets.bonusDetails} />
                    </div>
                </section>
            </div>
        );
    }
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    referralTickets: selectReferralTickets(state).data,
    loading: selectReferralTickets(state).loading,
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    fetchReferralTickets: () => dispatch(referralTicketsFetch()),
});

export const ReferralTicketsScreen = injectIntl(connect(mapStateToProps, mapDispatchToProps)(ReferralTickets));
