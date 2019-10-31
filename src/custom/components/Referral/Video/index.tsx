import * as React from 'react';
import { Link } from 'react-scroll';
import campaign = require('../../../assets/images/referral/campaign-bar.png');
import video = require('../../../assets/images/referral/video.svg');

const Video: React.FC = () => {
    const animateButton = () => {
        const el = document.getElementById('ab2');
        el!.classList.remove('animate');
        el!.classList.add('animate');
        setTimeout(() => {
            el!.classList.remove('animate');
        }, 700);
    };

    return (
        <section id="video">
            <div className="container_">
                <div className="header">
                    <h4>Watch the video to see how you can</h4>
                    <div className="win-with-emirex">#WinWithEmirex</div>
                    <img src={campaign} className="campaign" alt="" />
                </div>
                <div className="video-wrap">
                    <img src={video} alt="" />
                </div>
            </div>
            <div className="button-container">
                <Link to="get-code" smooth={true} duration={500} delay={500}>
                    <div id="ab2" className="button black-button " onClick={animateButton}>
                        Get a Code
                    </div>
                </Link>
            </div>
        </section>
    );
};

export { Video };
