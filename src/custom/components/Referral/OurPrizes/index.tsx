import * as React from 'react';
import { TopPrize } from '../TopPrize';

interface State {
    topPrizes: [];
    regularPrizes: [];
}

export class OurPrizes extends React.Component<{}, State>{

    constructor(props){
        super(props);

        this.state = {
            topPrizes: [],
            regularPrizes: [],
        };
    }

    public componentDidMount(){
        fetch('/json/Referral/topPrizes.json')
            .then(async res => res.json())
            .then(
                result => {
                    this.setState({
                        topPrizes: result.topPrizes,
                    });
                },

                error => {
                    //console.log(error);
                },
            );

        fetch('/json/Referral/prizes.json')
            .then(async res => res.json())
            .then(
                result => {
                    this.setState({
                        regularPrizes: result.prizes,
                    });
                },

                error => {
                    //console.error(error);
                },
            );
    }

    public topPrizes(topPrizes){
        return topPrizes.map((prize, index) => {
            return(
                <TopPrize key={index} context={prize} />
            );
        });
    }

    public regularPrizes(regularPrizes){
        return regularPrizes.map((prize, index) => {
            return(
                <div className="regular-prize" key={index}>
                    {prize.name}
                </div>
            );
        });
    }

    public render(){

        return(
            <section id="our-prizes">
                <div className="container">
                    <h2 className="center-align">Our 100 prizes</h2>
                </div>
                <div className="container" id="top-prizes">
                    {this.topPrizes(this.state.topPrizes)}
                </div>
                <div className="container" id="regular-prizes">
                    <div className="prizes-holder">
                    {this.regularPrizes(this.state.regularPrizes)}
                    <div className="prizes-footer">
                        <div className="left"><a href="#!" className="hero-button">Get a code</a></div>
                        <div className="right"><div className="hash">#WinWithEmirex</div></div>
                    </div>
                    </div>
                </div>
            </section>
        );
    }
}
