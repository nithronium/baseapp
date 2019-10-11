import * as React from 'react';

class HIW extends React.Component{

    public render(){

        return(
            <section id="hiw">
                <div className="container">
                    <h2>How it works</h2>
                    <p className="subheader">No purchase is necessary to take part in the referral program giveaway.</p>
                    <div className="steps">
                        <div className="step">
                            <h3>Step1</h3>
                            <p className="intro">
                                Create an account with an existing referral code.
                            </p>
                            <p className="text">
                                Once your account is set up, you’ll receive your own referral code to share. You’ll also receive your first ticket for the draw!
                            </p>
                        </div>
                        <div className="step">
                            <h3>Step2</h3>
                            <p className="intro">
                                Share your code to gain more tickets!
                            </p>
                            <p className="text">
                                You’ll receive two tickets for every person you refer and one ticket for every person they refer. Invite your friends!
                            </p>
                        </div>
                        <div className="step">
                            <h3>Step3</h3>
                            <p className="intro">
                                Activate tickets on Emirex.com.
                            </p>
                            <p className="text">
                            All tickets are initially set as ‘pending’. For a ticket to count toward the draw, it must be activated.
                            </p>
                        </div>
                    </div>
                    <div className="button-holder center-align">
                        <a href="#!" className="hero-button">Get a code</a>
                    </div>
                </div>
            </section>
        );
    }
}

export {HIW};
