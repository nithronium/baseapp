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
    levels: number;
    level: number;
    header: string;
    subheader: string;
    caption: string;
}


type Props = InjectedIntlProps & PassedProps;

class LevelCardComponent extends React.Component<Props>{
    public getStyle = (level, levels) => {
        if (levels < 3) {
            return {};
        }

        if (levels === 3) {
            return {
                fontSize: '16px',
            };
        }

        if (levels === 4) {
            if (level === 1) {
                return {
                    flex: '1 1 calc(50% - 20px)',
                    marginBottom: 15,
                };
            }
            if (level === 2) {
                return {
                    flex: '1 1 calc(50% - 20px)',
                    marginRight: 0,
                    marginBottom: 15,
                };
            }

            return {
                flex: '1 1 calc(50% - 20px)',
            };
        }

        if (levels === 5) {
            return [{}, {
                flex: '1 1 calc(50% - 20px)',
                marginBottom: 15,
                fontSize: '17px',
            }, {
                flex: '1 1 calc(50% - 20px)',
                marginRight: 0,
                marginBottom: 15,
                fontSize: '17px',
            }, {
                flex: '1 1 calc(33.3% - 20px)',
                fontSize: '16px',
            }, {
                flex: '1 1 calc(33.3% - 20px)',
                fontSize: '16px',
            }, {
                flex: '1 1 calc(33.3% - 20px)',
                fontSize: '16px',
                marginRight: 0,
            }][level];
        }

        return {};
    };

    public render(){
        const { level, header, subheader, caption, levels } = this.props;

        return(
            <div className="level-card" style={this.getStyle(level, levels)}>
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
