import * as React from 'react';
import facebook = require('../../../assets/images/referral/icons/facebook.svg');
import instagram = require('../../../assets/images/referral/icons/instagram.svg');
import linkedin = require('../../../assets/images/referral/icons/linkedin.svg');
import medium = require('../../../assets/images/referral/icons/Monogram.svg');
import reddit = require('../../../assets/images/referral/icons/reddit.svg');
import telegram = require('../../../assets/images/referral/icons/Telegram.svg');
import twitter = require('../../../assets/images/referral/icons/twitter.svg');
import logo = require('../../../assets/images/referral/logo-emirex.svg');
const Header = () => {
    return (
        <div className="logo">
            <img src={logo} width="162" alt="EMIREX LOGO" />
        </div>
    );
};
/******** start component */
const Copyright = () => {
    return (
        <div className="copyright">
            <div className="text">
                Emirex.com, BME Technologies OU is a licensed crypto to fiat exchange, authorised by the Central Bank of Estonia.
            </div>
            <div>© 2019 Emirex.com All rights reserved.</div>
        </div>
    );
};

/******** start component */
const Licenses = () => {
    return (
        <div className="licenses">
            <h5>Operating Licenses</h5>
            <p>Financial services, providing a virtual currency wallet service; Number FRK000909</p>
            <p>
                Financial services, providing services of exchanging a virtual currency against a fiat currency; Number FVR001017
            </p>
            <p>Issuer of licences: Estonian Police and Boarder Guard Board (Politsei - ja Piirivalveamet)</p>
        </div>
    );
};
//tslint:disable
/******** start component */
const links6 = [
    { key: '', href: 'https://www.facebook.com/emirex.official/', icon: facebook, alt: 'facebook icon' },
    {
        key: '',
        href: 'https://www.instagram.com/emirex_official/',
        icon: instagram,
        alt: 'instagram icon',
    },
    { key: '', href: 'https://twitter.com/EMIREX_OFFICIAL', icon: twitter, alt: 'twitter icon' },
    {
        key: '',
        href: 'https://t.me/joinchat/DqGU61OCcKlwpg073YO0fA',
        icon: telegram,
        alt: 'telegram icon',
    },
    { key: '', href: 'https://medium.com/@EMIREX_OFFICIAL', icon: medium, alt: 'medium icon' },
    {
        key: '',
        href: 'https://www.linkedin.com/company/emirexgroup/?viewAsMember=true',
        icon: linkedin,
        alt: 'linkedin icon',
    },
    {
        key: '',
        href: 'https://www.reddit.com/user/Emirex__official/comments/d1vsum/introducing_the_next_stage_in_the_technology_roll/',
        icon: reddit,
        alt: 'reddit icon',
    },
].map((link, index) => {
    link.key = `footer-link-${index}-${link.href}`;
    return link;
});

const IconList = ({ links }) => {
    return (
        <ul className="social-links">
            {links.map(({ key, href, icon, alt }) => (
                <li key={key} className="sl-item">
                    <a href={href}>
                        <div className="icon">
                            <img className="icon-img" width="16" height="16" src={icon} alt={alt} />
                        </div>
                    </a>
                </li>
            ))}
        </ul>
    );
};

const GetInTouch = () => {
    return (
        <div className="social-block">
            <h5>Get in Touch</h5>
            <IconList links={links6} />
        </div>
    );
};

/******** start component */

const Footer = () => {
    return (
        <div id="footer">
            {/* <MobileStartTrading /> */}
            <Header />
            {/* <FooterBodyComponent />  */}

            <GetInTouch />
            <Licenses />
            <Copyright />
        </div>
    );
};

export { Footer };
