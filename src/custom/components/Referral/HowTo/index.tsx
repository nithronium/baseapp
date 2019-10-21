import * as React from 'react';
import backFull = require('../../../assets/images/referral/back-full.svg');
import backLeft = require('../../../assets/images/referral/back-left.svg');
import backRight = require('../../../assets/images/referral/back-right.svg');
import ticket = require('../../../assets/images/referral/ticket.svg');
import './howto.css';

const HowTo: React.FC = () => {
  return (
    <section id="how-to">
      <h2 className="center">How to get tickets?</h2>
      <h4 className="center">Receive tickets for the draw as follows:</h4>
      <img src={ticket} className="ticket-img" alt=""/>
      <div className="axis" />
      <div className="how-tos">
        <div className="how-to">
          <div className="number-wrap"><div className="number">1</div></div>
          <div className="text">Get tickets for <b>referring</b> your friends</div>
        </div>
        <div className="how-to">
          <div className="number-wrap"><div className="number">2</div></div>
          <div className="text">Get tickets for <b>following</b> us on social media</div>
        </div>
        <div className="how-to">
          <div className="number-wrap"><div className="number">3</div></div>
          <div className="text">Get tickets for <b>posting</b> on social media</div>
        </div>
        <div className="how-to">
          <div className="number-wrap"><div className="number">4</div></div>
          <div className="text"><b>Top up</b> your balances to get more tickets</div>
        </div>
      </div>
      <div className="back-full">
        <img src={backFull} alt="" />
      </div>
      <div className="back-halves">
        <div style={{textAlign: 'left'}}><img src={backRight} alt="" /></div>
        <div style={{textAlign: 'right'}}><img src={backLeft} alt="" /></div>
      </div>


      <div className="button-container">
        <a href="#get-code" className="button yellow-button">Get a Code</a>
      </div>
    </section>
  );
};

export { HowTo};
