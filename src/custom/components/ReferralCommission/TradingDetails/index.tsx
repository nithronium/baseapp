import * as React from 'react';

interface Props {
    context: {
        legend: [];
    };
    header: string;
    entity: 'ieo' | 'summary' | 'trading';
}

interface State {
    legend: [];
}

class TradingDetails extends React.Component<Props, State>{

    constructor(props){

        super(props);
        this.state = {
            legend: this.props.context && this.props.context.legend,
        };

        //this.loadMore = this.loadMore.bind(this);

    }

    public tbodies = legendArray => {
        return legendArray.map((record, index) => {
            return(
            <tbody key={index} className="summary-row">
                <tr>
                    <td><div className="mobile-card-header">E-mail</div><div className="mobile-value">{record.mail}</div></td>
                    <td><div className="mobile-card-header"># of L1</div><div className="mobile-value">{record.l1_trades}</div></td>
                    <td><div className="mobile-card-header">Commission L1 (BTC)</div><div className="mobile-value">{record.commission_l1}</div></td>
                    <td><div className="mobile-card-header"># of L2</div><div className="mobile-value">{record.referrals} <span className="explanation">referrals</span></div></td>
                    <td><div className="mobile-card-header"># of L2 trades</div><div className="mobile-value">{record.trades} <span className="explanation">trades</span></div></td>
                    <td><div className="mobile-card-header"/><div className="mobile-value">{record.commission_l2} <span className="explanation">BTC</span></div></td>
                </tr>
                <tr>
                    <td colSpan={6}>total amount: {record.total_amount} BTC</td>
                </tr>
            </tbody>
            );
        });
    }

    public render(){

        let legendArray = [];

        if (this.props.context && this.props.context.legend) {
            legendArray = this.props.context && this.props.context.legend;
        }

        if (this.state.legend && this.state.legend.length) {
            legendArray = this.state.legend;
        }

        return(

            <div className="trading-commission-details">
                <div className="container">
                    <h2>{this.props.header}</h2>
                </div>
                <div className="container column">
                    <table id="tc-details-list">
                        <thead>
                            <tr>
                                <td>E-mail</td>
                                <td><div className="explanation"># of L1 </div>trades</td>
                                <td>Commission L1<div className="explanation"> (BTC)</div></td>
                                <td><div className="explanation"># of </div>L2</td>
                                <td><div className="explanation"># of </div>L2 trades</td>
                                <td>Commission L2<div className="explanation"> (BTC)</div></td>
                            </tr>
                        </thead>
                        {this.tbodies(legendArray)}
                        <tfoot>
                            {/*<tr><td colSpan={3}><a className="lazy-trigger" href="#!" onClick={this.loadMore}>more</a></td><td colSpan={3}><a className="csv-trigger round-button" href="#!">export CSV</a></td></tr>*/}
                            <tr>
                                <td><span className="table-summary-header">total</span></td>
                                <td className="footer-header"># of L1 trades</td>
                                <td className="footer-header">Commission L1 (BTC)</td>
                                <td className="footer-header"># of L2</td>
                                <td className="footer-header"># of L2 trades</td>
                                <td className="footer-header">Commission L2 (BTC)</td>
                            </tr>
                            <tr>
                                <td>{this.getTotal('total_amount')} BTC</td>
                                <td>{this.getTotal('l1_trades')}</td>
                                <td>{this.getTotal('commission_l1')}</td>
                                <td>{this.getTotal('referrals')}</td>
                                <td>{this.getTotal('trades')}</td>
                                <td>{this.getTotal('commission_l2')} BTC</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        );
    }

    private getTotal(column, mode = 'default', condition?){

        const legendArray = //this.state.legend && this.state.legend.length ? this.state.legend :
            this.props.context && this.props.context.legend;

        let total = 0;

        if (!legendArray) {
            return total;
        }

        legendArray.map(record => {
            const value2add = mode === 'default' ? record[column] : 1;
            if (!condition){
                total += value2add;
            }else{
                if (record[column] === condition){
                    total += value2add;
                }
            }
        });

        return total;
    }

    /*private loadMore(){

        this.setState({
            filteredLegend: null,
        });

        const url = `/json/ReferralCommission/${this.props.entity}_more.json`;

        fetch(url)
        .then(async res => res.json())
        .then(
            result => {
                this.setState({
                    legend: result[`${this.props.entity}-commission`].legend,
                });
            },

            error => {
                //console.log(error);
            },
        );

    }*/
}

export { TradingDetails };
