import * as React from 'react';
import { Link } from 'react-scroll';

const Banner: React.FC = ({children}) => {
  return (
    <section id="banner">
      <div className="grab-container">
        <div className="banner-container">
          <div className="banner">
            <img src={require('../../../../custom/assets/images/referral/banner-text.png')} className="grab" alt="" />
            <img src={require('../../../../custom/assets/images/referral/header-graphic.svg')} className="header-graphic" alt="" />
            <div className="button-container">
              <Link to="get-code" smooth={true} duration={500} className="button yellow-button">Get a Code</Link>
            </div>
          </div>
        </div>
        <div className="signup-container">
          {children}
        </div>
      </div>
    </section>
  );
};
export {Banner};
