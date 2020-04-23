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
    level: number;
    header: string;
    subheader: string;
    caption: string;
}


type Props = InjectedIntlProps & PassedProps;

class LevelCardComponent extends React.Component<Props>{

    constructor(props){
        super(props);
    }
    public render(){
        const { level, header, subheader, caption } = this.props;
        return(
            <div className="level-card">
                <div className="level-card__level">
                    <div>{level}</div>
                    level
                </div>

                <div className="level-card__content">
                    <div className="level-card__header">
                        {header}
                    </div>

                    <div className="level-card__subheader">
                        {subheader}
                    </div>

                    <div className="level-card__caption">
                        {caption}
                    </div>
                </div>

            </div>
        );
    }
}

export const LevelCard = injectIntl(LevelCardComponent);
