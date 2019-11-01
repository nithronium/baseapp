import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { setDocumentTitle } from '../../../helpers';

import {
    referralTicketsFetch,
    ReferralTicketsPayload,
    RootState,
    selectReferralTicketsBonuses,
    selectReferralTicketsDirect,
    selectReferralTicketsLoading,
    selectReferralTicketsOverall,
    selectReferralTicketsReferrals,
    selectUserInfo,
    User,
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
    overall: ReferralTicketsPayload['overall'];
    direct: ReferralTicketsPayload['direct'];
    referrals: ReferralTicketsPayload['referrals'];
    loading: boolean;
    user: User;
}

type Props = DispatchProps & InjectedIntlProps & ReduxProps;
//tslint:disable
const Loader = ({ display }) => {
    return (
        <div
            style={{
                display: display ? 'block' : 'none',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 99,
                background: 'rgba(0,0,0,0.6)',
            }}
        >
            <img src={require('../../../assets/images/loader.svg')} alt="loader" className="loader" />
        </div>
    );
};

class ReferralTickets extends React.Component<Props> {

    //tslint:disable
    public componentDidMount() {
        setDocumentTitle('Referral Tickets');
        this.props.fetchReferralTickets();
    }

    private getTotalTickets() {
        let total = 0;
        const overall = this.props.overall;
        total += overall.direct.active;
        total += overall.direct.inactive;

        total += overall.bonuses.active;
        total += overall.bonuses.inactive;

        total += overall.referrals.active;
        total += overall.referrals.inactive;

        return total;
    }

    // tslint:disable
    public render() {
        const isNotLoaded = this.props.loading;
        if (isNotLoaded) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'scroll';
        }
        return (
            <div className="pg-referral-tickets">
                <Loader display={isNotLoaded} />
                <div className="top-holder">
                    <section id="top">
                        <ReferralBallance totalTickets={this.getTotalTickets()}>
                            <CardUser title="Direct" context={this.props.direct} activeInactive={true} overall={this.props.overall.direct} link="#direct"/>
                            <CardReferrals title="Referral" context={this.props.referrals} activeInactive={true} overall={this.props.overall.referrals} link="#referral"/>
                            <CardBonuses title="Bonus" context={this.props.bonuses} activeInactive={false} overall={this.props.overall.bonuses} link="#bonus"/>
                        </ReferralBallance>
                    </section>
                    <section id="direct">
                        <DirectTicketDetails context={this.props.direct} overall={this.props.overall.direct} user={this.props.user} />
                    </section>
                </div>
                <section id="referral">
                    <ReferralTicketDetails context={this.props.referrals} overall={this.props.overall.referrals} />
                </section>
                <section id="bonus">
                    <BonusTicketDetails context={this.props.bonuses} overall={this.props.overall.bonuses} />
                </section>
            </div>
        );
    }
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    bonuses: selectReferralTicketsBonuses(state),
    direct: selectReferralTicketsDirect(state),
    overall: selectReferralTicketsOverall(state),
    referrals: selectReferralTicketsReferrals(state),
    loading: selectReferralTicketsLoading(state),
    user: selectUserInfo(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    fetchReferralTickets: () => dispatch(referralTicketsFetch()),
});

export const ReferralTicketsScreen = injectIntl(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(ReferralTickets)
);
