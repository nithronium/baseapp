import * as React from 'react';

import { Link } from 'react-scroll';
//tslint:disable
import { injectIntl } from 'react-intl';
import './style.css';



const blockburn = require('./blockburn.svg');
const treefold = require('./treefold.svg');
const tycoon69 = require('./tycoon69.svg');

const Partner = ({src, summ, currency, tokens, href }) => {
    return (
        <a className="partner" href={href} target="_blank" rel="noopener noreferrer">
            <img src={src} alt="logo"/>
            <span className="partner__middle-line" />
            <div className="summ-row">
                <div className="summ">{summ}</div>
                <div className="currency">
                    <span style={{fontWeight: 'bold'}}>{currency}</span>
                    <span>{tokens}</span>
                </div>
            </div>
        </a>
    );
};

const Button = ({ text }) => {
    return (
        <Link className="button" to="banner" smooth={true} duration={500}>
            {text}
        </Link>
    );
};

export const Partners = injectIntl(({intl}) => {
    const translate = id => intl.formatMessage({id: id});
    const tokens = translate('partners.banner.tokens');
    const text = translate('partners.banner.takepart'); 
    return (
        <div className="partners-wrapper">
            <h2>{translate('partners.banner.title')}</h2>
            <p>{translate('partners.banner.subtitle')}</p>
            <div className="partners">
                <Partner src={blockburn} summ={'5,000$'} currency={'BURN'} tokens={tokens} href={'https://bit.emirex.com/blockburn'}/>
                <Partner src={treefold} summ={'35,000$'} currency={'TFT'} tokens={tokens} href={'https://bit.emirex.com/threefold'}/>
                <Partner src={tycoon69} summ={'30,000$'} currency={'T69'} tokens={tokens} href={'https://bit.emirex.com/38pnKF7'}/>
            </div>
            <Button text={text}/>
        </div>
    );
});
