import * as React from 'react';
import './banner.css';

const Banner: React.FC = ({children}) => {
  return (
    <section id="banner">
      <div className="grab-container">
        <div className="banner-container">
          <div className="banner">
            <img src={require('../../../../custom/assets/images/referral/banner-text.png')} className="grab" alt="" />
            <img src={require('../../../../custom/assets/images/referral/header-graphic.svg')} className="header-graphic" alt="" />
            <div className="button-container">
              <a href="#get-code" className="button yellow-button">Get a Code</a>
            </div>
          </div>
        </div>
        <div className="signup-container">
          {children}
        </div>
      </div>
      <div className="scroll-icon-container"/>
    </section>
  );
};
export {Banner};
