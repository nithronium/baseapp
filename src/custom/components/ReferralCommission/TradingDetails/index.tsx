import * as React from 'react';
import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import { getReferral } from '../../../../api';
import { exportToCsv } from '../../../helpers';

interface PassedProps {
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
    precision: number;
    entity: 'ieo' | 'trade';
    changePage(currencyId, type, skip, limit): void;
}

interface State {
    referrals: [];
}

type Props = InjectedIntlProps & PassedProps;

class TradingDetailsComponent extends React.Component<Props, State>{

    constructor(props){

        super(props);
        this.state = {
            referrals: this.props.context && this.props.context.referrals,
        };

        //this.loadMore = this.loadMore.bind(this);

    }

    public tbodies = rowsArray => {
            return rowsArray.map((record, index) => {
            const l1Commissions = +record.l1_commissions;
            const l2Commissions = +record.l2_commissions;
            const total = l1Commissions + l2Commissions;

            const l1CommissionsDisp = this.formatFloat(l1Commissions, this.props.precision);
            const l2CommissionsDisp = this.formatFloat(l2Commissions, this.props.precision);
            const totalDisp = this.formatFloat(total, this.props.precision);

            return(
            <tbody key={index} className="summary-row">
                <tr>
                    <td className="email-cell">{record.email}</td>
                    <td>{record.l1_trades}</td>
                    <td>{l1CommissionsDisp} <span className="explanation">{this.props.currencyId.toUpperCase()}</span></td>
                    {/* <td><div className="mobile-card-header"># of L2</div><div className="mobile-value">{record.referrals} <span className="explanation">referrals</span></div></td> */}
                    <td>{record.l2_trades}</td>
                    <td>{l2CommissionsDisp} <span className="explanation">{this.props.currencyId.toUpperCase()}</span></td>
                </tr>
                <tr><td colSpan={6}>{this.props.intl.formatMessage({id: 'referralCommission.tradingDetails.total'})}: {totalDisp} {this.props.currencyId.toUpperCase()}</td></tr>
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
        const disabledNext = ((this.props.context.skip as number) + (this.props.context.limit as number)) >= this.props.context.count;
        const disableExport = this.props.context.referrals.length < 1;

        const totalL1 = this.getTotal('l1_commissions');
        const totalL2 = this.getTotal('l2_commissions');
        const totalAll = totalL1 + totalL2;
        const totalL1Disp = this.formatFloat(totalL1, this.props.precision);
        const totalL2Disp = this.formatFloat(totalL2, this.props.precision);
        const totalAllDisp = this.formatFloat(totalAll, this.props.precision);

        return(

            <div className="trading-commission-details">
                <div className="container">
                    <h2>{this.props.header}</h2>
                </div>
                <div className="container column">
                    <table id="tc-details-list">
                        <thead>
                            <tr>
                                <td>{this.props.intl.formatMessage({id: 'referralCommission.tradingDetails.email'})}</td>
                                <td><div className="explanation">{this.props.intl.formatMessage({id: 'referralCommission.tradingDetails.l1Trades'})}</div></td>
                                <td><div className="explanation">{this.props.intl.formatMessage({id: 'referralCommission.tradingDetails.commissionL1'})} {this.props.currencyId.toUpperCase()}</div></td>
                                {/* <td><div className="explanation"># of </div>L2</td> */}
                                <td><div className="explanation">{this.props.intl.formatMessage({id: 'referralCommission.tradingDetails.l2Trades'})}</div></td>
                                <td><div className="explanation">{this.props.intl.formatMessage({id: 'referralCommission.tradingDetails.commissionL2'})} {this.props.currencyId.toUpperCase()}</div></td>
                            </tr>
                        </thead>
                        {this.tbodies(referrals)}
                        <tfoot>
                            <tr style={{ paddingTop: 0 }}>
                                <td>
                                    <div style={{ padding: '30px 0',display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '200px'}}>
                                            <button style={{background: disabledPrev ? 'gray' : '#00732F'}} disabled={disabledPrev} onClick={this.previousPage}>&larr; {this.props.intl.formatMessage({id: 'referralCommission.tradingDetails.prev'})}</button>
                                            <button style={{background: disabledNext ? 'gray' : '#00732F'}} disabled={disabledNext} onClick={this.nextPage}>{this.props.intl.formatMessage({id: 'referralCommission.tradingDetails.next'})} &rarr;</button>
                                    </div>
                                </td>
                                <td/>
                                <td/>
                                <td>
                                    <div style={{ padding: '30px 0',display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                                <button style={{background: disableExport ? 'gray' : '#00732F'}} disabled={disableExport} onClick={this.downloadCsv}>{this.props.intl.formatMessage({id: 'referralCommission.tradingDetails.exportToCsv'})}</button>
                                    </div>
                                </td>
                            </tr>
                            <tr><td><span className="table-summary-header">{this.props.intl.formatMessage({id: 'referralCommission.tradingDetails.total'})}</span></td><td className="footer-header">{this.props.intl.formatMessage({id: 'referralCommission.tradingDetails.l1Trades'})}</td><td className="footer-header">{this.props.intl.formatMessage({id: 'referralCommission.tradingDetails.commissionL1'})} {this.props.currencyId.toUpperCase()}</td><td className="footer-header">{this.props.intl.formatMessage({id: 'referralCommission.tradingDetails.l2Trades'})}</td><td className="footer-header">{this.props.intl.formatMessage({id: 'referralCommission.tradingDetails.commissionL2'})} {this.props.currencyId.toUpperCase()}</td></tr>
                            <tr><td>{totalAllDisp} {this.props.currencyId.toUpperCase()}</td><td>{this.getTotal('l1_trades')}</td><td>{totalL1Disp} {this.props.currencyId.toUpperCase()}</td><td>{this.getTotal('l2_trades')}</td><td>{totalL2Disp} {this.props.currencyId.toUpperCase()}</td></tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        );
    }

    private nextPage = () => {
        const limit = (this.props.context.limit || 10) as number;
        const skip = ((this.props.context.skip as number) || 0) + limit ;

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
            return record;
        });

        return total;
    }

    private formatFloat(float, precision) {
        const basefactor = 1 / (10 ** precision);
        return (float > 0 && float < basefactor) ? `< ${basefactor.toFixed(precision)}` : float.toFixed(precision);
    }
}

export const TradingDetails = injectIntl(TradingDetailsComponent);
