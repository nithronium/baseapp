import * as React from 'react';
import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';

interface PassedProps {
    commission: number[];
    earned: number;
    currencyId: string;
    header: string;
    link: string;
}

type Props = InjectedIntlProps & PassedProps;

class CardComponent extends React.Component<Props>{
    public render(){

        // let preloader;
        // if (!(this.props. && this.props.context.legend)){
        //     preloader = (
        //         <div className="preloader"/>
        //     );
        // }else{
        //     preloader = null;
        // }
        const earnedBase = (this.props.earned || 0);
        const basefactor = 1 / (10 ** this.props.precision);
        const earned = (earnedBase > 0 && earnedBase < basefactor) ? `< ${basefactor.toFixed(this.props.precision)}` : earnedBase.toFixed(this.props.precision);

        return(

            <div className="Card">
                {/* {preloader} */}
                <div className="card-top">
                    <div className="card-top__left">
                        <p className="card-top__left__header">{this.props.header}</p>
                    </div>
                </div>
                <div className="card-middle">
                    <div className="card-details-row">
                        <div className="card-details-row__left">{this.props.intl.formatMessage({id: 'referralCommission.card.referralL1'})}</div>
                        <div className="card-details-row__right">{`${((this.props.commission[0] || 0) * 100).toFixed(1)}%`}</div>
                    </div>
                    <div className="card-details-row">
                        <div className="card-details-row__left">{this.props.intl.formatMessage({id: 'referralCommission.card.referralL2'})}</div>
                        <div className="card-details-row__right">{`${((this.props.commission[1] || 0) * 100).toFixed(1)}%`}</div>
                    </div>
                </div>
                <div className="card-middle">
                    <div className="card-earned-header">{this.props.intl.formatMessage({id: 'referralCommission.card.earned'})}</div>
                    <div className="card-details-row">
                        {earned || 0} {this.props.currencyId.toUpperCase()}
                    </div>
                </div>
                <div className="card-bottom">
                    <a className="details-link" href={this.props.link}>{this.props.intl.formatMessage({id: 'referralCommission.card.viewDetails'})}</a>
                </div>
            </div>

        );
    }
}

export const Card =  injectIntl(CardComponent);
