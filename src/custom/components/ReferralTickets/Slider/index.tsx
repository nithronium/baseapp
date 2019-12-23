import * as React from 'react';
import ItemsCarousel from 'react-items-carousel';

interface SliderState {
    activeItemIndex: number;
}

interface SliderProps {
    tickets: number[];
    message: ({}) => string;
}

const ticketCSS: React.CSSProperties = {
    padding: '20px 0',
    borderRadius: '5px',
    fontSize: '1.5em',
    backgroundColor: 'white',
    maxWidth: '150px',
    textAlign: 'center',
    overflow: 'hidden',
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
        const {tickets, message} = this.props;
        const {activeItemIndex} = this.state;

        return (
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: ` 0 ${chevronWidth + 20}px` }}>
                <h2>{message({ id: 'activeTickets' })}</h2>
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
