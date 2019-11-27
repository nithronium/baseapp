import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect, MapStateToProps } from 'react-redux';
import { setDocumentTitle } from '../../../helpers';

import {
    RootState,
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

import { getReferralTickets } from '../../../api';

// import { Loader } from '../../components/Loader';

interface ReduxProps {
    user: User;
}
//tslint:disable
interface State {
    skip: number;
    page: number;
    maxPages: number;
    limit: number;
    overall: any;
    referrals: any;
    direct:any;
    bonuses: any;
    loaded: boolean;
    disabledNext: boolean;
    disabledPrev: boolean;
};

type Props =  InjectedIntlProps & ReduxProps;

class ReferralTickets extends React.Component<Props> {

    public constructor(props) {
        super(props);
        this.turnLeft = this.turnLeft.bind(this);
        this.turnRight = this.turnRight.bind(this);
    }

 
    public state: State = {
        skip: 0,
        page: 1,
        limit: 10,
        maxPages: 0,
        overall: {
            direct: {
              active: 0,
              inactive: 0
            },
            referrals: {
              count: 0,
              subreferralsCount: 0,  
              active: 0,
              inactive: 0
            },
            bonuses: {
              active: 0,
              inactive: 0
            }
          },
          direct: {
            ticketsForRegistration: {
              active: 0,
              inactive: 0
            },
            usd: {
              balance: 0,
              active: 0,
              inactive: 0
            },
            emrx: {
              balance: 0,
              active: 0,
              inactive: 0
            }
          },
          referrals: [],
          bonuses: [],
        loaded: false,
        disabledNext: false,
        disabledPrev: true
    };

    public componentDidMount() {
        setDocumentTitle('Referral Tickets');
        let  { skip, limit } = this.state;
        const query = `/tickets?limit=${limit}&skip=${skip}`;
        getReferralTickets(query).then(data => {
            const { bonuses, direct, overall, referrals } = data;
            let disabledNext = false;
            const maxPages = Math.ceil(overall.referrals.count / limit);
            if (maxPages <= 1) {
                disabledNext = true;
            }
            this.setState({
                bonuses,
                direct,
                overall,
                referrals,
                loaded: true,
                disabledNext,
                maxPages,
            });
        }).catch(() => {
            this.setState({
                disabledNext: true
            })
        })
          
        
    }
   
    private getTotalTickets(_overall) {
        let total = 0;
        if (_overall.direct && _overall.bonuses && _overall.referrals ) {
            const overall = _overall;
        total += overall.direct.active;
        total += overall.direct.inactive;

        total += overall.bonuses.active;
        total += overall.bonuses.inactive;

        total += overall.referrals.active;
        total += overall.referrals.inactive;

        }
        

        return total;
    }


    public turnRight() {
        let { limit, page, skip, disabledNext, disabledPrev, maxPages } = this.state; 
        skip += 10;
        page += 1;        
        this.setState({
            loaded: false
        })      
       const query = `/tickets?limit=${limit}&skip=${skip}`;
        getReferralTickets(query).then(data => {
            const {  referrals } = data;
            disabledPrev = false;
            
            if (maxPages === page) {
                disabledNext = true;
            }
            this.setState({
                referrals,
                loaded: true,
                skip,
                page,
                disabledNext,
                disabledPrev
            });
        });
    }

    public turnLeft() {
        let { limit, page, skip, disabledPrev, disabledNext } = this.state; 
        skip -= 10;
        page -= 1;   
        this.setState({
            loaded: false
        })           
       const query = `/tickets?limit=${limit}&skip=${skip}`;
        getReferralTickets(query).then(data => {
            const {  referrals } = data;
            disabledNext = false;            
            if (page === 1) {
                disabledPrev = true;
            }
            this.setState({
                referrals,
                loaded: true,
                skip,
                page,
                disabledPrev,
                disabledNext
            });
        });        
    }

 

    
    public render() {
        // if (!this.state.loaded) {
        //     return <Loader display={true}/>
        // } else {
            return (
                <div className="pg-referral-tickets">
                    <div className="top-holder">
                        <section id="top">
                            <ReferralBallance totalTickets={this.getTotalTickets(this.state.overall)}>
                                <CardUser title="Direct" context={this.state.direct} activeInactive={true} overall={this.state.overall.direct} link="#direct"/>
                                <CardReferrals title="Referral" context={this.state.referrals} activeInactive={true} overall={this.state.overall.referrals} link="#referral"/>
                                <CardBonuses title="Bonus" context={this.state.bonuses} activeInactive={false} overall={this.state.overall.bonuses} link="#bonus"/>
                            </ReferralBallance>
                        </section>
                        <section id="direct">
                            <DirectTicketDetails context={this.state.direct} overall={this.state.overall.direct} user={this.props.user} />
                        </section>
                    </div>
                    <section id="referral">
                        <ReferralTicketDetails disabledPrev={this.state.disabledPrev} disabledNext={this.state.disabledNext} page={this.state.page}  turnLeft={this.turnLeft} turnRight={this.turnRight} context={this.state.referrals} overall={this.state.overall.referrals} />
                    </section>
                    <section id="bonus">
                        <BonusTicketDetails context={this.state.bonuses} overall={this.state.overall.bonuses} />
                    </section>
                </div>
            );

        // }
        
        
    }
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    user: selectUserInfo(state),
});


export const ReferralTicketsScreen = injectIntl(
    connect(
        mapStateToProps
    )(ReferralTickets)
);
