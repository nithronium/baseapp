import * as React from 'react';

import { GetCode } from '../GetCode';
//tslint:disable

import bitcoincom = require('../../../../assets/images/bitcoincom.png');
import blockonomi = require('../../../../assets/images/blockonomi.png');
import coinspeaker = require('../../../../assets/images/coinspeaker.png');
import cointelegraph = require('../../../../assets/images/cointelegraph.png');
import forbes = require('../../../../assets/images/forbes.png');
import newsbtc = require('../../../../assets/images/newsbtc.png');
import yahoo = require('../../../../assets/images/yahoo.png');
import zerohedge = require('../../../../assets/images/zerohedge.png');
import hitbtc = require('../../../../assets/images/hit-btc-logo.png');
import { BottomBanner } from '../BottomBanner';

import replaceHLink from '../../../helpers/scripts.js';

declare module 'react' {
    interface HTMLAttributes<T> {
        rel?: string;
        target?: string;
    }
}

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
                {/*</noindex>*/}

                {/*<noindex>*/}
                <span
                    className={'hlink'}
                    rel="nofollow"
                    data-href={btoa('https://hitbtc.com/exchange/EMRX-to-BTC')}
                    target="_blank"
                >
                    <img src={hitbtc} alt="hit btc logo" />
                </span>
                {/*</noindex>*/}

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
        </div>
    );
};

export { Footer };
