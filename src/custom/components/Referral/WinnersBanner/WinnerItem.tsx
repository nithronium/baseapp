/* tslint:disable */
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';

export interface Winner {
    number: number;
    value: number;
    currency: string;
}


interface WinnerItemProps extends InjectedIntlProps{
    data: Winner;
}

export const WinnerItem: React.FC<WinnerItemProps> = injectIntl(({data, intl}) => (
    <div className="winner-list-item">
        <span className="winner-item-number">{intl.formatMessage({id: 'page.referral.winnersbanner.ticketnum'})}{data.number}</span>
        <div>
            <span className="winner-item-value">{`$${data.value} in`} </span>
            <span className="winner-item-cur">{data.currency}</span>
            {data.currency === 'EMRX' &&
            <div>
                <div className="winner-item-value">+</div>
                <span className="winner-item-value">{`$${data.value} in`} </span>
                <span className="winner-item-cur">BTC</span>
            </div>
            }
        </div>
    </div>));
