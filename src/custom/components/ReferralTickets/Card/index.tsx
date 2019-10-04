import * as React from 'react';

interface CardContextInterface {
    count: number;
    active: string;
    action?: string;
    l1_referral: number;
    l2_referrals: number;
    l2_active: number;
    subscription: string;
    network_post: string;
    network_post_url: string;
}

interface CardContextProps {
    legend: CardContextInterface[];
    activeInactive: boolean;
    title: string;
}

interface CardProps {
    context: CardContextProps;
    link: string;
}

class Card extends React.Component<CardProps>{


    public getTotal(mode = 'all', summMode = ''): number{

        let total = 0;
        if (!this.props.context.legend) {
            return total;
        }

        this.props.context.legend.map((record, index) => {

            switch (mode){
                case 'active':
                    if (record.active === 'yes'){
                        if (summMode === 'count'){
                            total += 1;
                        }else{
                            total += record.count;
                        }
                    }
                    break;

                case 'inactive':
                    if (record.active === 'no'){
                        if (summMode === 'count'){
                            total += 1;
                        }else{
                            total += record.count;
                        }
                    }
                    break;

                default: total += record.count; break;
            }
            return true;
        });
        return total;
    }


    public activeInactive(){
        if (this.props.context.activeInactive){
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
        if (!this.props.context.legend){
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
                        <p className="card-top__left__header">{this.props.context.title}</p>
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

export {Card, CardContextProps};
