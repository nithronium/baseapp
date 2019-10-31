import * as React from 'react';
import { Link } from 'react-scroll';
//tslint:disable

const Banner: React.FC = ({ children }) => {
    const animateButton = () => {
        const el = document.getElementById('ab1');
        el!.classList.remove('animate');
        el!.classList.add('animate');
        setTimeout(() => {
            el!.classList.remove('animate');
        }, 700);
    };
    return (
        <section id="banner">
            <div className="grab-container">
                <div className="banner-container">
                    <div className="banner">
                        <img src={require('../../../../custom/assets/images/referral/banner-text.png')} className="grab" alt="" />
                        <img
                            src={require('../../../../custom/assets/images/referral/header-graphic.svg')}
                            className="header-graphic"
                            alt=""
                        />
                        <div className="button-container">
                            <Link to="get-code" smooth={true} duration={500} delay={500}>
                                <div id="ab1" className="button yellow-button " onClick={animateButton}>
                                    Get a Code
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="signup-container">{children}</div>
            </div>
        </section>
    );
};
export { Banner };
