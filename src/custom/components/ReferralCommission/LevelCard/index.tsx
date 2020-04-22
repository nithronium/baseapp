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
}


type Props = InjectedIntlProps & PassedProps;

class LevelCardComponent extends React.Component<Props>{

    constructor(props){

        super(props);

    }
    public render(){

        return(
            <div className="pg-referral-commission__level-card">
                level-card
            </div>
        );
    }
}

export const LevelCard = injectIntl(LevelCardComponent);
