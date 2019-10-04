import React, {Component} from 'react';

class BonusTicketDetails extends Component{

    constructor(props){

        super(props);
        this.state = {
            legend: this.props.context
        };

        this.loadMore = this.loadMore.bind(this);

    }

    getTotal(column, mode = 'default', condition){

        var legend_array = this.state.legend.length ? this.state.legend : this.props.context.legend

        if(!legend_array)
            return 0;

        var total = 0;

        legend_array.map((record, index) => {

            var value2add = mode === 'default' ? record[column] : 1;

            if(!condition){
                total += value2add;
                return true;
            }else{

                if(condition.indexOf('!') >= 0){

                    if(record[column] !== condition.replace('!', '')){
                        total += value2add;
                    }
                }else{

                    if(record[column] === condition){
                        total += value2add;
                    }
                }

            }

            return true;

        });

        return total;
    }

    loadMore(){

        this.setState({
            filteredLegend: null
        })

        fetch('/json/ReferralTickets/bonus_more.json')
        .then(res => res.json())
        .then(
            result => {
                this.setState({
                    legend: result['bonus-ballance'].legend
                })
            },

            error => {
                console.log(error);
            }
        )
            
    }

    render(){

        var legend_array = [];

        if(this.props.context.legend)
            legend_array = this.props.context.legend

        if(this.state.legend.length)
            legend_array = this.state.legend

        return(

            <div className="bonus-ticket-details">
                <div className="container column">
                    <h2>Bonus ticket details</h2>
                    <table>
                        <tbody>
                        {legend_array.map((record, index) => {
                            return(
                                <tr key={index}>
                                    <td><span className="count">{record.count} <span className="explanation">tickets</span></span></td>
                                    <td>{record.subscription}</td>
                                    <td>{record.network_post}</td>
                                    <td><a href={record.network_post_url}>Follow link</a></td>
                                </tr>
                            )
                        })}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="4"><a className="lazy-trigger" href="#!" onClick={this.loadMore}>more</a></td>
                            </tr>
                            <tr>
                                <td colSpan="4"><span className="table-summary-header">total</span></td>
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
        )
    }
}

export default BonusTicketDetails;