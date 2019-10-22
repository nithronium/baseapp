import * as React from 'react';
import campaign = require ('../../../assets/images/referral/campaign-bar.png');
import video = require ('../../../assets/images/referral/video.svg');

const Video: React.FC = () => {
  return (
    <section id="video">
      <div className="container_">
        <div className="header">
          <h4>Watch the video to see how you can</h4>
          <div className="win-with-emirex">#WinWithEmirex</div>
          <img src={campaign} className="campaign" alt=""/>
        </div>
        <div className="video-wrap">
          <img src={video} alt=""/>
        </div>
      </div>
      <div className="button-container">
        <a href="#get-code" className="button black-button">Get a Code</a>
      </div>
    </section>
  );
};

export {Video};
