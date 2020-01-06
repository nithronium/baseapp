import * as React from 'react';
/* tslint:disable */
import { injectIntl } from 'react-intl';

import './style.css';

const Banner = injectIntl(({intl}) => {
  const translate = (id) => intl.formatMessage({ id }); 
  const message = translate('activate.banner.message');
  const buttonText = translate('activate.banner.buttontext');
  return (
    <div className="activate-banner">
      <div className="activate-banner__wrapper">
        <p className="activate-banner__message">{message}</p>
        <div className="activate-banner__button-wrapper">

         <a
            href="https://knowledge-base.emirex.com/how-can-i-activate-my-tickets"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="activate-banner__button">{buttonText}</button>
            </a>

        </div>
      </div>
    </div>
  );
});

export { Banner };