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
    selectReferralTicketsBonuses,
    selectReferralTicketsDirect,
    selectReferralTicketsLoading,
    selectReferralTicketsReferrals,
} from '../../../modules';
import {
    /*BonusTicketDetails,
    CardBonuses,*/
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
                            <CardUser title="Direct" context={this.props.direct} link="#direct"/>
                            <CardReferrals title="Referral" context={this.props.referrals} activeInactive={true} link="#referral"/>
                            {/*<CardBonuses title="Bonus" context={this.props.bonuses} link="#bonus"/>*/}
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
                {// tslint:disable-next-line: jsx-no-multiline-js
                /*<section id="bonus">
                    <div className="container">
                        <BonusTicketDetails context={this.props.bonuses} />
                    </div>
                </section>*/}
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

/*
'direct-ballance': {
        title: 'Direct',
        activeInactive: false,
        legend : [
            {
                count: 3,
                action: 'ballance 150 USD',
            },
            {
                count: 4,
                action: 'EMRX tokens worth 100 USD',
            },
        ],
    },
    'referral-ballance': {
        title: 'Referral',
        activeInactive: true,
        legend: [
            {
                count: 9,
                l1_referral: 'erfxxx@gmail.com',
                active: 'yes',
                l2_referrals: 7,
                l2_active: 7,
            },
            {
                count: 0,
                l1_referral: 'erfxxx@gmail.com',
                active: 'no',
                l2_referrals: 10,
                l2_active: 8,
            },
            {
                count: 5,
                l1_referral: 'erfxxx@gmail.com',
                active: 'yes',
                l2_referrals: 15,
                l2_active: 3,
            },
        ],
    },
    'bonus-ballance': {
        title: 'Bonus',
        activeInactive: false,
        legend: [
            {
                count: 1,
                subscription: 'Facebook subscription',
                subscription_url: 'https://facebook.com',
                network_post: 'Facebook post',
                network_post_url: 'https://facebook.com',
            },
            {
                count: 0,
                subscription: 'No subscription',
                subscription_url: null,
                network_post: 'Telegram post',
                network_post_url: 'https://telegram.com',
            },
            {
                count: 1,
                subscription: 'Twitter subscription',
                subscription_url: 'https://twitter.com',
                network_post: 'Twitter post',
                network_post_url: 'https://twitter.com',
            },
        ],
    },
*/
