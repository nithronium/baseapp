import * as React from 'react';

import { InjectedIntlProps, injectIntl } from 'react-intl';

import { connect } from 'react-redux';

import { buildPath } from '../../../helpers';

import { RootState, selectCurrentLanguage } from '../../../../modules';


type Props = InjectedIntlProps;

class InstantExchangeTopInfoComponent extends React.Component<Props> {
    public translate = id => {
        return this.props.intl.formatMessage({ id });
    };

    public render() {
        const { lang } = this.props;

        return (
            <div className="instant-exchange__top-info">
                <div className="instant-exchange__top-header">
                    {this.translate('instantExchange.top.info.header')}
                </div>

                <div className="instant-exchange__top-green" />

                <div className="instant-exchange__top-items">
                    {[1, 2, 3].map(index => {
                        return (
                            <div className="instant-exchange__top-item" key={index}>
                                <div className={`instant-exchange__top-icon${index}`} />
                                {this.translate(`instantExchange.top.item${index}`)}
                            </div>
                        );
                    })}
                </div>

                <a
                    href={buildPath('/buycrypto', lang)}
                    className="instant-exchange__top-button"
                >
                    {this.translate(`instantExchange.top.button`)}
                </a>

            </div>
        );
    }
}

export const InstantExchangeTopInfo = connect((state: RootState) => ({
    lang: selectCurrentLanguage(state),
}), () => ({}))(injectIntl(InstantExchangeTopInfoComponent));
