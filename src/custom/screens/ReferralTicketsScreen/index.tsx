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

class ReferralTickets extends React.Component<Props> {

    public constructor(props) {
        super(props);
        this.turnLeft = this.turnLeft.bind(this);
        this.turnRight = this.turnRight.bind(this);
    }

    //tslint:disable
    public state = {
        skip: 0,
        count: 0,
        page: 0,
        disableLeft: true,
        disableRight: false,
        limit: 10,
        totalPages: 0,
    };

    public componentWillMount() {
       
    }

    public componentDidMount() {
        setDocumentTitle('Referral Tickets');
        let  { skip, limit } = this.state;
        this.getTickets(skip, limit);        
        
    }
    public componentWillReceiveProps() {
        let  { disableRight } = this.state;
        const totalPages = this.getTotalPages(); 
      
        if (totalPages <= 1) {
            disableRight = true;
        } else {
            disableRight = false;
        };

        this.setState({
            totalPages,
            disableRight
        })
    }

  
    private getTotalPages() {
        const { overall } = this.props;
        return Math.ceil((overall.referrals.active + overall.referrals.inactive) / this.state.limit);  
        // return 10;
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
    private getTickets(skip, limit) {
        const query = `/tickets?limit=${limit}&skip=${skip}`;
        this.props.fetchReferralTickets(query);        
    }

    public turnRight() {
        let { totalPages, limit, page, skip, disableLeft, disableRight } = this.state; 
        page += 1;
        skip += 10;
        disableLeft = false;
        // console.log(totalPages);
        if (totalPages <= page + 1) {
            disableRight = true;
            this.setState({
                page,
                skip,
                disableLeft,
                disableRight
            });
        } else {
            this.setState({
                page,
                skip,
                disableLeft,
                disableRight
            });
            this.getTickets(skip, limit);

        }
    }

    public turnLeft() {
        let {  totalPages, limit, page, skip, disableLeft, disableRight } = this.state;
            page -= 1;
            skip -= 10;
        if (page <= 0) {
            page = 0;
            disableLeft = true;
            skip = 0;
            page = 0;
            this.setState({
                page,
                skip,
                disableLeft,
                disableRight
            });
        }  else  {
            if (totalPages - 1 > page) {
                disableRight = false;
            }
            this.setState({
                page,
                skip,
                disableLeft,
                disableRight
            });
            this.getTickets(skip, limit);
            // console.log(skip);
        }
        
    }

    
    public render() {
        
        return (
            <div className="pg-referral-tickets">
                <div className="top-holder">
                    <section id="top">
                        <ReferralBallance totalTickets={this.getTotalTickets()}>
                            <CardUser title="Direct" context={this.props.direct} activeInactive={true} overall={this.props.overall.direct} link="#direct"/>
                            <CardReferrals title="Referral" context={this.props.referrals} activeInactive={true} overall={this.props.overall.referrals} link="#referral"/>
                            <CardBonuses title="Bonus" context={this.props.bonuses} activeInactive={false} overall={this.props.overall.bonuses} link="#bonus"/>
                        </ReferralBallance>
                    </section>
                    <section id="direct">
                        <DirectTicketDetails context={this.props.direct} overall={this.props.overall.direct} user={this.props.user} loading={this.props.loading}/>
                    </section>
                </div>
                <section id="referral">
                    <ReferralTicketDetails page={this.state.page} disableLeft={this.state.disableLeft} disableRight={this.state.disableRight} turnLeft={this.turnLeft} turnRight={this.turnRight} context={this.props.referrals} overall={this.props.overall.referrals} loading={this.props.loading}/>
                </section>
                <section id="bonus">
                    <BonusTicketDetails context={this.props.bonuses} overall={this.props.overall.bonuses} loading={this.props.loading}/>
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
    fetchReferralTickets: (data) => {
        return dispatch(referralTicketsFetch(data));
    },
});

export const ReferralTicketsScreen = injectIntl(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(ReferralTickets)
);
