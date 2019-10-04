import React, {Component} from 'react';

class ReferralTicketDetails extends Component{

	constructor(props){

		super(props);
		this.state = {
			legend: this.props.context,
			filteredLegend: null
		};

		this.loadMore = this.loadMore.bind(this);
		this.filterLegend = this.filterLegend.bind(this);

	}

	filterLegend = e => {
		var filter = e.target.dataset['filter'];
		var activeArray, inactiveArray;
		var legend_array = this.state.legend.length ? this.state.legend : this.props.context.legend
		
		// If filter is not all, preserve copy of original array
		if(filter !== 'all'){
			this.unfiltered = this.state.legend;
		}

		inactiveArray = legend_array.filter(record => {
			return record.active === "no"
		})

		activeArray = legend_array.filter(record => {
			return record.active === "yes"
		})

		switch(filter){
			case 'all':
				this.setState({
					filteredLegend: null
				})
				break
			case 'active':
				this.setState({
					filteredLegend: activeArray
				})
				break
			case 'inactive':
				this.setState({
					filteredLegend: inactiveArray
				})
				break
			default:
				this.setState({
					filteredLegend: null
				})
				break;

		}
	}

	getTotal(column, mode = 'default', condition){

		var legend_array = this.state.legend.length ? this.state.legend : this.props.context.legend

		if(this.state.filteredLegend !== null)
			legend_array = this.state.filteredLegend

		if(!legend_array)
			return 0;

		var total = 0;

		legend_array.map((record, index) => {

			var value2add = mode === 'default' ? record[column] : 1;

			if(!condition){
				total += value2add;
				return true;
			}else{

				if(record[column] === condition){
					total += value2add;
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

		fetch('/json/ReferralTickets/referral_more.json')
		.then(res => res.json())
		.then(
			result => {
				this.setState({
					legend: result['referral-ballance'].legend
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

		if(this.state.filteredLegend !== null)
			legend_array = this.state.filteredLegend

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
						{legend_array.map((record, index) => {
							return(
								<tr key={index}>
									<td><span className="count">{record.count}</span> <span className="explanation">tickets</span></td>
									<td>{record.l1_referral}</td>
									<td>{record.active}</td>
									<td>{record.l2_referrals} <span className="explanation">referrals</span></td>
									<td>{record.l2_active} <span className="explanation">referrals</span></td>
								</tr>
							)
						})}
						</tbody>
						<tfoot>
							<tr>
								<td colSpan="5"><a className="lazy-trigger" href="#!" onClick={this.loadMore}>more</a></td>
							</tr>
							<tr>
								<td colSpan="5"><span className="table-summary-header">total</span></td>
							</tr>
							<tr>
								<td><span className="count">{this.getTotal('count')}</span> <span className="explanation">tickets</span></td>
								<td>{this.getTotal('l1_referral', 'count')} referreres</td>
								<td>yes {this.getTotal('active', 'count', "yes")} / no {this.getTotal('active', 'count', "no")} </td>
								<td>{this.getTotal('l2_referrals')} <span className="explanation">referrals</span></td>
								<td>{this.getTotal('l2_active')} <span className="explanation">referrals</span></td>
							</tr>
						</tfoot>
					</table>
				</div>
			</div>
		)
	}
}

export default ReferralTicketDetails;