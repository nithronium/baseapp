import * as React from 'react';
import logo = require('../../../../assets/images/referral/logo-emirex.svg');

// import SubscribeComponent from './Subscribe';

const Header = () => {
    return (
        <div className="logo">
            <img src={logo} width="162" alt="EMIREX LOGO" />
        </div>
    );
};

export { Header };
