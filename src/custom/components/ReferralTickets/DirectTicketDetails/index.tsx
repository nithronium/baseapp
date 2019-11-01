import * as React from 'react';
import { User } from '../../../../modules';
import { ReferralTicketsPayload } from '../../../modules/referralTickets';
import { Loader } from '../../Loader';
interface DirectTicketInterface {
    count: number;
    action: string;
}

interface Props {
    context: ReferralTicketsPayload['direct'];
    overall: ReferralTicketsPayload['overall']['direct'];
    loading: boolean;
    user: User;
}

const tickets = (n: number): string => {
    return n === 1 ? 'ticket' : 'tickets';
};

class DirectTicketDetails extends React.Component<Props>{

    public render(){
        const ctx = this.props.context;
        const reg = ctx.ticketsForRegistration;
        return(
            <div className="direct-ticket-details">
                <div className="container">
                    <div className="container-wrapper">
                        <h2 style={{paddingBottom: '30px'}}>Direct ticket details</h2>
                        <div style={{position: 'relative'}}>
                            <Loader display={this.props.loading} />
                            <p className="table-margin">overall {this.props.overall.active} active tickets, {this.props.overall.inactive} inactive tickets<br/>&nbsp;</p>
                            <div className="table-wrap">
                                <table>
                                    <thead>
                                        <tr>
                                            <td>Active tickets</td>
                                            <td>Inactive tickets</td>
                                            <td/>
                                            <td/>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td><span className="count">{reg.active}</span><span className="explanation"> {tickets(reg.active)}</span></td>
                                        <td><span className="count">{reg.inactive}</span><span className="explanation"> {tickets(reg.inactive)}</span></td>
                                        <td colSpan={2}><span className="count">tickets for registration</span></td>
                                    </tr>
                                    {reg.inactive ? this.ticketActivation() : null}
                                    <tr>
                                        <td><span className="count">{ctx.usd.active} </span><span className="explanation">{tickets(ctx.usd.active)}</span></td>
                                        <td><span className="count">{ctx.usd.inactive} </span><span className="explanation">{tickets(ctx.usd.inactive)}</span></td>
                                        <td><span className="count">{`balance ${ctx.usd.balance.toFixed(2)} USD`}</span></td>
                                        <td><span className="count"><a href="/wallets"><button className="button">Get More</button></a></span></td>
                                    </tr>
                                    <tr>
                                        <td><span className="count">{ctx.emrx.active} </span><span className="explanation">{tickets(ctx.emrx.active)}</span></td>
                                        <td><span className="count">{ctx.emrx.inactive} </span><span className="explanation">{tickets(ctx.emrx.inactive)}</span></td>
                                        <td><span className="count">{`EMRX tokens worth ${ctx.emrx.balance.toFixed(2)} USD`}</span></td>
                                        <td><span className="count"><a href="/wallets"><button className="button">Get More</button></a></span></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // tslint:disable
    private ticketActivation(){
        const ctx = this.props.context;
        const user = this.props.user;
        const isNeededTopup = ctx.usd.balance < 50 && ctx.emrx.balance < 25;
        const isNeededRefcode = !user.referral_uid;

        const topup = (
            <tr>
                <td/>
                <td colSpan={2}><span className="explanation"> - Top up your balance</span></td>
                <td><span className="count"><a href="/wallets"><button className="button">Top Up</button></a></span></td>
               
            </tr>
        );

        const refcode = (
            <tr>
                <td/>
                <td colSpan={2}><span className="explanation"> - Enter an existing referral code</span></td>
                <td><span className="count"><a href="/profile"><button className="button">Enter Code</button></a></span></td>
            </tr>
        )
        return (
            <>
            <tr>
                <td colSpan={4}>To Activate a Ticket:</td>
            </tr>
            {isNeededRefcode ? refcode : null}
            {isNeededTopup ? topup : null}
            </>
        );
    }
}

export {DirectTicketDetails, DirectTicketInterface};
