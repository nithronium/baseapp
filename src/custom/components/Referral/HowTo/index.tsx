import * as React from 'react';

import Button from '../Button';

import backFull = require('../../../assets/images/referral/back-full.svg');
import backLeft = require('../../../assets/images/referral/back-left.svg');
import backRight = require('../../../assets/images/referral/back-right.svg');
import ticket = require('../../../assets/images/referral/ticket.svg');

const HowTo = props => {
    return (
        <section id="how-to">
            <h2 className="center">{props.h2}</h2>
    <h4 className="center">{props.h4}</h4>
            <img src={ticket} className="ticket-img" alt="" />
            <div className="axis" />
            <div className="how-tos">
                <div className="how-to">
                    <div className="number-wrap">
                        <div className="number">1</div>
                    </div>
                    <div className="text" dangerouslySetInnerHTML={{__html:props.text1}}/>
                </div>
                <div className="how-to">
                    <div className="number-wrap">
                        <div className="number">2</div>
                    </div>
                    <div className="text" dangerouslySetInnerHTML={{__html:props.text2}}/>

                    <div className="text golden">
                        <b>({props.soon})</b>
                    </div>
                </div>
                <div className="how-to">
                    <div className="number-wrap">
                        <div className="number">3</div>
                    </div>
                    <div className="text" dangerouslySetInnerHTML={{__html:props.text3}}/>

                    <div className="text golden">
                        <b>({props.soon})</b>
                    </div>
                </div>
                <div className="how-to">
                    <div className="number-wrap">
                        <div className="number">4</div>
                    </div>
                    <div className="text" dangerouslySetInnerHTML={{__html:props.text4}}/>
                </div>
            </div>
            <div className="back-full">
                <img src={backFull} alt="" />
            </div>
            <div className="back-halves">
                <div style={{ textAlign: 'left' }}>
                    <img src={backRight} alt="" />
                </div>
                <div style={{ textAlign: 'right' }}>
                    <img src={backLeft} alt="" />
                </div>
            </div>

            <div className="button-container">
                <Button />
            </div>
        </section>
    );
};

export { HowTo };
