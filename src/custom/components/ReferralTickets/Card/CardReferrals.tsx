import * as React from 'react';
import { ReferralTicketsPayload } from '../../../modules/referralTickets';

type CardContextProps = ReferralTicketsPayload['referrals'];

interface CardProps {
    activeInactive?: boolean;
    context: CardContextProps;
    link: string;
    title: string;
}

class CardReferrals extends React.Component<CardProps>{

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
                        <div className="card-details-row__right">{this.getTotal('active', 'count')}</div>
                    </div>
                    <div className="card-details-row">
                        <div className="card-details-row__left">referrals inactive</div>
                        <div className="card-details-row__right">{this.getTotal('inactive', 'count')}</div>
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
                        {this.getTotal()}
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
