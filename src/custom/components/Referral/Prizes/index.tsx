import * as React from 'react';
import { Button } from '../Button';

import bitcoin = require('../../../assets/images/referral/bitcoin.svg');
import emrx = require('../../../assets/images/referral/emrx.svg');

interface Prize {
    heading: string;
    bitcoin: string;
    emrx: string;
}
const mainPrizes = [
    {
        heading: '1st Prize',
        bitcoin: '$10,000',
        emrx: '$10,000',
    },
    {
        heading: '2nd Prize',
        bitcoin: '$8,000',
        emrx: '$8,000',
    },
    {
        heading: '3rd Prize',
        bitcoin: '$5,250',
        emrx: '$5,250',
    },
    {
        heading: '4&5th Prize',
        bitcoin: '$2,750',
        emrx: '$2,750',
    },
];

const mainPrize = (prize: Prize) => {
    return (
        <div key={prize.heading} className="prize-container">
            <div className="prize">
                <div className="heading">{prize.heading}</div>
                <div className="value">
                    <div className="bitcoin">{prize.bitcoin}</div>
                    <div className="emirex">{prize.emrx}</div>
                </div>
            </div>
        </div>
    );
};

const Prizes: React.FC = () => {
    return (
        <section id="prizes">
            <h2 className="center">
                Our 100 <span className="gold">prizes</span>
            </h2>
            <h4 className="center">Stand a chance to win any of the following prizes:</h4>
            <div className="prizes">
                {mainPrizes.map(mainPrize)}

                <div className="prize-container">
                    <div className="prize_">
                        <div className="heading">95 Prizes of</div>
                        <div className="inline">
                            <div>
                                <img src={bitcoin} alt="" />
                            </div>
                            <div>
                                <img src={emrx} alt="" />
                            </div>
                        </div>
                        <div className="bitcoin-emirex">
                            $1,500
                            <span className="explanation">
                                {' '}
                                in Bitcoin <span className="gold">+</span> in EMRX
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="button-container">
                <Button />
            </div>
        </section>
    );
};

export { Prizes };
