import * as React from 'react';
import { ReferralOverallPayload } from '../../../modules/referralTickets';

// import { Loader } from '../../Loader';
//tslint:disable
interface Props {
    context: any;
    overall: ReferralOverallPayload['overall']['referrals'];
    // loading: boolean;
    turnRight: () => void;
    turnLeft: () => void;
    page: number;
    disabledNext: boolean;
    disabledPrev: boolean;
    count: number;
    L2count: number;
    message: ({}) => string;
    countActive: number;
    L2countActive: number;
}

interface State {
    filter: string;
}

class ReferralTicketDetails extends React.Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            filter: 'all',
        };

        this.filterLegend = this.filterLegend.bind(this);
    }

    public tableRow = (legendArray: any): React.ReactNode => {
        return legendArray.map((record, index) => {
            return (
                <tr key={index}>
                    <td>
                        <span className="count">{record.tickets}</span>{' '}
                        <span className="explanation">{this.props.message({ id: 'tickets.tick' })}</span>
                    </td>
                    <td>{record.email}</td>
                    <td>
                        {record.isActive
                            ? `${this.props.message({ id: 'tickets.yes' })}`
                            : `${this.props.message({ id: 'tickets.no' })}`}
                    </td>
                    <td>
                        {record.subreferrals}{' '}
                        <span className="explanation">{this.props.message({ id: 'tickets.referrals' })}</span>
                    </td>
                    <td>
                        {record.activeSubreferrals}{' '}
                        <span className="explanation">{this.props.message({ id: 'tickets.referrals' })}</span>
                    </td>
                </tr>
            );
        });
    };

    public filtered(): any {
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
        this.setState({ filter });
    }

    public getTotal(column, mode = 'default', condition?) {
        const legendArray = this.filtered();

        let total = 0;

        legendArray.map((record, index) => {
            const isCondition = !(condition === undefined || condition === null);
            const value2add = mode === 'default' ? record[column] : 1;
            if (!isCondition) {
                total += value2add;
                return true;
            } else {
                if (record[column] === condition) {
                    total += value2add;
                }
            }
            return true;
        });
        return total;
    }

    public getOverall(key) {
        return this.props.overall[key];
    }

    public render() {
        // const filterClassName = dataFilter => {
        //     return `referral-filter${dataFilter === this.state.filter ? ' active' : ''}`;
        // };

        const legendArray = this.filtered();

        return (
            <div className="referral-ticket-details">
                <div className="container column">
                    <div className="container wrap">
                        <div className="left">
                            <h2>{this.props.message({ id: 'tickets.referral_detail' })}</h2>
                        </div>
                        {/* <div className="right">
                            <a href="#!" onClick={this.filterLegend} data-filter="all" className={filterClassName('all')}>all</a> /
                            <a href="#!" onClick={this.filterLegend} data-filter="active" className={filterClassName('active')}>active</a> /
                            <a href="#!" onClick={this.filterLegend} data-filter="inactive" className={filterClassName('inactive')}>inactive</a>
                        </div> */}
                    </div>
                    <div className="table-wrap">
                        {/* <Loader display={this.props.loading} /> */}
                        <table id="referral-details-list">
                            <thead>
                                <tr>
                                    <td>{this.props.message({ id: 'tickets.tickets' })}</td>
                                    <td>{this.props.message({ id: 'tickets.L1' })}</td>
                                    <td>{this.props.message({ id: 'tickets.active' })}</td>
                                    <td>{this.props.message({ id: 'tickets.L2' })}</td>
                                    <td>{this.props.message({ id: 'tickets.L2_active' })}</td>
                                </tr>
                            </thead>
                            <tbody>{this.tableRow(legendArray)}</tbody>
                            <tfoot>
                                <tr>
                                    <td style={{ paddingBottom: 0 }} colSpan={5}>
                                        <span className="table-summary-header">
                                            {this.props.message({ id: 'tickets.total' })}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className="count">
                                            {this.getTotal('tickets') /* + this.getTotal('subreferrals')*/}
                                        </span>{' '}
                                        <span className="explanation">{this.props.message({ id: 'tickets.tick' })}</span>
                                    </td>
                                    <td>
                                        {this.getTotal('email', 'count')} {this.props.message({ id: 'tickets.referrals' })}
                                    </td>
                                    <td>
                                        {this.props.message({ id: 'tickets.yes' })} {this.getTotal('isActive', 'count', 1)} /{' '}
                                        {this.props.message({ id: 'tickets.no' })} {this.getTotal('isActive', 'count', 0)}{' '}
                                    </td>
                                    <td>
                                        {this.getTotal('subreferrals')}{' '}
                                        <span className="explanation">{this.props.message({ id: 'tickets.referrals' })}</span>
                                    </td>
                                    <td>
                                        {this.getTotal('activeSubreferrals')}{' '}
                                        <span className="explanation">{this.props.message({ id: 'tickets.referrals' })}</span>
                                    </td>
                                </tr>

                                <tr>
                                    <td style={{ paddingBottom: 0, paddingTop: '15px' }} colSpan={5}>
                                        <span className="table-summary-header">
                                            {this.props.message({ id: 'tickets.overall' })}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className="count">{this.getOverall('active') + this.getOverall('inactive')}</span>{' '}
                                        <span className="explanation">{this.props.message({ id: 'tickets.tick' })}</span>
                                    </td>
                                    <td>
                                        {this.props.count} {this.props.message({ id: 'tickets.referrals' })}
                                    </td>
                                    <td>
                                        {this.props.message({ id: 'tickets.yes' })} {this.props.countActive} /
                                        {this.props.message({ id: 'tickets.no' })} {this.props.count - this.props.countActive}{' '}
                                    </td>
                                    <td>
                                        {this.props.L2count}{' '}
                                        <span className="explanation"> {this.props.message({ id: 'tickets.referrals' })}</span>
                                    </td>
                                    <td>
                                        {this.props.L2countActive}{' '}
                                        <span className="explanation">{this.props.message({ id: 'tickets.referrals' })}</span>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                        <div
                            style={{
                                padding: '40px 0',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: '200px',
                            }}
                        >
                            <button
                                style={{ background: this.props.disabledPrev ? 'gray' : '#00732F' }}
                                disabled={this.props.disabledPrev}
                                onClick={this.props.turnLeft}
                            >
                                {this.props.message({ id: 'tickets.prev' })}
                            </button>
                            <span>{this.props.page}</span>
                            <button
                                style={{ background: this.props.disabledNext ? 'gray' : '#00732F' }}
                                disabled={this.props.disabledNext}
                                onClick={this.props.turnRight}
                            >
                                {this.props.message({ id: 'tickets.next' })}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export { ReferralTicketDetails };
