import * as React from 'react';

interface ReferralTicketInterface {
    l1_referral: number;
    count: number;
    active: string;
    l2_referrals: number;
    l2_active: number;
}

interface Props {
    context: {
        legend: ReferralTicketInterface[];
    };
}

interface State {
    filter: string;
}

const tableRow = (legendArray: ReferralTicketInterface[]): React.ReactNode => {
    return legendArray.map((record, index) => {
        return(
            <tr key={index}>
                <td><span className="count">{record.count}</span> <span className="explanation">tickets</span></td>
                <td>{record.l1_referral}</td>
                <td>{record.active}</td>
                <td>{record.l2_referrals} <span className="explanation">referrals</span></td>
                <td>{record.l2_active} <span className="explanation">referrals</span></td>
            </tr>
        );
    });
};

class ReferralTicketDetails extends React.Component<Props, State>{
    public unfiltered: ReferralTicketInterface[] = [];

    constructor(props){

        super(props);
        this.state = {
           filter: 'all',
        };

        //this.loadMore = this.loadMore.bind(this);
        this.filterLegend = this.filterLegend.bind(this);
    }

    public filtered(): ReferralTicketInterface[] {
        const legendArray = this.props.context && this.props.context.legend || [];
        switch (this.state.filter) {
            case 'active':
                return legendArray.filter(record => record.active === 'yes');
            case 'inactive':
                return legendArray.filter(record => record.active === 'no');
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
            const value2add = mode === 'default' ? record[column] : 1;
            if (!condition){
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

    /*public loadMore(){

        this.setState({
            filteredLegend: [],
        });

        fetch('/json/ReferralTickets/referral_more.json')
        .then(async res => res.json())
        .then(
            result => {
                this.setState({
                    legend: result['referral-ballance'].legend,
                });
            },

            error => {
                //console.log(error);
            },
        );

    }*/


    public render(){
        const filterClassName = dataFilter => {
            return `referral-filter${dataFilter === this.state.filter ? ' active' : ''}`;
        };

        const legendArray = this.filtered();

        return(

            <div className="referral-ticket-details">
                <div className="container">
                    <div className="left"><h2>Referral tickets details</h2></div>
                    <div className="right">
                        <a href="#!" onClick={this.filterLegend} data-filter="all" className={filterClassName('all')}>all</a> /
                        <a href="#!" onClick={this.filterLegend} data-filter="active" className={filterClassName('active')}>active</a> /
                        <a href="#!" onClick={this.filterLegend} data-filter="inactive" className={filterClassName('inactive')}>inactive</a>
                    </div>
                </div>
                <div className="container column">
                    <table id="referral-details-list">
                        <thead>
                            <tr>
                                <td>Tickets</td>
                                <td>L1 referral</td>
                                <td>L1 active</td>
                                <td>L2 referrals</td>
                                <td>L2 active</td>
                            </tr>
                        </thead>
                        <tbody>
                        {tableRow(legendArray)}
                        </tbody>
                        <tfoot>
                            {/*<tr><td colSpan={5}><a className="lazy-trigger" href="#!" onClick={this.loadMore}>more</a></td></tr>*/}
                            <tr><td style={{paddingBottom: 0}} colSpan={5}><span className="table-summary-header">total</span></td></tr>
                            <tr>
                                <td><span className="count">{this.getTotal('count')}</span> <span className="explanation">tickets</span></td>
                                <td>{this.getTotal('l1_referral', 'count')} referreres</td>
                                <td>yes {this.getTotal('active', 'count', 'yes')} / no {this.getTotal('active', 'count', 'no')} </td>
                                <td>{this.getTotal('l2_referrals')} <span className="explanation">referrals</span></td>
                                <td>{this.getTotal('l2_active')} <span className="explanation">referrals</span></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        );
    }
}

export {ReferralTicketDetails};
