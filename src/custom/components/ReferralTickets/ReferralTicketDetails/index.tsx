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
    legend: ReferralTicketInterface[];
    filteredLegend: ReferralTicketInterface[];
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
            legend: this.props.context && this.props.context.legend,
            filteredLegend: [],
        };

        this.loadMore = this.loadMore.bind(this);
        this.filterLegend = this.filterLegend.bind(this);
    }

    public filterLegend(e) {
        const filter = e.target.dataset.filter;
        let activeArray;
        let inactiveArray;
        const legendArray = this.state.legend && this.state.legend.length ? this.state.legend : this.props.context && this.props.context.legend;

        // if filter is not all, preserve copy of original array
        if (filter !== 'all'){
            this.unfiltered = this.state.legend;
        }

        inactiveArray = legendArray.filter(record => {
            return record.active === 'no';
        });

        activeArray = legendArray.filter(record => {
            return record.active === 'yes';
        });

        switch (filter){
            case 'all':
                this.setState({
                    filteredLegend: [],
                });
                break;
            case 'active':
                this.setState({
                    filteredLegend: activeArray,
                });
                break;
            case 'inactive':
                this.setState({
                    filteredLegend: inactiveArray,
                });
                break;
            default:
                this.setState({
                    filteredLegend: [],
                });
                break;

        }
    }

    public getTotal(column, mode = 'default', condition?) {

        let legendArray = this.state.legend && this.state.legend.length ? this.state.legend : this.props.context && this.props.context.legend;

        if (this.state.filteredLegend.length !== 0) {
            legendArray = this.state.filteredLegend;
        }

        if (!legendArray) {
            return 0;
        }

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

    public loadMore(){

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

    }

    public render(){

        let legendArray: ReferralTicketInterface[] = [];

        if (this.props.context && this.props.context.legend) {
            legendArray = this.props.context.legend;
        }

        if (this.state.legend && this.state.legend.length) {
            legendArray = this.state.legend;
        }

        if (this.state.filteredLegend.length !== 0) {
            legendArray = this.state.filteredLegend;
        }

        return(

            <div className="referral-ticket-details">
                <div className="container">
                    <div className="left"><h2>Referral tickets details</h2></div>
                    <div className="right">
                        <a href="#!" onClick={this.filterLegend} data-filter="all" className="referral-filter active">all</a> /
                        <a href="#!" onClick={this.filterLegend} data-filter="active" className="referral-filter">active</a> /
                        <a href="#!" onClick={this.filterLegend} data-filter="inactive" className="referral-filter">inactive</a>
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
                            <tr>
                                <td colSpan={5}><a className="lazy-trigger" href="#!" onClick={this.loadMore}>more</a></td>
                            </tr>
                            <tr>
                                <td colSpan={5}><span className="table-summary-header">total</span></td>
                            </tr>
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
