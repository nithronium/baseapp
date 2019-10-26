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
    BonusPayload,
    ReferralPayload,
    referralTicketsFetch,
    ReferralTicketsPayload,
    RootState,
    selectReferralTicketsBonuses,
    selectReferralTicketsDirect,
    selectReferralTicketsLoading,
    selectReferralTicketsReferrals,
} from '../../../modules';
import {
    BonusTicketDetails,
    CardBonuses,
    CardReferrals,
    CardUser,
    DirectTicketDetails,
    ReferralBallance,
    ReferralTicketDetails,
} from '../../components/ReferralTickets';

interface DispatchProps {
    fetchReferralTickets: typeof referralTicketsFetch;
}

interface ReduxProps {
    bonuses: ReferralTicketsPayload['bonuses'];
    direct: ReferralTicketsPayload['user'];
    referrals: ReferralTicketsPayload['referrals'];
    loading: boolean;
}

type Props = DispatchProps & InjectedIntlProps & ReduxProps;

class ReferralTickets extends React.Component<Props> {

    public componentDidMount() {
        setDocumentTitle('Referral Tickets');
        this.props.fetchReferralTickets();
    }

    private getTotalTickets() {
        let total = 0;

        if (this.props.direct) {
            total += this.props.direct.emrxTickets;
            total += this.props.direct.usdTickets;
            total += 1;// this.props.direct.ticketForRegistration;
        }

        if (this.props.referrals) {
            this.props.referrals.map((record: ReferralPayload) => {
                total += /* record.isActive * */ (record.tickets + record.subreferrals);
            });
        }

        if (this.props.bonus) {
            this.props.bonus.map((record: BonusPayload) => {
                total += record.tickets;
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
                            <CardUser title="Direct" context={this.props.direct} link="#direct"/>
                            <CardReferrals title="Referral" context={this.props.referrals} activeInactive={true} link="#referral"/>
                            <CardBonuses title="Bonus" context={this.props.bonuses} link="#bonus"/>
                        </ReferralBallance>
                    </section>
                    <section id="direct">
                        <DirectTicketDetails context={this.props.direct} />
                    </section>
                </div>
                <section id="referral">
                    <div className="container">
                        <ReferralTicketDetails context={this.props.referrals} />
                    </div>
                </section>
                <section id="bonus">
                    <div className="container">
                        <BonusTicketDetails context={this.props.bonuses} />
                    </div>
                </section>
            </div>
        );
    }
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    bonuses: selectReferralTicketsBonuses(state),
    direct: selectReferralTicketsDirect(state),
    referrals: selectReferralTicketsReferrals(state),
    loading: selectReferralTicketsLoading(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    fetchReferralTickets: () => dispatch(referralTicketsFetch()),
});

export const ReferralTicketsScreen = injectIntl(connect(mapStateToProps, mapDispatchToProps)(ReferralTickets));

