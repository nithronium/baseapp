import * as React from 'react';
import {FormattedMessage} from 'react-intl';

//tslint:disable
import facebook = require('../../assets/images/footer-icons/facebook.svg');
import instagram = require('../../assets/images/footer-icons/instagram.svg');
import linkedin = require('../../assets/images/footer-icons/linkedin.svg');
import logo = require('../../assets/images/footer-icons/logo-emirex.svg');
import medium = require('../../assets/images/footer-icons/Monogram.svg');
import reddit = require('../../assets/images/footer-icons/reddit.svg');
import telegram = require('../../assets/images/footer-icons/Telegram.svg');
import twitter = require('../../assets/images/footer-icons/twitter.svg');

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
            <div style={{ color: 'white' }}><FormattedMessage id={'footer_copyright'}/></div>
        </div>
    );
};

/******** start component */
const Licenses = props => {
    return (
        <div className="licenses">
            <h5><FormattedMessage id={'footer_licenses_title'}/></h5>
            <p><FormattedMessage id={'footer_licenses_text1'}/></p>
            <p><FormattedMessage id={'footer_licenses_text2'}/></p>
            <p><FormattedMessage id={'footer_licenses_text3'}/></p>
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
            <h5><FormattedMessage id={'footer_headers_getintouch'}/></h5>
            <IconList links={links6} />
        </div>
    );
};

/******** start component */

const Address = props => {
    return (
        <div className="address">
            <h5><FormattedMessage id={'footer_addresses_title'}/></h5>
            <p className="notranslate"><FormattedMessage id={'footer_addresses_first'}/></p>
        </div>
    );
};

const linkBlock = {
    links1: {
        header: 'footer_headers_advisory',
        body: [
            { key: '', href: 'https://advisory.emirex.com/services', label: 'footer_headers_our_services', extLink :true },
            { key: '', href: 'https://advisory.emirex.com/commodities', label: 'footer_headers_сommodities', extLink :true },
            { key: '', href: 'https://advisory.emirex.com/expertise', label: 'footer_headers_expertise', extLink :true },
        ].map((link, index) => {
            link.key = `footer-link-${index}-${link.href}-${link.label}`;
            return link;
        }),
    },
    links2: {
        header: 'footer_headers_products',
        body: [
            { key: '', href: '/trading/btcusdt', label: 'footer_headers_spot_trade' },
            { key: '', href: '/ieo', label: 'footer_headers_ieo' },
            { key: '', href: '/referral-commission', label: 'footer_headers_referral_program' },
            { key: '', href: '/buycrypto', label: 'page.header.buy_crypto' },
        ].map((link, index) => {
            link.key = `footer-link-${index}-${link.href}-${link.label}`;
            return link;
        }),
    },
    links3: {
        header: 'footer_headers_legal',
        body: [
            { key: '', href: '/terms', label: 'footer_headers_terms_of_use', mainsite: true },
            { key: '', href: '/privacy', label: 'footer_headers_privacy', mainsite: true },
            { key: '', href: '/kyc_policy', label: 'footer_headers_KYC_AML_policy', mainsite: true },
        ].map((link, index) => {
            link.key = `footer-link-${index}-${link.href}-${link.label}`;
            return link;
        }),
    },
    links4: {
        header: 'footer_headers_service',
        body: [
            { key: '', href: 'https://kb.emirex.com/', label: 'footer_headers_knowledge_base', extLink :true },
            { key: '', href: 'https://kb.emirex.com/kb-tickets/new', label: 'footer_headers_submit_a_ticket', extLink :true },
        ].map((link, index) => {
            link.key = `footer-link-${index}-${link.href}-${link.label}`;
            return link;
        }),
    },
    links5: {
        header: 'footer_headers_contact_us',
        body: [
            { key: '', href: '/about', label: 'footer_headers_about', mainsite: true },
            { key: '', href: 'https://blog.emirex.com/', label: 'footer_headers_emirex_blog', extLink :true },
            { key: '', href: '/bitcoin-halving', label: 'nav_bitcoin_halving', mainsite: true},
        ].map((link, index) => {
            link.key = `footer-link-${index}-${link.href}-${link.label}`;
            return link;
        }),
    },
};

const getOriginLink = (intl, href, mainsite) => {
    return `${mainsite ? location.origin : ''}${intl === 'en' ? '' : '/'+intl}${href}`
};

const LinksList = ({ links, intl }) => {
    return (
        <ul className="footer-link-list">
            {links.map(({ key, href, label, className, extLink, mainsite }) =>
                extLink ? (
                    <li key={key}>
                        <a className={className} href={`${href}`} target="_blank" rel="nofollow noopener">
                            <FormattedMessage id={label}/>
                        </a>
                    </li>
                ) : (
                    <li key={key}>
                        <a className={className} href={getOriginLink(intl, href, mainsite)}>
                            <FormattedMessage id={label}/>
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
            <h5><FormattedMessage id={title}/></h5>
            <LinksList intl={intl} links={links} />
        </div>
    );
};

const FooterBody = props => {
    return (
        <div className="footer-row">
            <div className="left-blocks">
                {[1,2,3,4,5].map(number => (
                    <LinksColumn intl={props.intl} title={linkBlock[`links${number}`].header} links={linkBlock[`links${number}`].body} />
                ))}
            </div>
            <div className="right-block">
                <Address intl={props.intl} />
                <GetInTouch intl={props.intl} />
                <Licenses intl={props.intl} />
            </div>
        </div>
    );
};

const Footer = props => {
    return (
        <div style={{marginTop: '20px'}}>
            <section id="footer">
                <div>
                    {/* <MobileStartTrading /> */}
                    <Header />
                    <FooterBody intl={props.intl} />
                    <Copyright intl={props.intl} />
                </div>
            </section>
        </div>
    );
};

export { Footer };
