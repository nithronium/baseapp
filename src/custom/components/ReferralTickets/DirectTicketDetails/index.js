import React, {Component} from 'react';

class DirectTicketDetails extends Component{

	constructor(props){

		super(props);
		this.state = {
			legend: this.props.context
		};

	}

	render(){

		var legend_array = [];

		if(this.props.context.legend)
			legend_array = this.props.context.legend

		return(

			<div className="direct-ticket-details">
				<div className="container">
					<div className="container-wrapper">
						<h2>Direct ticket details</h2>
						<table>
							<tbody>
							{legend_array.map((record, index) => {
								return(
									<tr key={index}>
										<td><span className="count">{record.count} </span><span className="explanation">tickets</span></td>
										<td><span className="count">{record.action}</span></td>
										<td><span className="count"><button className="button">get more</button></span></td>
									</tr>
								)
							})}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		)
	}
}

export default DirectTicketDetails;