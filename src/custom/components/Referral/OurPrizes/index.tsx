import * as React from 'react';
import { EndPrize } from '../EndPrize';
import { TopPrize } from '../TopPrize';

interface Props {
    topPrizes: Array<{
        place: string;
        bitcoin: string;
        emrx: string;
    }>;
    prizes: Array<{
        name: string;
    }>;
}

export class OurPrizes extends React.Component<Props> {
    public topPrizes(topPrizes) {
        return topPrizes.map((prize, index) => {
            return <TopPrize key={index} context={prize} />;
        });
    }

    public regularPrizes(regularPrizes) {
        return regularPrizes.map((prize, index) => {
            return (
                <div className="regular-prize" key={index}>
                    {prize.name}
                </div>
            );
        });
    }

    public render() {
        return (
            <section id="our-prizes">
                <div className="container">
                    <h2 className="center-align">Our 100 prizes</h2>
                </div>
                <div className="container" id="top-prizes">
                    {this.topPrizes(this.props.topPrizes)}
                    <EndPrize />
                </div>
                <div className="container" id="regular-prizes">
                    <div className="prizes-holder">
                        {/* {this.regularPrizes(this.props.prizes)} */}
                        <div className="prizes-footer">
                            <div className="center">
                                <a href="#referral-code" className="hero-button">
                                    Get a code
                                </a>
                            </div>
                            <div className="right">
                                <div className="hash">#WinWithEmirex</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
