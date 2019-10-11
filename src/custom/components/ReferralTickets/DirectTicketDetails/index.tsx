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
        return(
            <div className="direct-ticket-details">
                <div className="container">
                    <div className="container-wrapper">
                        <h2>Direct ticket details</h2>
                        <table>
                            <tbody>
                            <tr>
                                <td><span className="count">{this.props.context.usdTickets} </span><span className="explanation">tickets</span></td>
                                <td><span className="count">{`Balance ${this.props.context.usdBalance} USD`}</span></td>
                                <td><span className="count"><button className="button">get more</button></span></td>
                            </tr>
                            <tr>
                                <td><span className="count">{this.props.context.emrxTickets} </span><span className="explanation">tickets</span></td>
                                <td><span className="count">{`EMRX tokens worth ${this.props.context.emrxBalance} USD`}</span></td>
                                <td><span className="count"><button className="button">get more</button></span></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export {DirectTicketDetails, DirectTicketInterface};
