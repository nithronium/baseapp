import * as React from 'react';

import { InjectedIntlProps, injectIntl } from 'react-intl';

type Props = InjectedIntlProps;

export class ChatelloTop2Component extends React.Component<Props> {
    public translate = id => {
        return this.props.intl.formatMessage({ id });
    };

    public render() {
        return (
            <div className="pg-chatello__top2">
                <div className="pg-chatello__top2-wrap">
                    <div className="pg-chatello__top2-face1" />
                    <div className="pg-chatello__top2-face2" />
                    <div className="pg-chatello__top2-face3" />
                    <div className="pg-chatello__top2-face4" />
                    <div className="pg-chatello__top2-face5" />
                    <div className="pg-chatello__top2-face6" />
                    <div className="pg-chatello__top2-face7" />

                    <div className="pg-chatello__top2-phone" />

                    <div className="pg-chatello__top2-right">
                        <div className="pg-chatello__top2-header">
                            {this.translate('chatello.top2.header')}
                        </div>

                        <div className="pg-chatello__top2-text">
                            {this.translate('chatello.top2.text')}
                        </div>
                        <div className="pg-chatello__top2-subheader">
                            {this.translate('chatello.top2.subheader')}
                        </div>

                        <div className="pg-chatello__top2-items">
                            <div className="pg-chatello__top2-item">
                                <div className="pg-chatello__top2-item-icon1" />
                                <div className="pg-chatello__top2-item-triangle1" />
                                <div className="pg-chatello__top2-item-text">
                                    {this.translate('chatello.top2.item1')}
                                </div>
                            </div>
                            <div className="pg-chatello__top2-item">
                                <div className="pg-chatello__top2-item-icon2" />
                                <div className="pg-chatello__top2-item-triangle2" />
                                <div className="pg-chatello__top2-item-text">
                                    {this.translate('chatello.top2.item2')}
                                </div>
                            </div>
                            <div className="pg-chatello__top2-item">
                                <div className="pg-chatello__top2-item-icon3" />
                                <div className="pg-chatello__top2-item-triangle3" />
                                <div className="pg-chatello__top2-item-text">
                                    {this.translate('chatello.top2.item3')}
                                </div>
                            </div>
                        </div>

                        <div className="pg-chatello__top2-footer">
                            <div className="pg-chatello__top2-footer-text">
                                {this.translate('chatello.overlay1.footer')}
                            </div>
                            <a
                                className="pg-chatello__top2-app-store"
                                href="https://apps.apple.com/us/app/chatello/id1369821031?ls=1"
                                target="_blank"
                                rel="noopener noreferrer"
                            >&nbsp;</a>
                            <a
                                className="pg-chatello__top2-google-play"
                                href="https://play.google.com/store/apps/details?id=com.chatello.app"
                                target="_blank"
                                rel="noopener noreferrer"
                            >&nbsp;</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export const ChatelloTop2 = injectIntl(ChatelloTop2Component);
