import * as React from 'react';

import { GetCode } from '../GetCode';
//tslint:disable
import facebook = require('../../../assets/images/referral/icons/facebook.svg');
import instagram = require('../../../assets/images/referral/icons/instagram.svg');
import linkedin = require('../../../assets/images/referral/icons/linkedin.svg');
import medium = require('../../../assets/images/referral/icons/Monogram.svg');
import reddit = require('../../../assets/images/referral/icons/reddit.svg');
import telegram = require('../../../assets/images/referral/icons/Telegram.svg');
import twitter = require('../../../assets/images/referral/icons/twitter.svg');
import logo = require('../../../assets/images/referral/logo-emirex.svg');

import bitcoincom = require('../../../../assets/images/bitcoincom.png');
import blockonomi = require('../../../../assets/images/blockonomi.png');
import coinspeaker = require('../../../../assets/images/coinspeaker.png');
import cointelegraph = require('../../../../assets/images/cointelegraph.png');
import forbes = require('../../../../assets/images/forbes.png');
import newsbtc = require('../../../../assets/images/newsbtc.png');
import yahoo = require('../../../../assets/images/yahoo.png');
import zerohedge = require('../../../../assets/images/zerohedge.png');
import { BottomBanner } from '../BottomBanner';

import replaceHLink from '../../../helpers/scripts.js';

declare module 'react' {
    interface HTMLAttributes<T> {
        rel?: string;
        target?: string;
    }
}

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
            <div style={{ color: 'white' }} className="text">
                {props.intl.formatMessage({ id: 'footer_demo' })}
            </div>
            <div style={{ color: 'white' }}>{props.intl.formatMessage({ id: 'footer_copyright' })}</div>
        </div>
    );
};

/******** start component */
const Licenses = props => {
    return (
        <div className="licenses">
            <h5>{props.intl.formatMessage({ id: 'footer_licenses_title' })}</h5>
            <p>{props.intl.formatMessage({ id: 'footer_licenses_text1' })}</p>
            <p>{props.intl.formatMessage({ id: 'footer_licenses_text2' })}</p>
            <p>{props.intl.formatMessage({ id: 'footer_licenses_text3' })}</p>
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
        href: 'tg://resolve?domain=emirex_official',
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
                    <a href={href} target="_blank" rel="nofollow noopener">
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
            <h5>{props.intl.formatMessage({ id: 'footer_headers_getintouch' })}</h5>
            <IconList links={links6} />
        </div>
    );
};

/******** start component */

const Address = props => {
    return (
        <div className="address">
            <h5>{props.intl.formatMessage({ id: 'footer_addresses_title' })}</h5>
            <p>{props.intl.formatMessage({ id: 'footer_addresses_first' })}</p>
        </div>
    );
};

const title1 = 'footer_headers_company';
const links1 = [
    { key: '', href: '/about', label: 'footer_links_about', ext: false },
    { key: '', href: '/whitepaper', label: 'footer_links_wp', ext: false },
    { key: '', href: 'https://kb.emirex.com/fees-structure', label: 'footer_links_fees', ext: true },
    /* { href: '/team', label: 'footer.links.team'},
  { href: '/careers', label: 'footer.links.careers'},
  { href: '/blog', label: 'footer.links.blog'},*/
    { key: '', href: '/referral', label: 'footer_links_referral', className: 'gold', ext: false },
].map((link, index) => {
    link.key = `footer-link-${index}-${link.href}-${link.label}`;
    return link;
});

const title2 = 'footer_headers_services';
const links2 = [
    { key: '', href: '/trading/btcusdt', label: 'footer_links_platform', ext: false },
    { key: '', href: 'https://emrx.emirex.com', label: 'footer_links_emrx', ext: true },
    { key: '', href: 'https://advisory.emirex.com', label: 'footer_links_ad', ext: true },
    /*  { href: '/listing', label: 'footer.links.listing'},*/
].map((link, index) => {
    link.key = `footer-link-${index}-${link.href}-${link.label}`;
    return link;
});

