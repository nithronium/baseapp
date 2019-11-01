import * as React from 'react';
import { Button } from '../Button';

import campaign = require('../../../assets/images/referral/campaign-bar.png');
import video = require('../../../assets/images/referral/video.svg');

const Video: React.FC = () => {
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
                <Button theme={'black'}/>
            </div>
        </section>
    );
};

export { Video };
