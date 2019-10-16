import * as React from 'react';
import { connect } from 'react-redux';
import { RootState, selectUserInfo, User } from '../../../../modules';

interface ReduxProps {
    user: User;
}

interface PassedProps {
    totalTickets: number;
}

type Props = ReduxProps & PassedProps;

class ReferralBallanceContainer extends React.Component<Props> {
    public render() {
        return (
            <div className="container recalculate">
                <div className="header">
                    <h1>Referral balance</h1>
                </div>
                <div className="contexter">
                    <div className="cards-wrapper">{this.props.children}</div>
                    <div className="referral-summary">
                        <div className="total-container">
                            <b>Total tickets</b>: {this.props.totalTickets}
                        </div>
                        <div className="referral-container">
                            <a href="/profile">Get your referral code</a>
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

export const ReferralBallance = connect(mapStateToProps)(ReferralBallanceContainer);
