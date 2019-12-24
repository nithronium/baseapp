import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect, MapStateToProps } from 'react-redux';
import { setDocumentTitle } from '../../../helpers';
//tslint:disable
import {
    RootState,
    selectCurrentLanguage,
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
    Slider,
} from '../../components/ReferralTickets';

import { getActiveTicketsList, getReferralTickets, getOverall, getBonusTickets } from '../../../api';

// import { Loader } from '../../components/Loader';

interface ReduxProps {
    user: User;
    currentLanguage: string;
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
    L2count: number;
    count: number;
    activeTickets: number[];
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
        bonuses: [],
        loaded: false,
        disabledNext: false,
        disabledPrev: true,
        referrals: [],
        L2count: 0,
        count: 0,
        activeTickets: [],
    };

    public componentDidMount() {
        setDocumentTitle('Referral Tickets');
        let  { skip, limit, disabledNext } = this.state;
        const query = `/tickets/referral?limit=${limit}&skip=${skip}`;
        Promise.all([getReferralTickets(query), getOverall(), getBonusTickets(), getActiveTicketsList()]).then(values => {
            const { direct, overall } = values[1];
            const bonuses = values[2];
            const activeTickets = values[3]
            const referrals = values[0].list;
            const count = values[0].overall.count;
            const L2count = values[0].overall.L2count;
            const maxPages = Math.ceil(count / limit);
            if (maxPages <= 1) {
                disabledNext = true;
            }
            this.setState({
                bonuses,
                direct, 
                overall,
                maxPages,
                L2count,
                referrals,
                disabledNext,
                count,
                activeTickets,
            })
        }).catch(()=>{
            this.setState({
                disabledNext: true
            })
        })

        // getReferralTickets(query).then(([overallD, data]) => {
        //     const { bonuses, direct, overall } = overallD;
        //     const { list, overall  } = data;
        //     let disabledNext = false;
        //     const maxPages = Math.ceil(overall.referrals.count / limit);
        //     if (maxPages <= 1) {
        //         disabledNext = true;
        //     }
        //     this.setState({
        //         bonuses,
        //         direct,
        //         overall,
        //         referrals,
        //         loaded: true,
        //         disabledNext,
        //         maxPages,
        //     });
        // }).catch(() => {
        //     this.setState({
        //         disabledNext: true
        //     })
        // })
          
        
    }
   
    private getTotalTickets(_overall) {
        let total = 0;
        if (_overall.direct ) {
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
        const query = `/tickets/referral?limit=${limit}&skip=${skip}`;
        getReferralTickets(query).then(data => {
            const {  list } = data;
            disabledPrev = false;
            const referrals = list;
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
       const query = `/tickets/referral?limit=${limit}&skip=${skip}`;
        getReferralTickets(query).then(data => {
            const {  list } = data;
            disabledNext = false;            
            if (page === 1) {
                disabledPrev = true;
            }
            const referrals = list;
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
                            <ReferralBallance message={this.props.intl.formatMessage} totalTickets={this.getTotalTickets(this.state.overall)}>
                                <CardUser message={this.props.intl.formatMessage} title="Direct" context={this.state.direct} activeInactive={true} overall={this.state.overall.direct} link="#direct"/>
                                <CardReferrals message={this.props.intl.formatMessage} title="Referral" context={this.state.referrals} activeInactive={true} overall={this.state.overall.referrals} link="#referral"/>
                                <CardBonuses message={this.props.intl.formatMessage} title="Bonus" context={this.state.bonuses} activeInactive={false} overall={this.state.overall.bonuses} link="#bonus"/>
                            </ReferralBallance>
                        </section>
                        <section id="direct">
                            <DirectTicketDetails lang={this.props.currentLanguage} message={this.props.intl.formatMessage} context={this.state.direct} overall={this.state.overall.direct} user={this.props.user} />
                        </section>
                    </div>
                    <section id="referral">
                        <ReferralTicketDetails 
                            message={this.props.intl.formatMessage}
                            L2count={this.state.L2count}
                            count={this.state.count}
                            disabledPrev={this.state.disabledPrev}
                            disabledNext={this.state.disabledNext}
                            page={this.state.page}
                            turnLeft={this.turnLeft}
                            turnRight={this.turnRight}
                            context={this.state.referrals}
                            overall={this.state.overall.referrals}
                        />
                    </section>
                    <section id="bonus">
                        <BonusTicketDetails 
                            message={this.props.intl.formatMessage}
                            context={this.state.bonuses}
                        />
                    </section>
                    <section id="slider">
                        <Slider tickets={this.state.activeTickets} message={this.props.intl.formatMessage}/>
                    </section>
                </div>
            );

        // }
        
        
    }
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    user: selectUserInfo(state),
    currentLanguage: selectCurrentLanguage(state),
});


export const ReferralTicketsScreen = injectIntl(
    connect(
        mapStateToProps
    )(ReferralTickets)
);
