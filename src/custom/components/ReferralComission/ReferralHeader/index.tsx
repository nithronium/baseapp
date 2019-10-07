import * as React from 'react';

export interface ReferralHeaderInterface {
    title: string;
    btc: number;
    usd: number;
    legend: [];
}

interface Props {
    context: ReferralHeaderInterface;
    link: string;
}

class ReferralHeader extends React.Component<Props>{

    public render(){

        return(

            <div className="container recalculate">
                <div className="header">
                    <h1>Referral ballance</h1>
                    <a href="#!" className="round-button default arrow">BTC</a>
                </div>
                <div className="contexter">
                    <div className="cards-wrapper">
                        {this.props.children}
                        <div className="summary recalculate">
                            <div className="title">{this.props.context.title}</div>
                            <div className="summary-container">
                                <div className="btc">{this.props.context.btc} BTC</div>
                                <div className="usd">{this.props.context.usd} USD</div>
                                <a className="details-link" href={this.props.link}>view details</a>
                                <div className="referral-code">
                                    <div className="header">
                                        Your referral code:
                                    </div>
                                    <div className="code">
                                        234823428574378234
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export {ReferralHeader};
