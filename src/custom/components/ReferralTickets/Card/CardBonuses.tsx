import * as React from 'react';
import { ReferralTicketsPayload } from '../../../modules/referralTickets';

interface CardProps {
    activeInactive?: boolean;
    context: ReferralTicketsPayload['bonuses'];
    link: string;
    title: string;
}

class CardBonuses extends React.Component<CardProps>{

    public getTotal(): number{
        let total = 0;
        if (!(this.props.context)) {
            return total;
        }

        this.props.context.map(record => {
            total += record.tickets;
            return true;
        });
        return total;
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
                <div className="card-middle"/>
                <div className="card-bottom">
                    <a href={this.props.link}>view details</a>
                </div>
            </div>

        );
    }
}

export {CardBonuses};
