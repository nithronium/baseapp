import * as React from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {
    BonusPayload,
    ReferralOverallPayload,
} from '../../../modules/referralTickets';
import {IconClipBoard} from './icon-clipboard';
import {styles} from './styles';

// import { Loader } from '../../Loader';

interface Props {
    context: ReferralOverallPayload['bonuses'];
    // loading: boolean;
    message: ({}) => string;
}

interface BonusTicketsDetailRowProps {
    record: BonusPayload;
    message: ({}) => string;
}

const BonusTicketsDetailRow: React.FC<BonusTicketsDetailRowProps> = ({record, message}) => {
    return (
        <tr>
            <td><span className="count">{record.count} <span className="explanation">tickets</span></span></td>
            <td>{message({ id: record.state ? 'tickets.yes' : 'tickets.no' })}</td>
            <td>{record.subscription}</td>
            <td>
                <span style={styles.actionCode} title={record.action}>{record.action}</span>
                <CopyToClipboard text={record.action}>
                    <IconClipBoard style={styles.icon} />
                </CopyToClipboard>
            </td>
            <td><a href={record.link}>Follow link</a></td>
        </tr>
    );
};

const BonusTicketDetails: React.FC<Props> = ({context = [], message}) => {
    const tableRows = context.map((record, index) => (
        <BonusTicketsDetailRow
            key={index}
            record={record}
            message={message}
        />
        ));

    const getTotal = (column, mode = 'default', condition?): number => {
        let total = 0;
        context.map(record => {
            const value2add = mode === 'default' ? parseInt(record[column], 10) : 1;
            if (!condition){
                total += value2add;
            } else {
                if (condition.indexOf('!') >= 0){
                    if (record[column] !== condition.replace('!', '')){
                        total += value2add;
                    }
                } else if (record[column] === condition){
                    total += value2add;
                }
            }
        });

        return total;
    };

    return (
        <div className="bonus-ticket-details">
            <div className="container column">
                <div className="container wrap">
                    <div className="left"><h2>{message({id: 'tickets.bonus_detail'})}</h2></div>
                </div>
                <div className="table-wrap">
                    {/* <Loader display={this.props.loading} /> */}
                    <table style={styles.grid}>
                        <thead>
                            <tr>
                                <td>{message({ id: 'tickets.tickets_B' })}</td>
                                <td>{message({ id: 'tickets.active' })}</td>
                                <td>{message({ id: 'tickets.sub' })}</td>
                                <td>{message({ id: 'tickets.post' })}</td>
                                <td>{message({ id: 'tickets.link' })}</td>
                            </tr>
                        </thead>
                        <tbody>
                            {tableRows}
                        </tbody>
                        <tfoot>
                            <tr><td style={{paddingBottom: 0}} colSpan={3}><span className="table-summary-header">{message({ id: 'tickets.total' })}</span></td></tr>
                            <tr>
                                <td>
                                    <span className="count">{getTotal('count')}</span> {message({ id: 'tickets.tick' })}
                                </td>
                                <td>
                                    <span className="count">{getTotal('state')}</span> {message({ id: 'tickets.state' })}
                                </td>
                                <td>
                                    <span className="count">{getTotal('subscription', 'count')}</span> {message({ id: 'tickets.subscriptions' })}
                                </td>
                                <td>
                                    <span className="count">{getTotal('posts', 'count')}</span> {message({ id: 'tickets.posts' })}
                                </td>
                                <td>&nbsp;</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};


export { BonusTicketDetails };
