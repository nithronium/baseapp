import * as React from 'react';
import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
// import { getReferral } from '../../../../api';
// import { exportToCsv } from '../../../helpers';

interface PassedProps {
    context: {
        referrals: [];
        type: string;
        skip: number;
        limit: number;
        count: number;
        loading: boolean;
    };

    iconName: string;
    title: string;
    text: string;
    emrxConverted?: string;
    usdConverted?: string;
}

type Props = InjectedIntlProps & PassedProps;

class InfoCardComponent extends React.Component<Props>{

    constructor(props){
        super(props);
    }

    public render(){

        const { iconName, title, text, emrxConverted, usdConverted } = this.props;

        return(
            <div className="info-card">
                <div className="info-card__icon">
                    <div className={`info-card__icon--${iconName}`} />
                </div>
                <div>
                    <div className="info-card__title">{title}</div>
                    <div className="info-card__text">{text}</div>
                    <div className="info-card__emrx">{emrxConverted}</div>
                </div>
                <div className="info-card__usd">{usdConverted}</div>
            </div>
        );
    }
}

export const InfoCard = injectIntl(InfoCardComponent);
