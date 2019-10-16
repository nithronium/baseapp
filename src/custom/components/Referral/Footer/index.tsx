import * as React from 'react';
import { Copyright } from './Copyright';
import { Header } from './Header';
// import FooterBodyComponent from './FooterBody';

const Footer = () => {
    return (
        <div id="footer">
            {/* <MobileStartTrading /> */}
            <Header />
            {/* <FooterBodyComponent />  */}
            <Copyright />
        </div>
    );
};

export { Footer };
