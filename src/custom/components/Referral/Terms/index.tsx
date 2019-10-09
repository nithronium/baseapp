import * as React from 'react';

export class Terms extends React.Component{

    public render(){

        return(
            <section id="terms">
                <div className="container">
                    <div className="left">
                        <h2>Terms and Conditions</h2>
                        <p>Please read the terms and conditions to make sure that you are eligible to participate. </p>
                        <p>The draw will take place through the use of blockchain technology, self executing smart contracts will select the winners without human interference, guided by math and computer code only. This is to ensure complete transparency and independence. The draw will take place in Estonia, under the relevant EU rules. </p>
                        <p>To ensure that there is no fraud, only tickets activated by accounts with a portfolio balance of at least 50 USD  OR 25 USD worth of EMRX at the time of the draw will count as valid.</p>
                        <a href="#!" className="hero-button">Get a code</a>
                    </div>
                    <div className="right">
                        <div className="hash">
                            <p>#WinWithEmirex</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
