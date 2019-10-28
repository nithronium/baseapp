import * as React from 'react';
import { ReferralTicketsPayload } from '../../../modules/referralTickets';
interface DirectTicketInterface {
    count: number;
    action: string;
}

interface Props {
    context: ReferralTicketsPayload['user'];
}

class DirectTicketDetails extends React.Component<Props>{

    public render(){
        const ctx = this.props.context;
        return(
            <div className="direct-ticket-details">
                <div className="container">
                    <div className="container-wrapper">
                        <h2 style={{paddingBottom: '30px'}}>Direct ticket details</h2>
                        <p className="table-margin">overall {ctx.usdTickets + ctx.emrxTickets + 1} tickets<br/>&nbsp;</p>
                        <div className="table-wrap">
                            <table>
                                <tbody>
                                <tr>
                                    <td><span className="count">1</span><span className="explanation"> ticket</span></td>
                                    <td><span className="count">{ctx.ticketForRegistration ? 'activated' : 'not activated'}</span></td>
                                    <td><span className="count">{ctx.ticketForRegistration ? null : <button className="button"><a href="/wallets">activate</a></button>}</span></td>
                                </tr>
                                <tr>
                                    <td><span className="count">{ctx.usdTickets} </span><span className="explanation">tickets</span></td>
                                    <td><span className="count">{`balance ${ctx.usdBalance.toFixed(2)} USD`}</span></td>
                                    <td><span className="count"><button className="button"><a href="/wallets">get more</a></button></span></td>
                                </tr>
                                <tr>
                                    <td><span className="count">{ctx.emrxTickets} </span><span className="explanation">tickets</span></td>
                                    <td><span className="count">{`EMRX tokens worth ${ctx.emrxBalance.toFixed(2)} USD`}</span></td>
                                    <td><span className="count"><button className="button"><a href="/wallets">get more</a></button></span></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export {DirectTicketDetails, DirectTicketInterface};
