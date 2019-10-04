import React, {Component} from 'react';

class Card extends Component{


	getTotal(mode = 'all', summMode = null){

		if(!this.props.context.legend)
			return;

		var total = 0;
		this.props.context.legend.map(function(record, index){

			switch(mode){
				case 'active':
					if(record.active === "yes"){
						if(summMode === 'count'){
							total += 1;
						}else{
							total += record.count
						}
					}
					break;

				case 'inactive':
					if(record.active === "no"){
						if(summMode === 'count'){
							total += 1;
						}else{
							total += record.count;
						}
					}
					break;

				default: total += record.count; break;
			}
			return true;
		});
		return total;
	}


	activeInactive(){
		if(this.props.context.activeInactive){
			return(
				<div className="card-middle">
					<div className="card-details-row">
						<div className="card-details-row__left">referrals active</div>
						<div className="card-details-row__right">{this.getTotal('active', 'count')}</div>
					</div>
					<div className="card-details-row">
						<div className="card-details-row__left">referrals inactive</div>
						<div className="card-details-row__right">{this.getTotal('inactive', 'count')}</div>
					</div>
				</div>
			)
		}else{
			return(
				<div className="card-middle"></div>
			)
		}
	}



	render(){

		var preloader;
		if(!this.props.context.legend){
			preloader = (
				<div className="preloader">

				</div>
			)
		}else{
			preloader = null
		}
		return(

			<div className="Card">
				{preloader}
				<div className="card-top">
					<div className="card-top__left">
						<p className="card-top__left__header">{this.props.context.title}</p>
						<span className="card-top__left__suffix">tickets</span>
					</div>
					<div className="card-top__right">
						{this.getTotal()}
					</div>
				</div>
				{this.activeInactive()}
				<div className="card-bottom">
					<a href={this.props.link}>view details</a>
				</div>
			</div>

		)
	}
}

export default Card;