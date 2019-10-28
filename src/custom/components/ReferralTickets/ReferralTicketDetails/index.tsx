import * as React from 'react';
import { ReferralTicketsPayload } from '../../../modules/referralTickets';


interface Props {
    context: ReferralTicketsPayload['referrals'];
}

interface State {
    filter: string;
}

const tableRow = (legendArray: ReferralTicketsPayload['referrals']): React.ReactNode => {
    return legendArray.map((record, index) => {
        return(
            <tr key={index}>
                <td><span className="count">{record.tickets}</span> <span className="explanation">tickets</span></td>
                <td>{record.email}</td>
                <td>{record.isActive ? 'YES' : 'NO'}</td>
                <td>{record.subreferrals} <span className="explanation">referrals</span></td>
                <td>{record.activeSubreferrals} <span className="explanation">referrals</span></td>
            </tr>
        );
    });
};

class ReferralTicketDetails extends React.Component<Props, State>{

    constructor(props){

        super(props);
        this.state = {
           filter: 'all',
        };

        this.filterLegend = this.filterLegend.bind(this);
    }

    public filtered(): ReferralTicketsPayload['referrals'] {
        const legendArray = this.props.context || [];
        switch (this.state.filter) {
            case 'active':
                return legendArray.filter(record => !!record.isActive);
            case 'inactive':
                return legendArray.filter(record => !record.isActive);
            case 'all':
            default:
                return legendArray;
        }
    }

    public filterLegend(e) {
        const filter = e.target.dataset.filter;
        this.setState({filter});
    }

    public getTotal(column, mode = 'default', condition?) {

        const legendArray = this.filtered();

        let total = 0;

        legendArray.map((record, index) => {
            const isCondition = !(condition === undefined || condition === null);
            const value2add = mode === 'default' ? record[column] : 1;
            if (!isCondition){
                total += value2add;
                return true;
            }else{
                if (record[column] === condition){
                    total += value2add;
                }
            }
            return true;
        });
        return total;
    }

    public render(){
        const filterClassName = dataFilter => {
            return `referral-filter${dataFilter === this.state.filter ? ' active' : ''}`;
        };

        const legendArray = this.filtered();

        return(

            <div className="referral-ticket-details">
                <div className="container wrap">
                    <div className="left"><h2>Referral tickets details</h2></div>
                    <div className="right">
                        <a href="#!" onClick={this.filterLegend} data-filter="all" className={filterClassName('all')}>all</a> /
                        <a href="#!" onClick={this.filterLegend} data-filter="active" className={filterClassName('active')}>active</a> /
                        <a href="#!" onClick={this.filterLegend} data-filter="inactive" className={filterClassName('inactive')}>inactive</a>
                    </div>
                </div>
                <div className="table-wrap">
                    <table id="referral-details-list">
                        <thead>
                            <tr>
                                <td>Tickets</td>
                                <td>L1 referral</td>
                                <td>Active</td>
                                <td>L2 referrals</td>
                                <td>L2 active</td>
                            </tr>
                        </thead>
                        <tbody>
                        {tableRow(legendArray)}
                        </tbody>
                        <tfoot>
                            <tr><td style={{paddingBottom: 0}} colSpan={5}><span className="table-summary-header">total</span></td></tr>
                            <tr>
                                <td><span className="count">{this.getTotal('tickets') + this.getTotal('subreferrals')}</span> <span className="explanation">tickets</span></td>
                                <td>{this.getTotal('email', 'count')} referreres</td>
                                <td>yes {this.getTotal('isActive', 'count', 1)} / no {this.getTotal('isActive', 'count', 0)} </td>
                                <td>{this.getTotal('subreferrals')} <span className="explanation">referrals</span></td>
                                <td>{this.getTotal('activeSubreferrals')} <span className="explanation">referrals</span></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        );
    }
}

export {ReferralTicketDetails};
