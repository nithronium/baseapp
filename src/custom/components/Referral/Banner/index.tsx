import * as React from 'react';
// import { Link } from 'react-scroll';
import Button from '../Button';
//tslint:disable


const Banner = ({ children, lang }) => {
    
    const banner = lang === 'en' ?
        <img src={require('../../../../custom/assets/images/referral/banner-text.png')} className="grab" alt="baner" /> :
        <img src={require('../../../../custom/assets/images/referral/banner-text_rus.png')} className="grab" alt="baner" />;
                                    

    return (
        <section id="banner">
            <div className="grab-container">
                <div className="banner-container">
                    <div className="banner">
                        {banner}
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
