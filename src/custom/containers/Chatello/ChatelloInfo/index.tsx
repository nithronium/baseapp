import * as React from 'react';

import { InjectedIntlProps, injectIntl } from 'react-intl';


type Props = InjectedIntlProps;

export class ChatelloInfoComponent extends React.Component<Props> {
    public translate = id => {
        return this.props.intl.formatMessage({ id });
    };

    public render() {
        return (
            <div className="pg-chatello-info">
                <div className="pg-chatello-info__header">
                    {this.translate('chatello.info.header1')}
                </div>
                <div className="pg-chatello-info__text">
                    {this.translate('chatello.info.text')}
                </div>
                <div className="pg-chatello-info__logo" />

                <div className="pg-chatello-info__header">
                    {this.translate('chatello.info.header2')}
                </div>

                <div className="pg-chatello-info__items">
                    {[1, 2, 3, 4, 5, 6].map(index => {
                        return (
                            <div className="pg-chatello-info__item" key={index}>
                                <div className={`pg-chatello-info__icon${index}`} />
                                <div className={`pg-chatello-info__item-text`} >
                                    {this.translate(`chatello.info.text${index}`)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export const ChatelloInfo = injectIntl(ChatelloInfoComponent);
