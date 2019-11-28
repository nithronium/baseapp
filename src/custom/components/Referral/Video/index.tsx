import * as React from 'react';
import Button from '../Button';

// tslint:disable
import "node_modules/video-react/dist/video-react.css";
import { Player } from 'video-react';

import campaign = require('../../../assets/images/referral/campaign-bar.png');
// import video = require('../../../assets/images/referral/video.svg');

const Video = (props) => {
    return (
        <section id="video">
            <div className="container_">
                <div className="header">
                    <h4>{props.text}</h4>
                    <div className="win-with-emirex">#WinWithEmirex</div>
                    <img src={campaign} className="campaign" alt="" />
                </div>
                <div className="video-wrap">
                <Player
                    fluid={false}
                    playsInline
                    src={require('../../../assets/video/Referral.mp4')}
                    width={360}
                        height={200}
                        autoPlay={true}
                        muted={true}
                />
                </div>
                </div>
            <div className="button-container">
                <Button theme={'black'}/>
            </div>
        </section>
    );
};

export { Video };
