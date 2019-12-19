import * as React from 'react';
import { connect } from 'react-redux';
import { RootState,selectCurrentLanguage, selectUserInfo, User } from '../../../../modules';
import { buildPath } from '../../../helpers';


interface ReduxProps {
    user: User;
    currentLanguage: string;
}
//tslint:disable
interface PassedProps {
    totalTickets: number;
    message: ({})=>string;
}

type Props = ReduxProps & PassedProps;

class ReferralBallanceContainer extends React.Component<Props> {
    public render() {
        return (
            <div className="container recalculate">
                <div className="header">
                    <h1>{this.props.message({id: 'ticketsbalance.title'})}</h1>
                </div>
                <div className="contexter">
                    <div className="cards-wrapper">{this.props.children}</div>
                    <div className="referral-summary">
                        <div className="total-container">
                            <b> {this.props.message({id: 'tickets.total_tickets'})}</b>: {this.props.totalTickets}
                        </div>
                        <div className="referral-container">
                            <a href={buildPath("/profile", this.props.currentLanguage)}>
                                <button className="button">{this.props.message({id: 'tickets.get_code'})}</button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    user: selectUserInfo(state),
    currentLanguage: selectCurrentLanguage(state),
});

export const ReferralBallance = connect(mapStateToProps)(ReferralBallanceContainer);
