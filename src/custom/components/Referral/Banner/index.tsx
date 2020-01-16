import * as React from 'react';
// import { Link } from 'react-scroll';
import Button from '../Button';
//tslint:disable
const bannerEn = require('../../../../custom/assets/images/referral/banner-text.png');
const bannerRu = require('../../../../custom/assets/images/referral/banner-text_rus.png');
const bannerCn = require('./banner-text_cn.png');

const banners = {
    'en': bannerEn,
    'ru': bannerRu,
    'zh': bannerCn,
}

const banner = (lang) => {return  <img src={banners[lang]} className="grab" alt="baner" />;}


const Banner = ({ children, lang }) => {                                      

    return (
        <section id="banner">
            <div className="grab-container">
                <div className="banner-container">
                    <div className="banner">
                        {banner(lang)}
                        <img
                            src={require('../../../../custom/assets/images/referral/header-graphic.svg')}
                            className="header-graphic"
                            alt=""
                        />
                        <div className="button-container">
                            <Button/>
                        </div>
                    </div>
                </div>
                <div className="signup-container">{children}</div>
            </div>
        </section>
    );
};
export { Banner };
