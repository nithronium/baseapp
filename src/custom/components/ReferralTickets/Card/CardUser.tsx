import * as React from 'react';
import { ReferralTicketsPayload } from '../../../modules/referralTickets';

type CardContextProps = ReferralTicketsPayload['user'];

interface CardProps {
    context: CardContextProps;
    link: string;
    title: string;
}

class CardUser extends React.Component<CardProps>{

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
                        {this.props.context.emrxTickets + this.props.context.usdTickets}
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

export {CardUser};
