import * as React from 'react';
import { connect } from 'react-redux';
import { RootState, selectUserInfo, User } from '../../../../modules';

export interface ReferralHeaderInterface {
    commission: {
        trade: number[];
        ieo: number[];
    };
    earned: {
        trade: number;
        ieo: number;
    };
    loading: boolean;
}

interface ReduxProps {
    user: User;
}

interface PassedProps {
    context: ReferralHeaderInterface;
    title: string;
    link: string;
    currencyId: string;
}

type Props = ReduxProps & PassedProps;
//tslint:disable
class ReferralHeaderContainer extends React.Component<Props> {    
    public render() {
        const total = (this.props.context.earned.trade || 0) + (this.props.context.earned.ieo || 0);
        return (
            <div className="container recalculate">
                <div className="header">
                    <h1>Referral ballance</h1>
                    <a href="#!" className="round-button default arrow">
                        {this.props.currencyId}
                    </a>
                </div>
                <div className="contexter">
                    <div className="cards-wrapper">
                        {this.props.children}
                        <div className="summary recalculate">
                            <div className="title">{this.props.title}</div>
                            <div className="summary-container">
                                <div className="btc">{total} {this.props.currencyId}</div>
                                {/* <div className="usd">{this.props.context.usd} USD</div> */}
                                {/* <a className="details-link" href={this.props.link}>
                                    view details
                                </a> */}
                                <div className="referral-code">
                                    {/* <div className="header">
                                        Your referral code:
                                    </div>
                                    <div className="code">
                                        {this.props.user.uid}
                                    </div> */}
                                <a href="/profile">Get Your Referral Code</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    user: selectUserInfo(state),
});

export const ReferralHeader = connect(mapStateToProps)(ReferralHeaderContainer);
