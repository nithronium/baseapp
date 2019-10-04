import * as React from 'react';

interface Props {
    totalTickets: number;
}

class ReferralBallance extends React.Component<Props>{

    public render(){

        return(

            <div className="container recalculate">
                <div className="header">
                    <h1>Referral ballance</h1>
                </div>
                <div className="contexter">
                    <div className="cards-wrapper">
                        {this.props.children}
                    </div>
                    <div className="referral-summary">
                        <div className="total-container">Total tickets: {this.props.totalTickets}</div>
                        <div className="referral-container">
                            Your referral code: 234823428574378234
                            <a href="#!">&nbsp;</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export {ReferralBallance};
