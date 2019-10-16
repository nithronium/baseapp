import * as React from 'react';
import { Copyright } from './Copyright';
import { Header } from './Header';
// import FooterBodyComponent from './FooterBody';

const Footer = () => {
    return (
        <div id="footer">
            <div className="footer-wrapper">
                {/* <MobileStartTrading /> */}
                <Header />
                {/* <FooterBodyComponent />  */}
                <Copyright />
            </div>
        </div>
    );
};

export { Footer };
