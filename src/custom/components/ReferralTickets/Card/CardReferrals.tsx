import * as React from 'react';
import { ReferralTicketsPayload } from '../../../modules/referralTickets';

type CardContextProps = ReferralTicketsPayload['referrals'];
type Overall = ReferralTicketsPayload['overall'];
interface CardProps {
    activeInactive?: boolean;
    context: CardContextProps;
    overall: Overall['referrals'];
    link: string;
    title: string;
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
        if (this.props.activeInactive){
            return(
                <div className="card-middle">
                    <div className="card-details-row">
                        <div className="card-details-row__left">referrals active</div>
                        <div className="card-details-row__right">{this.props.overall.active}</div>
                    </div>
                    <div className="card-details-row">
                        <div className="card-details-row__left">referrals inactive</div>
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
                        <p className="card-top__left__header">{this.props.title}</p>
                        <span className="card-top__left__suffix">tickets</span>
                    </div>
                    <div className="card-top__right">
                        {this.props.overall.active + this.props.overall.inactive}
                    </div>
                </div>
                {this.activeInactive()}
                <div className="card-bottom">
                    <a href={this.props.link}>view details</a>
                </div>
            </div>

        );
    }
}

export {CardReferrals};
