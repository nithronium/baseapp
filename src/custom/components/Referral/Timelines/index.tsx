import * as React from 'react';

export class Timelines extends React.Component{
    public render(){
        return(
            <section id="timelines">
                <h2>Timelines</h2>
                <div className="sands">
                    <div className="container images">
                        <img alt="desert" src={require('../../../assets/images/referral/camels.svg')} />
                        <img alt="timeline" src={require('../../../assets/images/referral/wave-line.svg')} />
                    </div>
                    <div className="container">
                        <div className="left">
                            <p>START</p>
                            <p>The Referral Giveaway starts on </p>
                            <p>October 1, 2019, 09:00 GMT+3</p>
                        </div>
                        <div className="right right-align">
                            <p>END</p>
                            <p>The Referral Giveaway ends on </p>
                            <p>December 24, 2019, 18:00 GMT+3</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
