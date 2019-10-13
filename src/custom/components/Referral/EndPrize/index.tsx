import * as React from 'react';

// interface Props {
//     context: {
//         place: number;
//         bitcoin: number;
//         emrx: number;
//     };
// }
// tslint:disable
export class EndPrize extends React.Component {
    public render() {
        return (
            <div className="top-prize" style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div className="place">95 prizes of</div>
                <div
                    style={{
                        maxWidth: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <div className="value">$1500</div>
                    <div style={{ maxWidth: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className="bitcoin">
                            {/* <div className="value">$ 1500</div> */}
                            <div className="explanation">in Bitcoin</div>
                        </div>
                        <div className="plus" style={{ paddingRight: '10px' }}>
                            +
                        </div>
                        <div className="emrx">
                            {/* <div className="value">$ 1500</div> */}
                            <div className="explanation">in EMRX</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
