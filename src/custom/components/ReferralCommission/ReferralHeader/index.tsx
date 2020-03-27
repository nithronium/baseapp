import * as React from 'react';
import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import { connect } from 'react-redux';
import { Currency, RootState, selectUserInfo, User } from '../../../../modules';

import { CurrencySelect } from '../CurrencySelect';

export interface ReferralHeaderInterface {
    commission: {
        trade: number[];
        ieo: number[];
    };
    earned: {
        trade: number;
        ieo: number;
    };
    loading: boolean;
}

interface ReduxProps {
    user: User;
}

interface PassedProps {
    context: ReferralHeaderInterface;
    precision: number;
    title: string;
    link: string;
    currencyId: string;
    currencies: Currency[];
    changeCurrentCurrency(currencyId): void;
}

type Props = ReduxProps & PassedProps & InjectedIntlProps;
//tslint:disable
class ReferralHeaderContainer extends React.Component<Props> {
    public render() {
        const total = ((this.props.context.earned.trade || 0) + (this.props.context.earned.ieo || 0)).toFixed(this.props.precision);
        return (
            <div className="container recalculate">
                <div className="header">
                    <h1>{this.props.intl.formatMessage({id: 'referralCommission.rootScreen.referralBalance'})}</h1>
                    <CurrencySelect currencyId={this.props.currencyId} currencies={this.props.currencies} changeCurrentCurrency={this.props.changeCurrentCurrency}/>
                </div>
                <div className="contexter">
                    <div className="cards-wrapper">
                        {this.props.children}
                        <div className="summary recalculate">
                            <div className="title">{this.props.title}</div>
                            <div className="summary-container">
                                <div className="btc">{total} {this.props.currencyId.toUpperCase()}</div>
                                {/* <div className="usd">{this.props.context.usd} USD</div> */}
                                {/* <a className="details-link" href={this.props.link}>
                                    view details
                                </a> */}
                                <div className="referral-code">
                                    {/* <div className="header">
                                        Your referral code:
                                    </div>
                                    <div className="code">
                                        {this.props.user.uid}
                                    </div> */}
                                <a href="/profile">{this.props.intl.formatMessage({id: 'referralCommission.rootScreen.getYourReferralCode'})}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    user: selectUserInfo(state),
});

export const ReferralHeader = injectIntl(connect(mapStateToProps)(ReferralHeaderContainer));
