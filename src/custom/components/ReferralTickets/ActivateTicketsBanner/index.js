import * as React from 'react';

import { injectIntl } from 'react-intl';

import './style.css';
import { Link } from 'react-scroll';

const Banner = injectIntl(({intl}) => {
  const translate = (id) => intl.formatMessage({ id }); 
  const message = translate('activate.banner.message');
  const buttonText = translate('activate.banner.buttontext');
  return (
    <div className="activate-banner">
      <div className="activate-banner__wrapper">
        <p className="activate-banner__message">{message}</p>
        <div className="activate-banner__button-wrapper">
          <Link to="#" style={{textDecoration: 'none'}}>
            <span className="activate-banner__button">{buttonText}</span>
          </Link>
        </div>
      </div>
    </div>
  );
});

export { Banner };