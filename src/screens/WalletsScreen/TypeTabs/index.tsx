/* tslint:disable */
import * as React from 'react';
import { injectIntl } from 'react-intl';

const setTabStyle = (isActive) => ({
    padding: '10px 0',
    flex: '1 1 auto',
    cursor: 'pointer',
    background: isActive ? '#11B382' : 'none',
    border: isActive?  'none' : '1px solid #FFFFFF33',
    color: isActive ?  '#FFFFFF' : '#FFFFFF33',
})

export const TypeTabs = injectIntl(({intl, currency, action, wire, sepa, card}) => {
    const translate = (id) => intl.formatMessage({id});
    const onWireClick = () => action({ card: false, sepa: false, wire: true });
    const onSepaClick = () => action({ card: false, sepa: true, wire: false });
    const onCardClick = () => action({ card: true, sepa: false, wire: false });

    const nothingSelected = (currency !== 'eur') && sepa;

    if (nothingSelected) {
        onWireClick();
    }

    return  (
        <div style={{                       //Tabs pannel (Wire/ Sepa/ Card)
            display: 'flex',
            textAlign: 'center',
            padding: '0 20px',
            fontSize: '18px',
            color: 'white',
            marginBottom: '15px'
        }}>
            <div 
                style={{borderRadius: '5px 0 0 5px', ...setTabStyle(wire)}}
                onClick={onWireClick}
            >
                {translate('page.body.wallets.tabs.deposit.fiat.button.wire')}
            </div>
            { currency === 'eur' && 
            <div 
                style={{...setTabStyle(sepa)}}
                onClick={onSepaClick}>
                {translate('page.body.wallets.tabs.deposit.fiat.button.sepa')}
            </div>
            }
            <div 
                style={{borderRadius: '0 5px 5px 0', ...setTabStyle(card)}}
                onClick={onCardClick}
            >
                {translate('page.body.wallets.tabs.deposit.fiat.button.card')}
            </div>
        </div>)
});
