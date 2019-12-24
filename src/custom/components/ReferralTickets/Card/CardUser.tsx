import * as React from 'react';
import { ReferralOverallPayload } from '../../../modules/referralTickets';

type CardContextProps = ReferralOverallPayload['direct'];
type Overall = ReferralOverallPayload['overall'];
interface CardProps {
    context: CardContextProps;
    overall: Overall['direct'];
    link: string;
    title: string;
    message: ({}) => string;
}

class CardUser extends React.Component<CardProps>{

    public activeInactive(){
        return(
            <div className="card-middle">
                <div className="card-details-row">
                    <div className="card-details-row__left">{this.props.message({id: 'tickets.direct'}).toLowerCase()} {this.props.message({id: 'tickets.active'})}</div>
                    <div className="card-details-row__right">{this.props.overall.active}</div>
                </div>
                <div className="card-details-row">
                    <div className="card-details-row__left">{this.props.message({id: 'tickets.direct'}).toLowerCase()} {this.props.message({id: 'tickets.inactive'})}</div>
                    <div className="card-details-row__right">{this.props.overall.inactive}</div>
                </div>
            </div>
        );
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
                        <p className="card-top__left__header">{this.props.message({id: 'tickets.direct'})}</p>
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

export {CardUser};
