import * as React from 'react';

interface Props {
    commission: number[];
    earned: number;
    currencyId: string;
    header: string;
    link: string;
}

class Card extends React.Component<Props>{
    public render(){

        // let preloader;
        // if (!(this.props. && this.props.context.legend)){
        //     preloader = (
        //         <div className="preloader"/>
        //     );
        // }else{
        //     preloader = null;
        // }
        return(

            <div className="Card">
                {/* {preloader} */}
                <div className="card-top">
                    <div className="card-top__left">
                        <p className="card-top__left__header">{this.props.header}</p>
                    </div>
                </div>
                <div className="card-middle">
                    <div className="card-details-row">
                        <div className="card-details-row__left">Referral L1</div>
                        <div className="card-details-row__right">{this.props.commission[0] || 0}</div>
                    </div>
                    <div className="card-details-row">
                        <div className="card-details-row__left">Referral L2</div>
                        <div className="card-details-row__right">{this.props.commission[1] || 0}</div>
                    </div>
                </div>
                <div className="card-middle">
                    <div className="card-earned-header">Earned</div>
                    <div className="card-details-row">
                        {this.props.earned || 0} {this.props.currencyId.toUpperCase()}
                    </div>
                </div>
                <div className="card-bottom">
                    <a className="details-link" href={this.props.link}>view details</a>
                </div>
            </div>

        );
    }
}

export {Card};
