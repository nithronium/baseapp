import * as React from 'react';

interface Props {
    context: {
        place: number;
        bitcoin: number;
        emrx: number;
    };
}

export class TopPrize extends React.Component<Props>{
    public render(){
        return(
            <div className="top-prize">
                <div className="place">{this.props.context.place} place</div>
                <div className="bitcoin">
                    <div className="value">
                        ${this.props.context.bitcoin}
                    </div>
                    <div className="explanation">
                        in Bitcoin
                    </div>
                </div>
                <div className="plus">+</div>
                <div className="emrx">
                    <div className="value">
                        ${this.props.context.emrx}
                    </div>
                    <div className="explanation">
                        in EMRX
                    </div>
                </div>
            </div>
        );
    }
}
