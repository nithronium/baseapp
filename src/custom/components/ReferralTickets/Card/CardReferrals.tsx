import * as React from 'react';
import { ReferralOverallPayload } from '../../../modules/referralTickets';
//tslint:disable
// type CardContextProps = ReferralOverallPayload['referrals'];
type Overall = ReferralOverallPayload['overall'];
interface CardProps {
    context: any;
    overall: Overall['referrals'];
    link: string;
    title: string;
    message: ({})=>string;
}

class CardReferrals extends React.Component<CardProps>{

    public sumSubreferrals(): number {
        let total = 0;
        this.props.context.map(record => {
            total += record.subreferrals;
        });
        return total;
    }

    public sumActiveSubreferrals(): number {
        let total = 0;
        this.props.context.map(record => {
            total += record.activeSubreferrals;
        });
        return total;
    }

    public getTotal(mode = 'all', summMode = ''): number{
        let total = 0;
        if (!(this.props.context)) {
            return total;
        }

        this.props.context.map(record => {

            switch (mode){
                case 'active':
                    if (record.isActive){
                        if (summMode === 'count'){
                            total += 1;
                        }else{
                            total += record.tickets;
                        }
                    }
                    break;

                case 'inactive':
                    if (!record.isActive){
                        if (summMode === 'count'){
                            total += 1;
                        }else{
                            total += record.tickets;
                        }
                    }
                    break;

                default: total += record.tickets; break;
            }
            return true;
        });
        return total;
    }


    public activeInactive(){
        return(
            <div className="card-middle">
                <div className="card-details-row">
                    <div className="card-details-row__left">{this.props.message({id: 'tickets.ref'}).toLowerCase()} {this.props.message({id: 'tickets.active'})}</div>
                    <div className="card-details-row__right">{this.props.overall.active}</div>
                </div>
                <div className="card-details-row">
                    <div className="card-details-row__left">{this.props.message({id: 'tickets.ref'}).toLowerCase()} {this.props.message({id: 'tickets.inactive'})}</div>
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
                    <p className="card-top__left__header">{this.props.message({id: 'tickets.ref'})}</p>
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

export {CardReferrals};
