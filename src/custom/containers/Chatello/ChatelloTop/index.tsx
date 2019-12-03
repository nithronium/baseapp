import * as React from 'react';

import { InjectedIntlProps, injectIntl } from 'react-intl';

type Props = InjectedIntlProps;

export class ChatelloTopComponent extends React.Component<Props> {
    public translate = id => {
        return this.props.intl.formatMessage({ id });
    };

    public render() {
        return (
            <div className="pg-chatello__top">
                <div className="pg-chatello__top-red-bg">
                    <div className="pg-buy-with-credit-card__container">
                        <div className="pg-chatello__top-wrap">
                            <div className="pg-chatello__top-phone" />

                            <div>
                                <div className="pg-chatello__top-header">
                                    {this.translate('chatello.top.header')}
                                </div>
                                <div className="pg-chatello__top-text">
                                    {this.translate('chatello.top.text')}
                                </div>
                                <div className="pg-chatello__top-phone--small" />


                                <div className="pg-chatello__top-items">
                                    <div className="pg-chatello__top-item">
                                        <div className="pg-chatello__top-item-icon1" />
                                        <div className="pg-chatello__top-item-text">
                                            {this.translate('chatello.top.item1')}
                                        </div>
                                    </div>
                                    <div className="pg-chatello__top-item">
                                        <div className="pg-chatello__top-item-icon2" />
                                        <div className="pg-chatello__top-item-text">
                                            {this.translate('chatello.top.item2')}
                                        </div>
                                    </div>
                                    <div className="pg-chatello__top-item">
                                        <div className="pg-chatello__top-item-icon3" />
                                        <div className="pg-chatello__top-item-text">
                                            {this.translate('chatello.top.item3')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pg-buy-with-credit-card__container">
                    <div className="pg-chatello__top-app">
                        <div className="pg-chatello__top-header">
                            {this.translate('chatello.top.app.header')}
                        </div>

                        <div className="pg-chatello__top-app-items">
                            <div className="pg-chatello__top-app-item-wrap">
                                <div className="pg-chatello__top-app-item">
                                    {this.translate('chatello.top.app.item1')}
                                </div>
                            </div>
                            <div className="pg-chatello__top-app-item-wrap">
                                <div className="pg-chatello__top-app-item">
                                    {this.translate('chatello.top.app.item2')}
                                </div>
                            </div>
                            <div className="pg-chatello__top-app-item-wrap">
                                <div className="pg-chatello__top-app-item last">
                                    {this.translate('chatello.top.app.item3')}
                                </div>
                            </div>
                        </div>

                        <div className="pg-chatello__top-app-require">
                            {this.translate('chatello.overlay1.footer')}
                        </div>
                        <div className="pg-chatello__top-app-links">
                            <a
                                href="https://apps.apple.com/us/app/chatello/id1369821031?ls=1"
                                className="pg-chatello__top-app-link1"
                                target="_blank"
                                rel="noopener noreferrer"
                            >&nbsp;</a>
                            <a
                                href="https://play.google.com/store/apps/details?id=com.chatello.app"
                                className="pg-chatello__top-app-link2"
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


export const ChatelloTop = injectIntl(ChatelloTopComponent);
