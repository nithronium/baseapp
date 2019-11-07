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

const Address = () => {
    return (
        <div className="address">
            <h5>Address</h5>
            <p>47, Peterburi tee, Lasnamäe linnaosa, Harju maakond, Tallinn, Estonia</p>
        </div>
    );
};

const title1 = 'Company';
const links1 = [
    { key: '', href: '/en/about', label: 'About' },
    { key: '', href: '/en/whitepaper', label: 'White Paper' },
    /* { href: '/team', label: 'footer.links.team'},
  { href: '/careers', label: 'footer.links.careers'},
  { href: '/blog', label: 'footer.links.blog'},*/
    { key: '', href: '/referral', label: 'Referrlal Giveaway', className: 'gold' },
].map((link, index) => {
    link.key = `footer-link-${index}-${link.href}-${link.label}`;
    return link;
});

const title2 = 'Our Services';
const links2 = [
    { key: '', href: '/trading', label: 'Trading Platform' },
    { key: '', href: 'https://emrx.emirex.com', label: 'EMRX Token' },
    { key: '', href: 'https://advisory.emirex.com', label: 'Advisory' },
    /*  { href: '/listing', label: 'footer.links.listing'},*/
].map((link, index) => {
    link.key = `footer-link-${index}-${link.href}-${link.label}`;
    return link;
});

const title3 = 'Buy/Sell Crypto';
const links3 = [
    { key: '', href: '/en/trading/btcusdt', label: 'Buy Bitcoin' },
    { key: '', href: '/en/trading/ethusdt', label: 'Buy Ethereum' },
    /*{ href: '/trading', label: 'footer.links.buyRipple'},
  { href: '/trading', label: 'footer.links.buyLitecoin'},
  { href: '/trading', label: 'footer.links.buyEmrx'},*/
].map((link, index) => {
    link.key = `footer-link-${index}-${link.href}-${link.label}`;
    return link;
});

const title4 = 'Support';
const links4 = [
    { key: '', href: 'https://knowledge-base.emirex.com/', label: 'Knoweledge Base' },
    { key: '', href: 'https://knowledge-base.emirex.com/kb-tickets/new', label: 'Submit a request' },
    { key: '', href: '/en/fees', label: 'Fees' },
].map((link, index) => {
    link.key = `footer-link-${index}-${link.href}-${link.label}`;
    return link;
});

const title5 = 'Legal';
const links5 = [
    { key: '', href: '/en/terms', label: 'Terms of Use' },
    { key: '', href: '/en/privacy', label: 'Privacy Policy' },
    { key: '', href: '/en/kyc_policy', label: 'KYC/AML policy' },
].map((link, index) => {
    link.key = `footer-link-${index}-${link.href}-${link.label}`;
    return link;
});

const LinksList = ({ links }) => {
    return (
        <ul className="footer-link-list">
            {links.map(({ key, href, label, className }) => (
                <li key={key}>
                    <a className={className} href={href}>
                        {label}
                    </a>
                </li>
            ))}
        </ul>
    );
};

const LinksColumn = ({ title, links }) => {
    return (
        <div className="link-list-column">
            <h5>{title}</h5>
            <LinksList links={links} />
        </div>
    );
};

const FooterBody = () => {
    return (
        <div className="footer-row">
            <LinksColumn title={title1} links={links1} />
            <LinksColumn title={title2} links={links2} />
            <LinksColumn title={title3} links={links3} />
            <div>
                <LinksColumn title={title4} links={links4} />
                <LinksColumn title={title5} links={links5} />
            </div>
            <div>
                <GetInTouch />
                <Address />
            </div>
        </div>
    );
};

const Footer = () => {
    return (
        <section id="footer">
            <div>
                {/* <MobileStartTrading /> */}
                <Header />
                <FooterBody />
                <Licenses />
                <Copyright />
            </div>
        </section>
    );
};

export { Footer };