const title3 = 'footer_headers_buysell';
const links3 = [
    { key: '', href: '/buybtc', label: 'footer_links_buyBitcoin' },
    { key: '', href: '/buyeth', label: 'footer_links_buyEthereum'},
    { key: '', href: '/buyusdt', label: 'footer_links_buyTether'},
    { key: '', href: '/buyusdc', label: 'footer_links_buyUSDCoin'},
    { key: '', href: '/buyburn', label: 'footer_links_buyBlockburn'},
    { key: '', href: '/buyemrx', label: 'footer_links_buyEmirex'},
    { key: '', href: '/buyltc', label: 'footer_links_buyLitecoin'},
    { key: '', href: '/buybch', label: 'footer_links_buyBitcoinCash'},
    { key: '', href: '/buyt69', label: 'footer_links_buyT69Coin'},
    /*{ href: '/trading', label: 'footer.links.buyRipple'},
  { href: '/trading', label: 'footer.links.buyLitecoin'},
  { href: '/trading', label: 'footer.links.buyEmrx'},*/
].map((link, index) => {
    link.key = `footer-link-${index}-${link.href}-${link.label}`;
    return link;
});

const title4 = 'footer_headers_support';
const links4 = [
    { key: '', href: 'https://kb.emirex.com/', label: 'footer_links_kb', ext: true },
    { key: '', href: 'https://kb.emirex.com/kb-tickets/new', label: 'footer_links_submitRequest', ext: true },
].map((link, index) => {
    link.key = `footer-link-${index}-${link.href}-${link.label}`;
    return link;
});

const title5 = 'footer_headers_legal';
const links5 = [
    { key: '', href: '/terms', label: 'footer_links_terms', ext: false },
    { key: '', href: '/privacy', label: 'footer_links_privacy', ext: false },
    { key: '', href: '/kyc_policy', label: 'footer_links_kyc', ext: false },
].map((link, index) => {
    link.key = `footer-link-${index}-${link.href}-${link.label}`;
    return link;
});

const LinksList = ({ links, intl }) => {
    return (
        <ul className="footer-link-list">
            {links.map(({ key, href, label, className, ext }) =>
                ext ? (
                    <li key={key}>
                        <a className={className} href={href} target="_blank" rel="nofollow noopener">
                            {intl.formatMessage({ id: label })}
                        </a>
                    </li>
                ) : (
                    <li key={key}>
                        <a className={className} href={href}>
                            {intl.formatMessage({ id: label })}
                        </a>
                    </li>
                )
            )}
        </ul>
    );
};

const LinksColumn = ({ title, links, intl }) => {
    return (
        <div className="link-list-column">
            <h5>{intl.formatMessage({ id: title })}</h5>
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
                <GetInTouch intl={props.intl} />
                <Address intl={props.intl} />
            </div>
        </div>
    );
};

