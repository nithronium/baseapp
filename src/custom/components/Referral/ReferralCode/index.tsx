import * as React from 'react';

export class ReferralCode extends React.Component {
    public render() {
        return (
            <section id="referral-code">
                <h2>How do I get a referral code?</h2>
                <div className="container">
                    <div className="left">
                        <img alt="illustration" src={require('../../../assets/images/referral/hiw_illustration.png')} />
                    </div>
                    <div className="right">
                        <div className="right-content">
                            <p>
                                Watch out for the codes being shared or search for the hashtag <strong>#WinWithEmirex</strong>
                            </p>
                            <p className="cta">Follow us on social media!</p>
                            <div className="social-holder">
                                <a href="https://www.facebook.com/emirex.official/" className="social" id="facebook">
                                    &nbsp;
                                </a>
                                <a href="https://www.instagram.com/emirex_official/" className="social" id="instagram">
                                    &nbsp;
                                </a>
                                <a href="https://twitter.com/EMIREX_OFFICIAL" className="social" id="twitter">
                                    &nbsp;
                                </a>
                                <a href="https://t.me/joinchat/DqGU61OCcKlwpg073YO0fA" className="social" id="telegram">
                                    &nbsp;
                                </a>
                                <a href="https://medium.com/@EMIREX_OFFICIAL" className="social" id="medium">
                                    &nbsp;
                                </a>
                                <a
                                    href="https://www.linkedin.com/company/emirexgroup/?viewAsMember=true"
                                    className="social"
                                    id="linkedin"
                                >
                                    &nbsp;
                                </a>
                                <a
                                    href="https://www.reddit.com/user/Emirex__official/comments/d1vsum/introducing_the_next_stage_in_the_technology_roll/"
                                    className="social"
                                    id="reddit"
                                >
                                    &nbsp;
                                </a>
                            </div>
                            <a href="#!" className="hero-button">
                                Get a code
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
