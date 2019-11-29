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
const Copyright = props => {
    return (
        <div className="copyright">
            <div className="text">
                Emirex.com, BME Technologies OU is a licensed crypto to fiat exchange, authorised by the Central Bank of Estonia.
            </div>
    <div>{props.intl.formatMessage({id: 'footer_copyright'})}</div>
        </div>
    );
};

/******** start component */
const Licenses = props => {
    return (
        <div className="licenses">
            <h5>{props.intl.formatMessage({id: 'footer_licenses_title'})}</h5>
            <p>{props.intl.formatMessage({id: 'footer_licenses_text1'})}</p>
            <p>
            {props.intl.formatMessage({id: 'footer_licenses_text2'})}
            </p>
            <p>{props.intl.formatMessage({id: 'footer_licenses_text3'})}</p>
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

const GetInTouch = props => {
    return (
        <div className="social-block">
            <h5>{props.intl.formatMessage({id: 'footer_headers_getintouch'})}</h5>
            <IconList links={links6} />
        </div>
    );
};

/******** start component */

const Address = props => {
    return (
        <div className="address">
            <h5>{props.intl.formatMessage({id: 'footer_addresses_title'})}</h5>
            <p>47, Peterburi tee, Lasnamäe linnaosa, Harju maakond, Tallinn, Estonia</p>
        </div>
    );
};

const title1 = 'footer_headers_company';
const links1 = [
    { key: '', href: '/about', label: 'footer_links_about' },
    { key: '', href: '/whitepaper', label: 'footer_links_wp' },
    /* { href: '/team', label: 'footer.links.team'},
  { href: '/careers', label: 'footer.links.careers'},
  { href: '/blog', label: 'footer.links.blog'},*/
    { key: '', href: '/referral', label: 'footer_links_referral', className: 'gold' },
].map((link, index) => {
    link.key = `footer-link-${index}-${link.href}-${link.label}`;
    return link;
});

const title2 = 'footer_headers_services';
const links2 = [
    { key: '', href: '/trading/btcusdt', label: 'footer_links_platform' },
    { key: '', href: 'https://emrx.emirex.com', label: 'footer_links_emrx' },
    { key: '', href: 'https://advisory.emirex.com', label: 'footer_links_ad' },
    /*  { href: '/listing', label: 'footer.links.listing'},*/
].map((link, index) => {
    link.key = `footer-link-${index}-${link.href}-${link.label}`;
    return link;
});

const title3 = 'footer_headers_buysell';
const links3 = [
    { key: '', href: '/trading/btcusdt', label: 'footer_links_buyBitcoin' },
    { key: '', href: '/trading/ethusdt', label: 'footer_links_buyEthereum' },
    /*{ href: '/trading', label: 'footer.links.buyRipple'},
  { href: '/trading', label: 'footer.links.buyLitecoin'},
  { href: '/trading', label: 'footer.links.buyEmrx'},*/
].map((link, index) => {
    link.key = `footer-link-${index}-${link.href}-${link.label}`;
    return link;
});

const title4 = 'footer_headers_support';
const links4 = [
    { key: '', href: 'https://knowledge-base.emirex.com/', label: 'footer_links_kb' },
    { key: '', href: 'https://knowledge-base.emirex.com/kb-tickets/new', label: 'footer_links_submitRequest' },
    { key: '', href: '/fees', label: 'Fees' },
].map((link, index) => {
    link.key = `footer-link-${index}-${link.href}-${link.label}`;
    return link;
});

const title5 = 'footer_headers_legal';
const links5 = [
    { key: '', href: '/terms', label: 'footer_links_terms' },
    { key: '', href: '/privacy', label: 'footer_links_privacy' },
    { key: '', href: '/kyc_policy', label: 'footer_links_kyc' },
].map((link, index) => {
    link.key = `footer-link-${index}-${link.href}-${link.label}`;
    return link;
});

const LinksList = ({ links, intl }) => {
    return (
        <ul className="footer-link-list">
            {links.map(({ key, href, label, className }) => (
                <li key={key}>
                    <a className={className} href={href}>
                        {intl.formatMessage({ id: label})}
                    </a>
                </li>
            ))}
        </ul>
    );
};

const LinksColumn = ({ title, links, intl }) => {
    return (
        <div className="link-list-column">
<h5>{intl.formatMessage({id: title})}</h5>
            <LinksList intl={intl} links={links} />
        </div>
    );
};

const FooterBody = props => {
    return (
        <div className="footer-row">
            <LinksColumn intl={props.intl} title={title1} links={links1} />
            <LinksColumn intl={props.intl} title={title2} links={links2} />
            <LinksColumn intl={props.intl} title={title3} links={links3} />
            <div>
                <LinksColumn intl={props.intl} title={title4} links={links4} />
                <LinksColumn intl={props.intl} title={title5} links={links5} />
            </div>
            <div>
                <GetInTouch intl={props.intl}/>
                <Address intl={props.intl}/>
            </div>
        </div>
    );
};

const Footer = props => {
    return (
        <section id="footer">
            <div>
                {/* <MobileStartTrading /> */}
                <Header />
                <FooterBody intl={props.intl}/>
                <Licenses intl={props.intl}/>
                <Copyright intl={props.intl}/>
            </div>
        </section>
    );
};

export { Footer };
