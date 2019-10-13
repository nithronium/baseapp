import * as React from 'react';

interface Props {
    prizes: Array<{
        name: string;
    }>;
}

class Hero extends React.Component<Props> {
    public prizes(p) {
        return p.map((prize, index) => {
            return (
                <div className="prize" key={index}>
                    {prize.name}
                </div>
            );
        });
    }
    // tslint:disable
    public render() {
        return (
            <section id="top">
                <div className="container">
                    <div className="hero-content">
                        <div className="main-block">
                            <p className="hash">#WinWithEmirex</p>
                            <h1>Join Our Viral Referral Campaign</h1>
                            <p className="right-align">
                                <span className="accented">We’re offering 100 prizes</span>
                            </p>
                            <div className="plus-block">
                                <div className="left">
                                    <div className="currency">in Bitcoin</div>
                                    <div className="value">
                                        <span className="prefix">USD</span> $100,000
                                    </div>
                                </div>
                                <div className="middle">+</div>
                                <div className="right">
                                    <div className="value">
                                        <span className="prefix">USD</span> $100,000
                                    </div>
                                    <div className="currency">in EMRX</div>
                                </div>
                            </div>
                            <div className="button-holder">
                                <a href="#referral-code" className="hero-button">
                                    Get a code
                                </a>
                            </div>
                        </div>
                        <div className="aside-block">{this.props.children}</div>
                    </div>
                    {/* <div className="prizes-holder">
                            {this.prizes(this.props.prizes)}
                        </div> */}
                </div>
            </section>
        );
    }
}

export { Hero };
