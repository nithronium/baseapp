import * as React from 'react';
import facebook = require('../../../assets/images/referral/icons-yellow/facebook.svg');
import instagram = require('../../../assets/images/referral/icons-yellow/instagram.svg');
import linkedin = require('../../../assets/images/referral/icons-yellow/linkedin.svg');
import medium = require('../../../assets/images/referral/icons-yellow/medium.svg');
import reddit = require('../../../assets/images/referral/icons-yellow/reddit.svg');
import telegram = require('../../../assets/images/referral/icons-yellow/telegram.svg');
import twitter = require('../../../assets/images/referral/icons-yellow/twitter.svg');
import graphic = require ('../../../assets/images/referral/referral-graphic.svg');

const GetCode: React.FC = () => {
  return (
    <section id="get-code">
      <div className="container_">
        <div>
          <img src={graphic} alt="" style={{maxWidth: '100%'}}/>
        </div>
        <div>
          <h2>Get a referral code now</h2>
          <p>Watch out for the codes being shared or search for the hashtag <b>#WinWithEmirex</b></p>
          <p><b>Follow us on social media!</b></p>
          <div className="social">
            <div>
            <a href="https://www.facebook.com/emirex.official/"><img src={facebook} alt=""/></a>
            <a href="https://www.instagram.com/emirex_official/"><img src={instagram} alt=""/></a>
            <a href="https://twitter.com/EMIREX_OFFICIAL"><img src={twitter} alt=""/></a>
            <a href="https://t.me/joinchat/DqGU61OCcKlwpg073YO0fA"><img src={telegram} alt=""/></a>
            </div>
            <div>
            <a href="https://medium.com/@EMIREX_OFFICIAL"><img src={medium} alt=""/></a>
            <a href="https://www.linkedin.com/company/emirexgroup/?viewAsMember=true"><img src={linkedin} alt=""/></a>
            <a href="https://www.reddit.com/user/Emirex__official/comments/d1vsum/introducing_the_next_stage_in_the_technology_roll/"><img src={reddit} alt=""/></a>
            </div>
          </div>
        </div>
      </div>
      <div className="terms">
        <h3>Terms and Conditions</h3>
        <p>Please read the <a href="/terms"><b>Terms and Conditions</b></a> to make sure that you are eligible to participate. No purchase is necessary to take part in this giveaway.</p>
        <p>The draw will take place through the use of blockchain technology, self-executing smart contracts will select the winners without human interference, guided by math and computer code only. This is to ensure complete transparency and independence. The draw will take place in Estonia, under the relevant EU rules.</p>
        <p>To ensure that there is no fraud, only tickets activated by accounts at the time of the draw will count as valid. </p>
        <p>Please read our <a href="/faq"><b>FAQ</b></a>, which will answer all of your questions. </p>
      </div>
    </section>
  );
};

export {GetCode};
