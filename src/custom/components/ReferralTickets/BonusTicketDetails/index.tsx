import * as React from 'react';
import { ReferralTicketsPayload } from '../../../modules/referralTickets';

interface Props {
    context: ReferralTicketsPayload['bonuses'];
}

const tableRow = (legendArray: ReferralTicketsPayload['bonuses']): React.ReactNode => {return legendArray.map((record, index) => {
        return(
            <tr key={index}>
                <td><span className="count">{record.tickets} <span className="explanation">tickets</span></span></td>
                <td>{record.action}</td>
                <td><a href={record.link}>Follow link</a></td>
            </tr>
        );
    });
};

class BonusTicketDetails extends React.Component<Props>{

    constructor(props){
        super(props);
        //this.loadMore = this.loadMore.bind(this);
    }

    public getTotal(column, mode = 'default', condition?){

        const legendArray = this.props.context || [];
        let total = 0;

        legendArray.map((record, index) => {

            const value2add = mode === 'default' ? record[column] : 1;

            if (!condition){
                total += value2add;
                return true;
            }else{

                if (condition.indexOf('!') >= 0){

                    if (record[column] !== condition.replace('!', '')){
                        total += value2add;
                    }
                }else{

                    if (record[column] === condition){
                        total += value2add;
                    }
                }

            }

            return true;

        });

        return total;
    }

    /*public loadMore(){

        fetch('/json/ReferralTickets/bonus_more.json')
        .then(async res => res.json())
        .then(
            result => {
                this.setState({
                    legend: result['bonus-ballance'].legend,
                });
            },

            error => {
                //console.log(error);
            },
        );

    }*/

    public render(){

        const legendArray: ReferralTicketsPayload['bonuses'] = this.props.context || [];

        return(

            <div className="bonus-ticket-details">
                <div className="container column">
                    <h2>Bonus ticket details</h2>
                    <table>
                        <tbody>
                            {tableRow(legendArray)}
                        </tbody>
                        <tfoot>
                            {/*<tr><td colSpan={3}><a className="lazy-trigger" href="#!" onClick={this.loadMore}>more</a></td></tr>*/}
                            <tr><td style={{paddingBottom: 0}} colSpan={3}><span className="table-summary-header">total</span></td></tr>
                            <tr>
                                <td><span className="count">{this.getTotal('count')}</span> tickets</td>
                                <td>{this.getTotal('posts', 'count')} posts</td>
                                <td>&nbsp;</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        );
    }
}

export { BonusTicketDetails };
