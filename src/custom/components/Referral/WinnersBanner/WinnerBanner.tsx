import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import ItemsCarousel from 'react-items-carousel';
import './styles.css';
import { Winner, WinnerItem } from './WinnerItem';

const testData: Winner[] = [
    {
        number: 916772,
        value: 750,
        currency: 'EMRX',
    },
    {
        number: 841996,
        value: 750,
        currency: 'EMRX',
    },
    {
        number: 918203,
        value: 750,
        currency: 'EMRX',
    },
    {
        number: 841956,
        value: 750,
        currency: 'EMRX',
    },
    {
        number: 917195,
        value: 750,
        currency: 'EMRX',
    },
    {
        number: 841565,
        value: 750,
        currency: 'EMRX',
    },
    {
        number: 841459,
        value: 750,
        currency: 'EMRX',
    },
    {
        number: 920901,
        value: 3500,
        currency: 'TFT',
    },
    {
        number: 919293,
        value: 3500,
        currency: 'TFT',
    },
    {
        number: 549722,
        value: 500,
        currency: 'BURN',
    },
    {
        number: 548519,
        value: 500,
        currency: 'BURN',
    },
    {
        number: 841254,
        value: 500,
        currency: 'BURN',
    },
    {
        number: 917130,
        value: 500,
        currency: 'BURN',
    },
];

interface WinnersBannerState {
    activeItemIndex: number;
    winners: Winner[];
}

const classes = {
    wrapper: 'winners-carousel-inner-wrapper',
    rightChevronWrapper: 'winner-slider-btn',
    leftChevronWrapper: 'winner-slider-btn',
};


class WinnersBannerComponent extends React.PureComponent<InjectedIntlProps, WinnersBannerState> {
    constructor(props) {
        super(props);
        this.state = {
            activeItemIndex: 0,
            winners: [],
        };

        this.setIndex = this.setIndex.bind(this);

        this.getWinners().then(winners => this.setState({winners})).catch(e => false);
    }

    public render() {
        const chevronWidth = 40;
        const {activeItemIndex, winners} = this.state;
        const format = this.props.intl.formatMessage;
        return (
            <div id="winners-banner" className="winners-wrapper grab-container">
                <div className="winners-graz">
                    <div className="corner top-label"/>
                    <div className="corner bottom-label"/>
                    <div className="corner top-left"/>
                    <div className="corner bottom-left"/>
                    <h4>{format({id: 'page.referral.winnersbanner.graz'})}</h4>
                    <h6>{format({id: 'page.referral.winnersbanner.graz.1r'})}</h6>
                </div>
                <div className="winners-content">
                    <div className="winners-slider-label">
                        <div className="corner top-left"/>
                        <div className="corner top-right"/>
                        {format({id: 'page.referral.winnersbanner.date'})}
                    </div>
                    <div className="corner bottom-right"/>
                    <div className="corner top-right"/>
                    <ItemsCarousel
                        requestToChangeActive={this.setIndex}
                        activeItemIndex={activeItemIndex}
                        numberOfCards={5}
                        classes={classes}
                        leftChevron={'<'}
                        rightChevron={'>'}
                        chevronWidth={chevronWidth}
                    >
                        {winners.map(winner => (<WinnerItem key={winner.number} data={winner}/>))}
                    </ItemsCarousel>
                </div>
                <div className="winnes-content-mobile ">
                    {winners.map(winner => (<WinnerItem key={winner.number} data={winner}/>))}
                </div>
            </div>
        );
    }

    private setIndex(value) {
        this.setState({activeItemIndex: value});
    }

    private async getWinners(): Promise<Winner[]> {
        return new Promise(resolve => resolve(testData));
    }

}

export const WinnersBanner = injectIntl(WinnersBannerComponent);
