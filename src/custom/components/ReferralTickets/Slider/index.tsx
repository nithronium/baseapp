import * as React from 'react';
import ItemsCarousel from 'react-items-carousel';

interface SliderState {
    activeItemIndex: number;
}

interface SliderProps {
    tickets: number[];
}

const ticketCSS: React.CSSProperties = {
    padding: '20px',
    borderRadius: '5px',
    fontSize: '1.5em',
    backgroundColor: 'white',
};

class Slider extends React.PureComponent<SliderProps, SliderState> {
    constructor(props) {
        super(props);
        this.state = {
            activeItemIndex: 0,
        };
        this.setIndex = this.setIndex.bind(this);
    }

    public render() {
        const chevronWidth = 40;
        const {tickets} = this.props;
        const {activeItemIndex} = this.state;

        return (
            <div style={{ padding: `0 ${chevronWidth}px` }}>
                <ItemsCarousel
                    requestToChangeActive={this.setIndex}
                    activeItemIndex={activeItemIndex}
                    numberOfCards={5}
                    gutter={20}
                    leftChevron={<button>{'<'}</button>}
                    rightChevron={<button>{'>'}</button>}
                    outsideChevron={true}
                    chevronWidth={chevronWidth}
                >
                    {tickets.map(ticket => (<div style={ticketCSS}>{ticket}</div>))}
                </ItemsCarousel>
            </div>
        );
    }

    private setIndex(value) {
        this.setState({activeItemIndex: value});
    }
}

export {Slider};
