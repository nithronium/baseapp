import * as React from 'react';

export interface CardContextInterface {
    details: [];
    legend: [];
    earned: number;
    title: string;
}

interface Props {
    context: CardContextInterface;
    link: string;
}

class Card extends React.Component<Props>{

    public getSummary = () => {
        if (this.props.context.details){
            return this.props.context.details;
        }else{
            return [];
        }
    }

    public summaryRows = () => {
        return this.getSummary().map((row, index) => {
            return(
                <div className="card-details-row" key={index}>
                    <div className="card-details-row__left">{Object.keys(row)[0]}</div>
                    <div className="card-details-row__right">{row[Object.keys(row)[0]]}</div>
                </div>
            );
        });
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
                    </div>
                </div>
                <div className="card-middle">
                    {this.summaryRows()}
                </div>
                <div className="card-middle">
                    <div className="card-earned-header">Earned</div>
                    <div className="card-details-row">
                        {this.props.context.earned} BTC
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
