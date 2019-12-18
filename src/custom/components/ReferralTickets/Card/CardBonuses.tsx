import * as React from 'react';
import { ReferralOverallPayload } from '../../../modules/referralTickets';

type Overall = ReferralOverallPayload['overall'];

interface CardProps {
    activeInactive?: boolean;
    context: ReferralOverallPayload['bonuses'];
    overall: Overall['bonuses'];
    link: string;
    title: string;
    message: ({}) => string;
}

class CardBonuses extends React.Component<CardProps>{

    public activeInactive(){
        if (this.props.activeInactive){
            return(
                <div className="card-middle">
                    <div className="card-details-row">
                        <div className="card-details-row__left">{this.props.message({id: 'tickets.bonus'}).toLowerCase()} {this.props.message({id: 'tickets.active'})}</div>
                        <div className="card-details-row__right">{this.props.overall.active}</div>
                    </div>
                    <div className="card-details-row">
                        <div className="card-details-row__left">{this.props.message({id: 'tickets.bonus'}).toLowerCase()} {this.props.message({id: 'tickets.active'})}</div>
                        <div className="card-details-row__right">{this.props.overall.inactive}</div>
                    </div>
                </div>
            );
        }else{
            return(
                <div className="card-middle"/>
            );
        }
    }

    public render(){

        let preloader;
        if (!(this.props.context)){
            preloader = (
                <div className="preloader"/>
            );
        }else{
            preloader = null;
        }
        return(

            <div className="Card">
                {preloader}
                <div className="card-top">
                    <div className="card-top__left">
                    <p className="card-top__left__header">{this.props.message({id: 'tickets.bonus'})}</p>
                        <span className="card-top__left__suffix">{this.props.message({id: 'tickets.tickets'})}</span>
                    </div>
                    <div className="card-top__right">
                        {this.props.overall.active + this.props.overall.inactive}
                    </div>
                </div>
                {this.activeInactive()}
                <div className="card-bottom">
                    <a href={this.props.link}>{this.props.message({id: 'tickets.view'})}</a>
                </div>
            </div>

        );
    }
}

export {CardBonuses};
