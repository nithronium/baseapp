import * as React from 'react';
import { Copyright } from './Copyright';
import { Header } from './Header';
// import FooterBodyComponent from './FooterBody';

const Licenses = () => {
    return (
        <div className="licenses">
            <h5>Operating Licenses</h5>
            <p>Financial services, providing a virtual currency wallet service; Number FRK000909</p>
            <p>
                Financial services, providing services of exchanging a virtual currency against a fiat currency; Number FVR001017
            </p>
            <p>Issuer of licences: Estonian Police and Boarder Guard Board (Politsei - ja Piirivalveamet)</p>
        </div>
    );
};

const Footer = () => {
    return (
        <div id="footer">
            <div className="footer-wrapper">
                {/* <MobileStartTrading /> */}
                <Header />
                {/* <FooterBodyComponent />  */}
                <Licenses />
                <Copyright />
            </div>
        </div>
    );
};

export { Footer };
