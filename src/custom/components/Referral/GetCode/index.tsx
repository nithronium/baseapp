import * as React from 'react';
import {FormattedMessage} from 'react-intl';

const facebook = require('../../../assets/images/referral/icons-yellow/facebook.svg');
const instagram = require('../../../assets/images/referral/icons-yellow/instagram.svg');
const linkedin = require('../../../assets/images/referral/icons-yellow/linkedin.svg');
const medium = require('../../../assets/images/referral/icons-yellow/medium.svg');
const reddit = require('../../../assets/images/referral/icons-yellow/reddit.svg');
const telegram = require('../../../assets/images/referral/icons-yellow/telegram.svg');
const twitter = require('../../../assets/images/referral/icons-yellow/twitter.svg');
const graphic = require('../../../assets/images/referral/referral-graphic.svg');
//tslint:disable
const GetCode = props => {
    return (
        <section id="get-code">
            <div className="container_">
                <div>
                    <img src={graphic} alt="" style={{ maxWidth: '100%' }} />
                </div>
                <div>
                    <h2><FormattedMessage id={'get.get_now'}/></h2>
                    <p>
                        <FormattedMessage id={'get.watch'}/> <b>#WinWithEmirex</b>
                    </p>
                    <p>
                        <b><FormattedMessage id={'get.follow'}/></b>
                    </p>
                    <div className="social">
                        <div>
                            <a href="https://www.facebook.com/emirex.official/" target="_blank" rel="noopener noreferrer">
                                <img src={facebook} alt="" />
                            </a>
                            <a href="https://www.instagram.com/emirex_official/" target="_blank" rel="noopener noreferrer">
                                <img src={instagram} alt="" />
                            </a>
                            <a href="https://twitter.com/EMIREX_OFFICIAL" target="_blank" rel="noopener noreferrer">
                                <img src={twitter} alt="" />
                            </a>
                            <a href="tg://resolve?domain=emirex_official" target="_blank" rel="noopener noreferrer">
                                <img src={telegram} alt="" />
                            </a>
                        </div>
                        <div>
                            <a href="https://medium.com/@EMIREX_OFFICIAL" target="_blank" rel="noopener noreferrer">
                                <img src={medium} alt="" />
                            </a>
                            <a
                                href="https://www.linkedin.com/company/emirexgroup/?viewAsMember=true"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img src={linkedin} alt="" />
                            </a>
                            <a
                                href="https://www.reddit.com/user/Emirex__official/comments/d1vsum/introducing_the_next_stage_in_the_technology_roll/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img src={reddit} alt="" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="terms">
                <h3><FormattedMessage id={'get.h3'}/></h3>
                <p dangerouslySetInnerHTML={{ __html: `<FormattedMessage id={'get.text1'}/>` }} />
                <p><FormattedMessage id={'get.text2'}/></p>
                <p><FormattedMessage id={'get.text3'}/></p>
                <p dangerouslySetInnerHTML={{ __html: `<FormattedMessage id={'get.text4'}/>` }} />
            </div>
        </section>
    );
};

export { GetCode };