const MediaLogo = props => {
    React.useEffect(() => {
        replaceHLink();
    });
    return (
        <div className="medialogo">
            <h2>{props.intl.formatMessage({ id: 'medialogo.title' })}</h2>
            <div className="logo-wrapper">
                {/*<noindex>*/}
                <span
                    className={'hlink'}
                    rel="nofollow"
                    data-href={btoa('https://news.bitcoin.com/cryptocurrency-exchanges-are-fighting-to-escape-binances-shadow/')}
                    target="_blank"
                >
                    <img src={bitcoincom} alt="new btc logo" />
                </span>
                {/*</noindex>*/}
                {/*<noindex>*/}
                <span
                    className={'hlink'}
                    rel="nofollow"
                    data-href={btoa('https://blockonomi.com/emirex-review/')}
                    target="_blank"
                >
                    <img src={blockonomi} alt="yahoo logo" />
                </span>
                {/*</noindex>*/}
                {/*<noindex>*/}
                <span
                    className={'hlink'}
                    rel="nofollow"
                    data-href={btoa('https://www.coinspeaker.com/blockchain-tokenization-commodities/')}
                    target="_blank"
                >
                    <img src={coinspeaker} alt="coinspeaker logo" />
                </span>
                {/*</noindex>*/}
                {/*<noindex>*/}
                <span
                    className={'hlink'}
                    rel="nofollow"
                    data-href={btoa(
                        'https://cointelegraph.com/news/us-fed-weighs-up-potential-cbdc-as-countermove-against-china'
                    )}
                    target="_blank"
                >
                    <img src={cointelegraph} alt="new btc logo" />
                </span>
                {/*</noindex>*/}
                {/*<noindex>*/}
                <span
                    className={'hlink'}
                    rel="nofollow"
                    data-href={btoa(
                        'https://forbesmiddleeast.com/what-impact-could-tokenized-commodities-have-on-the-middle-east'
                    )}
                    target="_blank"
                >
                    <img src={forbes} alt="yahoo logo" />
                </span>
                {/*</noindex>*/}
                {/*<noindex>*/}
                <span
                    className={'hlink'}
                    rel="nofollow"
                    data-href={btoa(
                        'https://www.newsbtc.com/2019/11/26/emirex-doubles-down-with-ieo-announcement-building-a-comprehensive-crypto-ecosystem-in-the-middle-east/'
                    )}
                    target="_blank"
                >
                    <img src={newsbtc} alt="coinspeaker logo" />
                </span>
                {/*</noindex>*/}
                {/*<noindex>*/}
                <span
                    className={'hlink'}
                    rel="nofollow"
                    data-href={btoa('https://finance.yahoo.com/news/platforms-solutions-confirm-growing-interest-164407914.html')}
                    target="_blank"
                >
                    <img src={yahoo} alt="new btc logo" />
                </span>
                {/*</noindex>*/}
                {/*<noindex>*/}
                <span
                    className={'hlink'}
                    rel="nofollow"
                    data-href={btoa('https://www.zerohedge.com/news/2019-11-26/blockchain-taking-over-middle-east')}
                    target="_blank"
                >
                    <img src={zerohedge} alt="yahoo logo" />
                </span>

                {/* <a href="https://news.bitcoin.com/cryptocurrency-exchanges-are-fighting-to-escape-binances-shadow/"><img src={bitcoincom} alt="logo" /></a>
                <a href="https://blockonomi.com/emirex-review/"><img src={blockonomi} alt="logo" /></a>        
                <a href="https://www.coinspeaker.com/blockchain-tokenization-commodities/"><img src={coinspeaker} alt="logo" /></a>
                <a href="https://cointelegraph.com/news/us-fed-weighs-up-potential-cbdc-as-countermove-against-china"><img src={cointelegraph} alt="ogo" /></a>
                <a href="https://forbesmiddleeast.com/what-impact-could-tokenized-commodities-have-on-the-middle-east"><img src={forbes} alt="logo" /> </a>       
                <a href="https://www.newsbtc.com/2019/11/26/emirex-doubles-down-with-ieo-announcement-building-a-comprehensive-crypto-ecosystem-in-the-middle-east/"><img src={newsbtc} alt="logo" /></a>
                <a href="https://finance.yahoo.com/news/platforms-solutions-confirm-growing-interest-164407914.html"><img src={yahoo} alt="logo" /></a>
                <a href="https://www.zerohedge.com/news/2019-11-26/blockchain-taking-over-middle-east"><img src={zerohedge} alt="logo" /> </a>        */}
            </div>
        </div>
    );
};

const Footer = props => {
    return (
        <div>
            <MediaLogo intl={props.intl} />

            <BottomBanner />
            <GetCode intl={props.intl} />
            <section id="footer">
                <div>
                    {/* <MobileStartTrading /> */}
                    <Header />
                    <FooterBody intl={props.intl} />
                    <Licenses intl={props.intl} />
                    <Copyright intl={props.intl} />
                </div>
            </section>
        </div>
    );
};

export { Footer };
