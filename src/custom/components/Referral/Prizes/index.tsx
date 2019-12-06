import * as React from 'react';
import Button from '../Button';

import bitcoin = require('../../../assets/images/referral/bitcoin.svg');
import emrx = require('../../../assets/images/referral/emrx.svg');

interface Prize {
    heading: string;
    bitcoin: string;
    emrx: string;
}
const mainPrizes = [
    {
        heading: 'prize.1',
        bitcoin: '$10,000',
        emrx: '$10,000',
    },
    {
        heading: 'prize.2',
        bitcoin: '$8,000',
        emrx: '$8,000',
    },
    {
        heading: 'prize.3',
        bitcoin: '$5,250',
        emrx: '$5,250',
    },
    {
        heading: 'prize.4',
        bitcoin: '$2,750',
        emrx: '$2,750',
    },
];

// const mainPrize = (prize: Prize, message) => {
//     return (
//         <div key={prize.heading} className="prize-container">
//             <div className="prize">
//                 <div className="heading">{message.formatMessage({id: prize.heading})}</div>
//                 <div className="value">
//                     <div className="bitcoin">{prize.bitcoin}</div>
//                     <div className="emirex">{prize.emrx}</div>
//                 </div>
//             </div>
//         </div>
//     );
// };
// tslint:disable
const Prizes = props => {
    return (
        <section id="prizes">
            <h2 className="center">
               {props.intl.formatMessage({id: 'prize.our'})} 100 <span className="gold">{props.intl.formatMessage({id: 'prize.prizes'})}</span>
            </h2>
            <h4 className="center">{props.intl.formatMessage({id: 'prize.h4'})}</h4>
            <div className="prizes">
                
                {mainPrizes.map((prize: Prize) => (
                    <div key={prize.heading} className="prize-container">
                    <div className="prize">
                        <div className="heading">{props.intl.formatMessage({id: prize.heading})}</div>
                        <div className="value">
                            <div className="bitcoin">{prize.bitcoin}</div>
                            <div className="emirex">{prize.emrx}</div>
                        </div>
                    </div>
                </div>
                ))}
                    

                <div className="prize-container">
                    <div className="prize_">
                        <div className="heading">{props.intl.formatMessage({id: 'prize.95prizes'})}</div>
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
