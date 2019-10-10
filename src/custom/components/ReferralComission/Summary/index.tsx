import * as React from 'react';

interface Props {
    context: {
        legend: [];
    };
    entity: 'ieo' | 'summary' | 'trading';
    header: string;
}

class Summary extends React.Component<Props>{

    public getTotal(column, mode = 'default', condition?){

        const legendArray = this.props.context && this.props.context.legend || [];
        let total = 0;

        legendArray.map(record => {

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

    public tableRows = legendArray => {
        return legendArray.map((record, index) => {
            return(
            <tr key={index}>
                <td><div className="mobile-card-header">E-mail</div><div className="mobile-value">{record.email}</div></td>
                <td><div className="mobile-card-header">Level</div><div className="mobile-value">{record.level} <span className="explanation">referral</span></div></td>
                <td><div className="mobile-card-header">Type</div><div className="mobile-value">{record.type}</div></td>
                <td><div className="mobile-card-header">IEO Name</div><div className="mobile-value">{record.ieo_name}</div></td>
                <td><div className="mobile-card-header">Earned (BTC)</div><div className="mobile-value">{record.earned} <span className="explanation">BTC</span></div></td>
                <td><div className="mobile-card-header">Date</div><div className="mobile-value">{record.date} </div></td>
            </tr>
            );
    });}

    /*public loadMore() {

        this.setState({
            filteredLegend: null,
        });

        const url = `/json/ReferralComission/${this.props.entity}_more.json`;

        fetch(url)
        .then(async res => res.json())
        .then(
            result => {
                this.setState({
                    legend: result[this.props.entity].legend,
                });
            },

            error => {
                //console.log(error);
            },
        );

    }*/

    public render() {

        let legendArray = [];

        if (this.props.context && this.props.context.legend) {
            legendArray = this.props.context.legend;
        }

        return(

            <div className="trading-comission-details">
                <div className="container">
                    <h2>{this.props.header}</h2>
                </div>
                <div className="container column">
                    <table className="summary-details">
                        <thead>
                            <tr>
                                <td>E-mail</td>
                                <td><div className="explanation">Level</div>trades</td>
                                <td>Type</td>
                                <td>IEO Name</td>
                                <td>Earned (BTC)</td>
                                <td>Date</td>
                            </tr>
                        </thead>
                        <tbody>
                        {this.tableRows(legendArray)}
                        </tbody>
                    </table>
                    <div className="total-summary">
                        <div className="header">Total amount</div>
                        <div className="value">{this.getTotal('earned')}</div>
                    </div>
                </div>
            </div>
        );
    }
}

export {Summary};
