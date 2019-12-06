import * as React from 'react';
import { ReferralOverallPayload } from '../../../modules/referralTickets';
// import { Loader } from '../../Loader';

interface Props {
    context: ReferralOverallPayload['bonuses'];
    overall: ReferralOverallPayload['overall']['bonuses'];
    // loading: boolean;
    message: ({}) => string;
}

const tableRows = (legendArray: ReferralOverallPayload['bonuses']): React.ReactNode => {return legendArray.map((record, index) => {
        return(
            <tr key={index}>
                <td><span className="count">{record.tickets} <span className="explanation">tickets</span></span></td>
                <td/>
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

        legendArray.map(record => {

            const value2add = mode === 'default' ? parseInt(record[column], 10) : 1;

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

        const legendArray: ReferralOverallPayload['bonuses'] = this.props.context || [];

        return(

            <div className="bonus-ticket-details">
                <div className="container column">
                    <div className="container wrap">
                        <div className="left"><h2>{this.props.message({id: 'tickets.bonus_detail'})}</h2></div>
                    </div>
                    <div className="table-wrap">
                        {/* <Loader display={this.props.loading} /> */}
                        <table>
                            <thead>
                                <tr>
                                    <td>{this.props.message({ id: 'tickets.tickets_B' })}</td>
                                    <td>{this.props.message({ id: 'tickets.sub' })}</td>
                                    <td>{this.props.message({ id: 'tickets.post' })}</td>
                                    <td>{this.props.message({ id: 'tickets.link' })}</td>
                                </tr>
                            </thead>
                            <tbody>
                                {tableRows(legendArray)}
                            </tbody>
                            <tfoot>
                                {/*<tr><td colSpan={3}><a className="lazy-trigger" href="#!" onClick={this.loadMore}>more</a></td></tr>*/}
                                <tr><td style={{paddingBottom: 0}} colSpan={3}><span className="table-summary-header">{this.props.message({ id: 'tickets.total' })}</span></td></tr>
                                <tr>
                                    <td><span className="count">{this.getTotal('count')}</span> {this.props.message({ id: 'tickets.tick' })}</td>
                                    <td/>
                                    <td>{this.getTotal('posts', 'count')} {this.props.message({ id: 'tickets.posts' })}</td>
                                    <td>&nbsp;</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export { BonusTicketDetails };
