import * as React from 'react';

interface Props {
    context: {
        referrals: [];
        type: string;
        skip: number;
        limit: number;
        count: number;
        loading: boolean;
    };
    header: string;
    currencyId: string;
    entity: 'ieo' | 'trade';
    changePage(currencyId, type, skip, limit): void;
}

interface State {
    referrals: [];
}

class TradingDetails extends React.Component<Props, State>{

    constructor(props){

        super(props);
        this.state = {
            referrals: this.props.context && this.props.context.referrals,
        };

        //this.loadMore = this.loadMore.bind(this);

    }

    public tbodies = rowsArray => {
        return rowsArray.map((record, index) => {
            return(
            <tbody key={index} className="summary-row">
                <tr>
                    <td><div className="mobile-card-header">E-mail</div><div className="mobile-value">{record.email}</div></td>
                    <td><div className="mobile-card-header"># of L1</div><div className="mobile-value">{record.l1_trades}</div></td>
                    <td><div className="mobile-card-header">Commission L1 (BTC)</div><div className="mobile-value">{record.l1_commissions}</div></td>
                    {/* <td><div className="mobile-card-header"># of L2</div><div className="mobile-value">{record.referrals} <span className="explanation">referrals</span></div></td> */}
                    <td><div className="mobile-card-header"># of L2 trades</div><div className="mobile-value">{record.l2_trades} <span className="explanation">trades</span></div></td>
                    <td><div className="mobile-card-header"/><div className="mobile-value">{record.l2_commissions} <span className="explanation">BTC</span></div></td>
                </tr>
                {/* <tr><td colSpan={6}>total amount: {record.total_amount} BTC</td></tr> */}
            </tbody>
            );
        });
    }

    public render(){

        let referrals = [];

        if (this.props.context && this.props.context.referrals) {
            referrals = this.props.context && this.props.context.referrals;
        }

        if (this.state.referrals && this.state.referrals.length) {
            referrals = this.state.referrals;
        }

        const disabledPrev = this.props.context.skip <= 0;
        const disabledNext = (this.props.context.skip + this.props.context.limit) >= this.props.context.count;

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
                                {/* <td><div className="explanation"># of </div>L2</td> */}
                                <td><div className="explanation"># of </div>L2 trades</td>
                                <td>Commission L2<div className="explanation"> (BTC)</div></td>
                            </tr>
                        </thead>
                        {this.tbodies(referrals)}
                        <tfoot>
                            {/*<tr><td colSpan={3}><a className="lazy-trigger" href="#!" onClick={this.loadMore}>more</a></td><td colSpan={3}><a className="csv-trigger round-button" href="#!">export CSV</a></td></tr>*/}
                            {/* <tr><td><span className="table-summary-header">total</span></td><td className="footer-header"># of L1 trades</td><td className="footer-header">Commission L1 (BTC)</td><td className="footer-header"># of L2</td><td className="footer-header"># of L2 trades</td><td className="footer-header">Commission L2 (BTC)</td></tr> */}
                            {/* <tr><td>{this.getTotal('total_amount')} BTC</td><td>{this.getTotal('l1_trades')}</td><td>{this.getTotal('commission_l1')}</td><td>{this.getTotal('referrals')}</td><td>{this.getTotal('trades')}</td><td>{this.getTotal('commission_l2')} BTC</td></tr> */}
                        </tfoot>
                    </table>
                    <div style={{ padding: '40px 0',display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '200px'}}>
                            <button style={{background: disabledPrev ? 'gray' : '#00732F'}} disabled={disabledPrev} onClick={this.previousPage}>&larr; Prev</button>
                            <button style={{background: disabledNext ? 'gray' : '#00732F'}} disabled={disabledNext} onClick={this.nextPage}>Next &rarr;</button>
                    </div>
                </div>
            </div>
        );
    }

    private nextPage = () => {
        const limit = (this.props.context.limit || 10);
        const skip = (this.props.context.skip || 0) + limit;

        this.props.changePage(this.props.currencyId, this.props.context.type, skip, limit);
    }

    private previousPage = () => {
        const limit = (this.props.context.limit || 10);
        const skip = (this.props.context.skip || 0) - limit;

        this.props.changePage(this.props.currencyId, this.props.context.type, skip, limit);
    }

    // private getTotal(column, mode = 'default', condition?){

    //     const legendArray = //this.state.legend && this.state.legend.length ? this.state.legend :
    //         this.props.context && this.props.context.legend;

    //     let total = 0;

    //     if (!legendArray) {
    //         return total;
    //     }

    //     legendArray.map(record => {
    //         const value2add = mode === 'default' ? record[column] : 1;
    //         if (!condition){
    //             total += value2add;
    //         }else{
    //             if (record[column] === condition){
    //                 total += value2add;
    //             }
    //         }
    //     });

    //     return total;
    // }
}

export { TradingDetails };
