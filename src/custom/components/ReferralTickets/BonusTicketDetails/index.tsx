import * as React from 'react';

interface BonusDetailsInterface {
    count: number;
    subscription: string;
    network_post: string;
    network_post_url: string;
}

interface Props {
    context: {legend: BonusDetailsInterface[]};
}

interface State {
    legend: BonusDetailsInterface[];
}

const tableRow = (legendArray: BonusDetailsInterface[]): React.ReactNode => {return legendArray.map((record, index) => {
        return(
            <tr key={index}>
                <td><span className="count">{record.count} <span className="explanation">tickets</span></span></td>
                <td>{record.subscription}</td>
                <td>{record.network_post}</td>
                <td><a href={record.network_post_url}>Follow link</a></td>
            </tr>
        );
    });
};

class BonusTicketDetails extends React.Component<Props, State>{

    constructor(props){

        super(props);
        this.state = {
            legend: this.props.context && this.props.context.legend,
        };

        this.loadMore = this.loadMore.bind(this);

    }

    public getTotal(column, mode = 'default', condition?){

        const legendArray = this.state.legend && this.state.legend.length ? this.state.legend : this.props.context && this.props.context.legend;

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

    public loadMore(){

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

    }

    public render(){

        let legendArray: BonusDetailsInterface[] = [];

        if (this.props.context && this.props.context.legend) {
            legendArray = this.props.context.legend;
        }

        if (this.state.legend && this.state.legend.length) {
            legendArray = this.state.legend;
        }

        return(

            <div className="bonus-ticket-details">
                <div className="container column">
                    <h2>Bonus ticket details</h2>
                    <table>
                        <tbody>
                            {tableRow(legendArray)}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={4}><a className="lazy-trigger" href="#!" onClick={this.loadMore}>more</a></td>
                            </tr>
                            <tr>
                                <td colSpan={4}><span className="table-summary-header">total</span></td>
                            </tr>
                            <tr>
                                <td><span className="count">{this.getTotal('count')}</span> tickets</td>
                                <td>{this.getTotal('subscription', 'count', '!No subscription')} subscriptions</td>
                                <td>{this.getTotal('posts', 'count')} posts</td>
                                <td><a href="#!">Open all links</a></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        );
    }
}

export { BonusTicketDetails };
