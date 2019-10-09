import * as React from 'react';

export class ReferralCode extends React.Component{

    public render(){

        return(
            <section id="referral-code">
                <h2>How do I get a referral code?</h2>
                <div className="container">
                    <div className="left">
                        <img alt="illustration" src={require('../../../assets/images/referral/hiw_illustration.png')} />
                    </div>
                    <div className="right">
                        <div className="right-content">
                            <p>Watch out for the codes being shared or search for the hashtag <strong>#WinWithEmirex</strong></p>
                            <p className="cta">Follow us on social media!</p>
                            <div className="social-holder">
                                <a href="#!" className="social" id="facebook">&nbsp;</a>
                                <a href="#!" className="social" id="instagram">&nbsp;</a>
                                <a href="#!" className="social" id="twitter">&nbsp;</a>
                                <a href="#!" className="social" id="telegram">&nbsp;</a>
                                <a href="#!" className="social" id="medium">&nbsp;</a>
                                <a href="#!" className="social" id="linkedin">&nbsp;</a>
                                <a href="#!" className="social" id="reddit">&nbsp;</a>
                            </div>
                            <a href="#!" className="hero-button">Get a code</a>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
