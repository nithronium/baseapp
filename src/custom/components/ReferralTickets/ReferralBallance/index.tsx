import * as React from 'react';
import { connect } from 'react-redux';
import { RootState,selectCurrentLanguage, selectUserInfo, User } from '../../../../modules';
import { buildPath } from '../../../helpers';

interface MessageInterface {
    id: string;
}

interface ReduxProps {
    user: User;
    currentLanguage: string;
}
//tslint:disable
interface PassedProps {
    totalTickets: number;
    message: (obj: MessageInterface)=>string;
}

type Props = ReduxProps & PassedProps;

const filledBtnStyle: React.CSSProperties = {
    fontSize: '16px',
    borderRadius: '12px',
    fontWeight: 'bold',
    background: '#7ac600',
    border: '1px solid #7ac600',
    width: '250px',
};

const emptyBtnStyle: React.CSSProperties = {
    ...filledBtnStyle,
    color: '#7ac600',
    border: '1px solid #7ac600',
    background: 'white',
    marginRight: '20px',
    marginBottom: '10px',
};

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
                            <b>{this.props.message({id: 'tickets.total_tickets'})}</b>: {this.props.totalTickets}
                        </div>
                        <div className="referral-container">
                            <a
                                href="https://knowledge-base.emirex.com/how-can-i-activate-my-tickets"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <button style={emptyBtnStyle} className="button">{this.props.message({id: 'tickets.activate_tickets'})}</button>
                            </a>
                            <a href={buildPath("/profile", this.props.currentLanguage)}>
                                <button style={filledBtnStyle} className="button">{this.props.message({id: 'tickets.get_code'})}</button>
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
