import * as React from 'react';
import { getReferral } from '../../../../api';
import { exportToCsv } from '../../../helpers';

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
            const l1Commissions = record.l1_commissions as number;
            const l2Commissions = record.l2_commissions as number;
            const total = l1Commissions + l2Commissions;
            return(
            <tbody key={index} className="summary-row">
                <tr>
                    <td><div className="mobile-card-header">E-mail</div><div className="mobile-value">{record.email}</div></td>
                    <td><div className="mobile-card-header"># of L1</div><div className="mobile-value">{record.l1_trades}</div></td>
                    <td><div className="mobile-card-header">Commission L1</div><div className="mobile-value">{record.l1_commissions}</div></td>
                    {/* <td><div className="mobile-card-header"># of L2</div><div className="mobile-value">{record.referrals} <span className="explanation">referrals</span></div></td> */}
                    <td><div className="mobile-card-header"># of L2 trades</div><div className="mobile-value">{record.l2_trades} <span className="explanation">trades</span></div></td>
                    <td><div className="mobile-card-header"/><div className="mobile-value">{record.l2_commissions} <span className="explanation">BTC</span></div></td>
                </tr>
                <tr><td colSpan={6}>total amount: {total} {this.props.currencyId.toUpperCase()}</td></tr>
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
        const disableExport = this.props.context.referrals.length < 1;

        const totalL1 = this.getTotal('l1_commissions');
        const totalL2 = this.getTotal('l2_commissions');

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
                                <td>Commission L1<div className="explanation"> {this.props.currencyId.toUpperCase()}</div></td>
                                {/* <td><div className="explanation"># of </div>L2</td> */}
                                <td><div className="explanation"># of </div>L2 trades</td>
                                <td>Commission L2<div className="explanation"> {this.props.currencyId.toUpperCase()}</div></td>
                            </tr>
                        </thead>
                        {this.tbodies(referrals)}
                        <tfoot>
                            <tr style={{ paddingTop: 0 }}>
                                <td>
                                    <div style={{ padding: '30px 0',display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '200px'}}>
                                            <button style={{background: disabledPrev ? 'gray' : '#00732F'}} disabled={disabledPrev} onClick={this.previousPage}>&larr; Prev</button>
                                            <button style={{background: disabledNext ? 'gray' : '#00732F'}} disabled={disabledNext} onClick={this.nextPage}>Next &rarr;</button>
                                    </div>
                                </td>
                                <td/>
                                <td/>
                                <td>
                                    <div style={{ padding: '30px 0',display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                                <button style={{background: disableExport ? 'gray' : '#00732F'}} disabled={disableExport} onClick={this.downloadCsv}>Export to CSV</button>
                                    </div>
                                </td>
                            </tr>
                            <tr><td><span className="table-summary-header">total</span></td><td className="footer-header"># of L1 trades</td><td className="footer-header">Commission L1 {this.props.currencyId.toUpperCase()}</td><td className="footer-header"># of L2 trades</td><td className="footer-header">Commission L2 {this.props.currencyId.toUpperCase()}</td></tr>
                            <tr><td>{totalL1 + totalL2} {this.props.currencyId.toUpperCase()}</td><td>{this.getTotal('l1_trades')}</td><td>{totalL1}</td><td>{this.getTotal('l2_trades')}</td><td>{totalL2} {this.props.currencyId.toUpperCase()}</td></tr>
                        </tfoot>
                    </table>
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

    private downloadCsv = async () => {
        const fileName = `Export - ${this.props.entity}.csv`;
        const query = `/private/referrals?type=${this.props.entity}&currency_id=${this.props.currencyId}&skip=0&limit=${this.props.context.count}`;
        const json = await getReferral(query);
        if (json.referrals.length < 1) {return;}
        const rows: string[][] = [];
        rows.push(Object.keys(json.referrals[0]));
        for (const referral of json.referrals) {
            rows.push(Object.values(referral));
        }
        exportToCsv(fileName, rows);
    }

    private getTotal(column, mode = 'default', condition?){

        const legendArray = //this.state.legend && this.state.legend.length ? this.state.legend :
            this.props.context && this.props.context.referrals;

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
}

export { TradingDetails };
