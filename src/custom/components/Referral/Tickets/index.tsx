import * as React from 'react';

export class Tickets extends React.Component{

    public render(){
        return(
            <section id="tickets">
            <div className="container">
                <h2>How to get tickets to enter the prizes draw?</h2>
                <div id="jin-block1">
                    <div className="jin-ul">
                        <div className="jin-li">
                            <div className="digit">1.</div>
                            <div className="text">Signs up and receives one pending ticket.</div>
                        </div>
                        <div className="jin-li">
                            <div className="digit">2.</div>
                            <div className="text">Sends his referral code to Mike.</div>
                        </div>
                    </div>
                    <div className="jin-p">
                        <div className="text">Signs up and receives one pending ticket.</div>
                        <div className="text">Receives two pending tickets for Lorenzo signing up.</div>
                    </div>
                </div>
                <div id="jin-block2">
                    <div className="jin-ul">
                        <div className="jin-li">
                            <div className="digit">3.</div>
                            <div className="text">Sends his referral code to Mike.</div>
                        </div>
                        <div className="jin-li">
                            <div className="digit">4.</div>
                            <div className="text">Sends her referral code to Lorenzo.</div>
                        </div>
                    </div>
                    <div className="jin-p">
                        <div className="text">Receives two pending tickets for Lorenzo signing up.</div>
                    </div>
                </div>
                <div id="jin-block3">
                    <div className="jin-ul">
                        <div className="jin-li">
                            <div className="digit">5.</div>
                            <div className="text">Signs up and receives one pending ticket.</div>
                        </div>
                        <div className="jin-li">
                            <div className="digit">6.</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        );
    }
}
